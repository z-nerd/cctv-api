import mongoClient from "../database/mongo/client.ts"
import { Crud } from "../database/mongo/crud.ts"
import { ISystem } from "./type.ts"


export const Init = async () => {
    const db = "cctv"
    const col = "system"
    const System = new Crud<ISystem>(mongoClient, db, col)


    if( (await System.findAll({})).count === 0 ) {
        // TODO: Make create Index automatic
    }
}