import { config } from "dotenv"
import { MongoClient } from "mongo"


const uri = Deno.env.get("MONGODB_URI") || config().MONGODB_URI
const mongoClient = new MongoClient()


try {
    await mongoClient.connect(uri)
    console.log("Database connected!")
} catch (error) {
    console.log(`Faild to connect to database: ${error}`)
}


export default mongoClient