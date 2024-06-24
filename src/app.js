import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import { router } from './routes/book.routes.js';
import mongoose from 'mongoose';

dotenv.config();
const app = express();
app.use(bodyParser.json()); //parseador de bodies


//acáconectamos la base de datos
mongoose.connect(process.env.MONGO_URL, {dbName: process.env.MONGO_DB_NAME});
const db = mongoose.connection;

//middleware para usar las rutas
app.use('/books', router);

const port = process.env.PORT || 3000;

app.listen(port, ()=>{
    console.log(`Escuchando el servidor en http://localhost:${port}`);
})