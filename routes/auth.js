const auth=require("../middleware/auth")
const router=require('express').Router()
const User=require("../models/user")
const bcrypt=require("bcryptjs")
const jwt=require("jsonwebtoken")
const config=require("config")
const {check,validationResult}=require("express-validator")



router.get('/',auth,async(req,res)=>{
    try{
        const user=await User.findById(req.user.id).select("-password")
        res.json(user)
    }catch(err){
        console.error(err.message)
        res.status(500).json({msg:"Server Error"})
    }
    
})


router.post("/",[
    check("email","Invalid email").isEmail(),
    check("password","password must be at least 6 character").exists()
],async(req,res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {email,password}=req.body
    try{    
    //email exist database
        let user=await User.findOne({email})
        if(!user){
            return res.status(400).json({msg:"Invalid Credential"})
        }
    
    //compare password 
        const isMatch=await bcrypt.compare(password,user.password)
        if (!isMatch){
            return res.status(400).json({msg:"Invalid Credential"})
        }
      const payload={
          user:{
              id:user.id
          }
      }
      jwt.sign(payload,config.get("jwtSecret"),{expiresIn:50000},(err,token)=>{
          if(err) throw err;
          res.json({token})
      })
    }catch(err){
        console.error(err.message)
        res.status(500).json({msg:'Server Eroor'})
    }
    //token id 

})

//@access Private
//@desc delete a particular user
//@route /api/signup/:id

router.delete("/:id",async(req,res)=>{
    try{
        await User.findByIdAndDelete(req.params.id)
        res.json({msg:"Deleted User Succesfully"})
    }catch(err){
        console.error(err.message)
        res.status(500).json({msg:'Server Eroor'})
    }
})





module.exports=router
