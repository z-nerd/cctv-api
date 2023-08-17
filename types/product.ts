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

export interface IProductImage{
    _id: ObjectId
    base64: string
}