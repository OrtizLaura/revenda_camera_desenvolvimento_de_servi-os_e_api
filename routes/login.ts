import jwt from "jsonwebtoken"
import { PrismaClient } from "@prisma/client"
import { Router } from "express"
import bcrypt from 'bcrypt'


const prisma = new PrismaClient({
  log: [
    {
      emit: 'event',
      level: 'query',
    },
    {
      emit: 'stdout',
      level: 'error',
    },
    {
      emit: 'stdout',
      level: 'info',
    },
    {
      emit: 'stdout',
      level: 'warn',
    },
  ],
})

prisma.$on('query', (e) => {
  console.log('Query: ' + e.query)
  console.log('Params: ' + e.params)
  console.log('Duration: ' + e.duration + 'ms')
})

const router = Router()

router.post("/", async (req, res) => {
  const { email, senha } = req.body

  const mensaPadrao = "Login ou senha incorretos"

  if (!email || !senha) {
    res.status(400).json({ erro: mensaPadrao })
    return
  }

  try {
    const usuario = await prisma.usuario.findFirst({
      where: { email }
    })

    if (usuario == null) {
      
      res.status(400).json({ erro: mensaPadrao })
      return
    }

    
    if (bcrypt.compareSync(senha, usuario.senha)) {
      const token = jwt.sign({
        userLogadoId: usuario.id,
        userLogadoNome: usuario.nome
      },
        process.env.JWT_KEY as string,
        { expiresIn: "20m" }
      )

      await prisma.log.create({
        data: { 
          descricao: "Login com sucesso!", 
          complemento: `Usuário: ${usuario.email}`,
          usuarioId: usuario.id
        }
      })

      let msgSistema = "";

      if (usuario.ultimoLogin == null) {
        msgSistema = `Seja bem vindo ${usuario.nome}... Este é o seu primeiro acesso ao sistema`
      } else {
        const dataFormatada = usuario.ultimoLogin.toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          second: 'numeric',
        })
        msgSistema = `Seja bem vindo ${usuario.nome}... Seu último acesso ao sistema foi ${dataFormatada}`
      }   

      await prisma.usuario.update({
        where: { id: Number(usuario.id) },
        data: {
          ultimoLogin: new Date(),
        }
      })

      res.status(200).json({
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        token,
        mensagem_sistema: msgSistema
      })
    } else {
      await prisma.log.create({
        data: { 
          descricao: "Tentativa de Acesso Inválida", 
          complemento: `Usuário: ${usuario.email}`,
          usuarioId: usuario.id
        }
      })

      res.status(400).json({ erro: mensaPadrao })
    }
  } catch (error) {
    res.status(400).json(error)
  }
})

export default router