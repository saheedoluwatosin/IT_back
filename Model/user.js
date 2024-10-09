
const mongoose = require("mongoose")


const user = mongoose.Schema({
    name:{type:String, required:true},
    password:{type:String , required:true}
},
{
    timestamp:true
})

const User = mongoose.model("user",user)


module.exports = {
    User
}

