import { MongoClient } from "mongo"
import { envVariable } from "../../utils/env.ts"
import { getNetworkAddr } from "local_ip"
import { getIP } from "get_ip"


const mongoUri = envVariable<string>('MONGO_URI', 'string', false)
const hostP = envVariable<string>('MONGO_HOST_P')
const portP = envVariable<number>('MONGO_PORT_P', 'number')
const hostS1 = envVariable<string>('MONGO_HOST_S1')
const portS1 = envVariable<number>('MONGO_PORT_S1', 'number')
const hostS2 = envVariable<string>('MONGO_HOST_S2')
const portS2 = envVariable<number>('MONGO_PORT_S2', 'number')
const username = envVariable<string>('MONGO_USERNAME')
const password = envVariable<string>('MONGO_PASSWORD')
const db = envVariable<string>('MONGO_DBNAME')
const tls = envVariable<boolean>('MONGO_TLS', 'boolean')
const mongoClient = new MongoClient(mongoUri)


try {
    await mongoClient.connect()
    console.log("Database connected!")
} catch (error) {
    console.log(`Can't connect to mongodb Atlas from: 
    Local IP: ${await getNetworkAddr()}
    Public IP: ${await getIP({ipv6: true})}
    Error name: ${error.name}
    Error message: ${error.message}
    Error: ${error}
    `)
}



// try {
//     if (mongoUri)
//         await mongoClient.connect(mongoUri)
//     else
//         await mongoClient.connect({
//             db,
//             tls,
//             servers: [
//                 { host: hostP, port: portP},
//                 { host: hostS1, port: portS1},
//                 { host: hostS2, port: portS2}
//             ],
//             credential: {
//                 username,
//                 password,
//                 db,
//                 mechanism: 'SCRAM-SHA-1',
//             }
//         })
//     console.log("Database connected!")
// } catch (error) {
//     console.log(`Can't connect to mongodb Atlas from: 
//     Local IP: ${await getNetworkAddr()}
//     Public IP: ${await getIP({ipv6: true})}
//     `);

//     console.log(`Faild to connect to database: ${error}`)
// }


export default mongoClient