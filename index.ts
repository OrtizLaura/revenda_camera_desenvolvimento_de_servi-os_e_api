import express from 'express'
import routesUsuarios from './routes/usuarios'
import routesCameras from './routes/cameras'
import routesLogin from './routes/login'


const app = express()
const port = 3000

app.use(express.json())
app.use("/usuarios", routesUsuarios)

app.use("/cameras", routesCameras)
app.use("/login", routesLogin)

app.get('/', (req, res) => {
  res.send('API de Cadastro de Cameras')
})

app.listen(port, () => {
  console.log(`Servidor rodando na porta: ${port}`)
})