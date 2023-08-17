import { ObjectId } from "mongo"


export interface IProduct{
    _id: ObjectId
    name: string
    price: string
    description: string
    productImageId: string
    createdDate: string
    lastModifiedDate: string
}


export interface IProductImage{
    _id: ObjectId
    src: string
    alt: string
    createdDate: string
    lastModifiedDate: string
}