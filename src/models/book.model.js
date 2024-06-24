import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
    title:String,
    author:String,
    genre: String,
    publication_date: String
})

export const bookModel = mongoose.model('book', bookSchema);