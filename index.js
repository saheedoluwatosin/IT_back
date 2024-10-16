

const express = require("express")
const mongoose = require("mongoose")
const dotenv = require("dotenv").config()
const cors = require("cors")
const router = require("./Router/router")


const app = express()
app.use(express.json())
app.use(cors())
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

mongoose.connect(`${process.env.MONGO_DB}`)
        .then(()=>{
           console.log("Mongodb connected!!!") 
        })



const PORT = process.env.PORT || 5000

app.listen(PORT,()=>{
    console.log(`Server listening on ${PORT}`)
})

app.use(router)