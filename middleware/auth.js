const jwt=require("jsonwebtoken")
const config=require("config")

module.exports= function(req,res,next){
    const token=req.header("x-auth-token")
    if(!token){
        return res.status(400).json({msg:"No token "})
    }
    try{
      const decoded = jwt.verify(token,config.get("jwtSecret"))
      req.user=decoded.user
      next()
    }catch(err){
        console.error(err.message)
        res.status(400).json({msg:"token not authorized"})
    }
   
}

