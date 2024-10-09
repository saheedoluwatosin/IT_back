const mongoose = require("mongoose")


const article = mongoose.Schema({
    title: String,
    content: String,
    createdAt: { type: Date, default: Date.now }
})

const Article = mongoose.model("article",article)


module.exports = Article

