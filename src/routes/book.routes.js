import express from 'express';
import { bookModel } from '../models/book.model.js';

export const router = express.Router();


//MIDDLEWARE propio
const getBook = async(req, res, next) => {
    let book;
    const {id} = req.params;

    //ID de mongo
    if(!id.match(/^[0-9a-fA-F]{24}$/)){
        return res.status(404).json(
           { message:'El ID del libro no es válido'}
        )
    }

    try {
        book = await bookModel.findById(id);
        if(!book){
            return res.status(404).json(
                {message:'El libro no fue encontrado'}
            )
        }
    } catch(error){
       return res.status(500).json({ message: error.message });
    }

    //no entiendo el res.book = book
    res.book = book;
    next();
}


//Obtener todos los libros
router.get('/', async (req, res) => {
    try {
        const books = await bookModel.find();
        console.log('GET ALL', books);
        if (books.length === 0) {
           return res.status(204).json([]);
        }
        res(books);
    } catch (error) {
        //error base datos
        res.status(500).json({ message: error.message });
    }
})


//Crear un nuevo libro [post]
router.post('/', async(req, res) => {
    const {
        title,
        author,
        genre,
        publication_date
    } = req?.body

    if(!title || !author || !genre || !publication_date){
        return res.status(400).jsonjson({ message: 'Todos los campos son obligatorios' })
    }

    const book = new bookModel({
        title,
        author,
        genre,
        publication_date
    })

    try{
        const newBook = await book.save();
        console.log('GET ALL', newBook);
        res.status(201).json(newBook);
    }catch (error) {
        //bad request
        res.status(400).json({ message: error.message });
    }
})

//obtener un libro por su id
router.get('/:id', getBook, async (req, res) => {
    res.json(res.book);
})

//Actualizar permanentemente un libro por su id
router.put('/:id', getBook, async (req, res) => {
    try {
        const book = res.book
        book.title = req.body.title || book.title;
        book.author = req.body.author || book.author;
        book.genre = req.body.genre || book.genre;
        book.publication_date = req.body.publication_date || book.publication_date;

        const updatedBook = await book.save()
        res.json(updatedBook)
    } catch (error) {
        res.status(400).json({
            message: error.message
        })
    }
})

//Actualizar parcialmente un libro por su id
router.patch('/:id', getBook, async (req, res) => {

    if (!req.body.title && !req.body.author && !req.body.genre && !req.body.publication_date) {
        res.status(400).json({
            message: 'Al menos uno de estos campos debe ser enviado: Título, Autor, Género o fecha de publicación'
        })

    }

    try {
        const book = res.book
        book.title = req.body.title || book.title;
        book.author = req.body.author || book.author;
        book.genre = req.body.genre || book.genre;
        book.publication_date = req.body.publication_date || book.publication_date;

        const updatedBook = await book.save()
        res.json(updatedBook)
    } catch (error) {
        res.status(400).json({
            message: error.message
        })
    }
})


//Eliminar un libro por su id
router.delete('/:id', getBook, async (req, res) => {
    try {
        const book = res.book
        await book.deleteOne({
            _id: book._id
        });
        res.json({
            message: `El libro ${book.title} fue eliminado correctamente`
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
})
