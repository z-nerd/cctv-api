import { ObjectId } from "mongo"
import { IProduct } from "../types/product.ts"
import { RouterContext } from "oak"
import mongoClient from "../database/mongo/client.ts"
import { Crud } from "../database/mongo/crud.ts"
// import { faker } from "faker"


const db = "cctv"
const col = "products"
const Products = new Crud<IProduct>(mongoClient, db, col)


export const createProduct = async ({ request, response }: RouterContext<any>) => {
    const {
        name,
        description,
        price,
        imgAlt,
        imgSrc,
    } = await request.body().value
    const createdDate = new Date().toISOString()

    const _id = await Products.create({
        _id: new ObjectId,
        name,
        description,
        price,
        imgAlt,
        imgSrc,
        createdDate,
        lastModifiedDate: createdDate,
    })

    response.status = 201
    response.body = { id: _id }
}


export const getProducts = async ({ response, state }: RouterContext<any>) => {
    const allProducts = await Products.findAll({})

    response.status = 200
    response.body = allProducts
}


export const getProductById = async ({
    params,
    response
}: RouterContext<any, { id: string }>) => {
    const id = params.id
    const product = await Products.find({ _id: new ObjectId(id) })

    if (!product) {
        response.status = 404
        response.body = { message: `no product with Id: ${id}` }
        return
    }
    response.status = 200
    response.body = product
}


export const deleteProductById = async ({
    params,
    response
}: RouterContext<any, { id: string }>) => {
    const id = params.id
    const product = await Products.delete({ _id: new ObjectId(id) })

    if (!product) {
        response.status = 404
        response.body = { message: `no product with Id: ${id}` }
        return
    }
    response.status = 200
    response.body = product
}


export const updateProductById = async ({
    params,
    response,
    request,
}: RouterContext<any, { id: string }>) => {
    const id = params.id
    const {
        name,
        description,
        price,
        imgAlt,
        imgSrc
    } = await request.body().value


    const product = await Products.update({ _id: new ObjectId(id) },
        {
            $set: {
                name,
                description,
                price,
                imgAlt,
                imgSrc,
                lastModifiedDate: new Date().toISOString()
            }
        })

    if (product.matchedCount === 0) {
        response.status = 404
        response.body = { message: `no product with Id: ${id}` }
        return
    }

    response.status = 200
    response.body = product
}