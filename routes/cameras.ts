import { Classificacao, PrismaClient } from '@prisma/client'
import { Router } from 'express'
import { z } from 'zod'
import { verificaToken } from '../middlewares/verificaToken'

const prisma = new PrismaClient()
const router = Router()

const cameraSchema = z.object({
  modelo: z.string().min(1,
    { message: "Modelo deve ter, no mínimo, 1 caracteres" }),
  marca: z.string().min(3,
    { message: "Marca deve ter, no mínimo, 3 caracteres" }),
  ano: z.number().min(2010,
    { message: "Ano deve ser superior ou igual a 2010" }),
  preco: z.number().positive(
    { message: "Preço não pode ser negativo" }),
  classificacao: z.nativeEnum(Classificacao),
  usuarioId: z.number(),
})

router.get("/", async (req, res) => {
  try {
    const cameras = await prisma.camera.findMany({
      orderBy: { id: 'desc' },
      where: {
        deletedAt: null
      }
    })
    res.status(200).json(cameras)
  } catch (error) {
    res.status(500).json({erro: error})
  }
})

router.post("/", verificaToken, async (req, res) => {
  const valida = cameraSchema.safeParse(req.body)
  if (!valida.success) {
    res.status(400).json({ erro: valida.error })
    return
  }

  try {
    const camera = await prisma.camera.create({
      data: valida.data
    })
    res.status(201).json(camera)
  } catch (error) {
    res.status(400).json({ error })
  }
})

router.delete("/:id", verificaToken, async (req, res) => {
  const { id } = req.params

  try {
    const camera = await prisma.camera.update({
      where: { id: Number(id) },
      data: {
        deletedAt: new Date(),
      },
    })
    res.status(200).json(camera)
  } catch (error) {
    res.status(400).json({ erro: error })
  }
})

router.put("/:id", verificaToken, async (req, res) => {
  const { id } = req.params

  const valida = cameraSchema.safeParse(req.body)
  if (!valida.success) {
    res.status(400).json({ erro: valida.error })
    return
  }

  try {
    const camera = await prisma.camera.update({
      where: { id: Number(id) },
      data: valida.data
    })
    res.status(200).json(camera)
  } catch (error) {
    res.status(400).json({ error })
  }
})

export default router
