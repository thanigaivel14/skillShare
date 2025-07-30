import { log } from "console"
import mongoose from "mongoose"
 const connect= async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI)
        log("database connected... ")
        


        
    }
    catch(e){
        console.log(`error:${e.message}`)
    }
}
export default connect