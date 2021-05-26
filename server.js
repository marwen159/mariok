const express=require("express")
const app=express()
const connectDB=require("./config/config")

connectDB()
app.use(express.json())
app.use("/api/signup",require("./routes/userRouter"))
app.use("/api/auth",require("./routes/auth"))
app.use("/api/post",require("./routes/post"))
const PORT=process.env.PORT || 5000
app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`)
})
