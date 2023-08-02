import { ObjectId } from "mongo"


export interface IProduct{
    _id: ObjectId
    name: string
    price: string
    description: string
    imgSrc: string
    imgAlt: string
    createdDate: string
    lastModifiedDate: string
}