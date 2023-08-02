import { ObjectId } from "mongo"


export interface ISystem{
    _id: ObjectId
    title: string
    createdDate: string
    lastModifiedDate: string
}