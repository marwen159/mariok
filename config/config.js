const mongoose=require("mongoose")
const config=require("config")

module.exports = async() =>{
    try {
        await mongoose.connect(config.get("MONGOURL"),{
            useNewUrlParser:true,
            useUnifiedTopology:true,
            useCreateIndex:true
        })
        console.log("mongo db is connected to the server")
    } catch (err) {
        console.error(err.message)
        process.exit(1)
    }
}