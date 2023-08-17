import mongoClient from "../database/mongo/client.ts"
import { Crud } from "../database/mongo/crud.ts"
import { ISystem } from "./type.ts"


export const Init = async () => {
    const db = "cctv"
    const col = "system"
    const System = new Crud<ISystem>(mongoClient, db, col)

    // await Deno.mkdir(Deno.cwd() + "/uploads/product-imge", { recursive: true })


    if( (await System.findAll({})).count === 0 ) {
        // TODO: Make create Index automatic
    }
}