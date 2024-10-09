const Article = require("../Model/article")
const { User } = require("../Model/user")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")





const register = async (request,response)=>{
    const {name,password}= request.body
    const already = await User.findOne({name,password})
    if(already){
        return response.status(400).json({
            message:"kindly login"
        })
    }
    if(password.length < 8){
        return response.status(400).json({message:"Password must be 8 character or more"})

    }
    
    const hashedPassword = await bcrypt.hash(password,12)
    const newuser = new User({name,password: hashedPassword})
    await newuser.save()

    return response.status(200).json({
        message:"Registration Successful",
        newuser
    })

}


const login =async (request,response)=>{
    try {
        const{name,password} = request.body

        const user_login = await User.findOne({name})
        if(!user_login){
            return response.status(400).json({message:"User not found"})
        }

        const comparedPaasword = await bcrypt.compare(password,user_login.password)
        if(!comparedPaasword){
            return response.status(400).json({
                message:"Incorrect Username or Password"
            })
        }

        const accessToken = jwt.sign({user_login},`${process.env.ACCESS_URL}`,{expiresIn:"7d"})

        return response.status(200).json({
            message:"Successful Login",
            accessToken,
            user: user_login._id
            
        })
    } catch (error) {
        return response.status(500).json({
            message: error.message
        })
    }
}


const addarticle = async (request,response)=>{
    const {title,content} = request.body
    const article = new Article({title,content})
    await article.save()

    return response.status(200).json({
        message:"Article Created"
    })
}

const getall = async (request,response)=>{
    const article = await Article.find()
    return response.status(200).json({message:"all articles"})
}



module.exports = {
    register,
    addarticle,
    getall,
    login
}