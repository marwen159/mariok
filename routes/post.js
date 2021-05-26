const router = require('express').Router()
const auth=require("../middleware/auth")
const User=require("../models/user")
const Post=require("../models/post")
const {upload} = require("../filehelper")


router.post("/",auth,upload.array('files'),async(req,res,next)=>{
    try{
        const user= await User.findById(req.user.id).select("-password")
        let fileArrays=[]
        req.files.forEach(element=>{
            const file={
                fileName:element.originalname,
                filePath:element.path,
                fileType:element.mimetype
            }
            fileArrays.push(file)
        })
        const newPost=new Post({
            text:req.body.post,
            name:user.name,
            avatar:user.avatar,
            user:req.user.id,
            files:fileArrays
        })
        const post = await newPost.save()
        res.json(post)


    }catch(err){
        console.error(err.message)
        res.status(500).json({msg:"Server Error"})
    }
})

const fileSizeFormatter = (bytes,decimal)=>{
    if(bytes ===0){
        return "0 Bytes"
    }
    const dm = decimal || 2
    const sizes=['Bytes','KB','MB','GB','TB']
    const index = Math.floor(Math.log(bytes) / Math.log(1000))
    return parseFloat((bytes / Math.pow(1000,index)).toFixed(dm) + "-" + sizes[index])
}


module.exports = router