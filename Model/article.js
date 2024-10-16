const mongoose = require("mongoose")



const stepschema = mongoose.Schema({
    text:String , 
    image:String
})



const article = mongoose.Schema({
    title: String,
    steps:[stepschema],
    createdAt: { type: Date, default: Date.now }
})

const Article = mongoose.model("article",article)


module.exports = Article

