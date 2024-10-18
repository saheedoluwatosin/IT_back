const Article = require("../Model/article")
const { User } = require("../Model/user")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const multer = require("multer")
const path = require("path")


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname))
    }
});


const upload = multer({ storage: storage });



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

const addarticle = [
    upload.array('images', 20),  // Allow up to 10 images to be uploaded
    async (req, res) => {
        try {
            const { title, steps } = req.body;
            const parsedSteps = JSON.parse(steps);  // Ensure steps are parsed correctly

            const articleSteps = parsedSteps.map((step, index) => ({
                text: step.text,
                image: req.files[index] ? `/uploads/${req.files[index].filename}` : null  // Store relative path
            }));

            const article = new Article({
                title,
                steps: articleSteps
            });

            await article.save();

            return res.status(201).json({
                message: "Article Created",
                articleId: article._id
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Error creating article" });
        }
    }
];


const getall = async (request,response)=>{
    const article = await Article.find()
    return response.status(200).json({message:"all articles",
        article
    })
}

const getArticle = async (request, response) => {
    
    try {
        const { id } = request.params; // Get the article ID from the request params
    const article = await Article.findById(id); // Find the article by ID

    if (!article) {
        return response.status(404).json({ message: "Article not found" });
    }

    return response.status(200).json(article); // Return the article details
    } catch (error) {
        return response.status(500).json({message: error.message})
    }
};



module.exports = {
    register,
    addarticle,
    getall,
    login,
    getArticle
}