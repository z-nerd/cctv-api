import { config } from "dotenv"
import { MongoClient } from "mongo"


const uri = config().MONGODB_URI
const mongoClient = new MongoClient()


try {
    await mongoClient.connect(uri)
    console.log("Database connected!")
} catch (error) {
    console.log(`Faild to connect to database: ${error}`)
}


export default mongoClient