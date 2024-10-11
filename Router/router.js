const validtoken = require("../authentication/auth")
const { register, getall, addarticle, login, getArticle } = require("../Controller/control")

const express = require("express")
const router = express.Router()

router.post("/register",register)
router.post("/login",login)
router.get("/allarticle",getall)
router.get("/allarticle/:id",getArticle)
router.post("/addpost",validtoken,addarticle)


module.exports = router