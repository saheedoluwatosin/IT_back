const validtoken = require("../authentication/auth")
const { register, getall, addarticle, login } = require("../Controller/control")

const express = require("express")
const router = express.Router()

router.post("/register",register)
router.post("/login",login)
router.get("/allarticle",getall)
router.post("/addpost",validtoken,addarticle)


module.exports = router