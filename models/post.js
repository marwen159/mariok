const mongoose = require("mongoose")

const Schema=mongoose.Schema

const postSchema= new Schema({
    user:{
        type:Schema.Types.ObjectId,
        ref:"users"
    },
    text:{
        type:String
    },
    avatar:{
        type:String
    },
    name:{
        type:String
    },
    likes:[
    {
        user:{
            type:Schema.Types.ObjectId,
            ref:"users"
        }
    }
    ],
    comments:[
        {
            user:{
                type:Schema.Types.ObjectId,
                ref:"users"
            } ,
            text:{
                type:String
            }, 
            avatar:{
                type:String
            },
            name:{
                type:String
            },
            date:{
                type:Date,
                default:Date.now
            }
        }
    ],
    reports:[
        {
            user:{
                type:Schema.Types.ObjectId,
                ref:"users"
            } ,
            text:{
               type:String
            }, 
            avatar:{
                type:String
            },
            name:{
                type:String
            },
            date:{
                type:Date,
                default:Date.now
            }
        }
    ],
    files:[Object],
    date:{
        type:Date,
        default:Date.now
    }
})


module.exports = Post = mongoose.model("post",postSchema)