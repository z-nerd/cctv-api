import { ObjectId } from "mongo"
import { IProduct } from "../types/product.ts"
import { RouterContext } from "oak"
import mongoClient from "../database/mongo/client.ts"
import { Crud } from "../database/mongo/crud.ts"
import { parseBody } from "../utils/body.ts"
import { send } from "https://deno.land/x/oak@v12.6.0/send.ts"
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
    } = await parseBody(request)
    const createdDate = new Date().toISOString()

    const _id = await Products.create({
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


export const uploadProductImage = async (ctx: RouterContext<any>) => {
    const body = ctx.request.body()
    const length = Number(ctx.request.headers.get("content-length")) || 1
    const uploadDir = Deno.cwd() + "/uploads/product-imge"

    if (length > 5000000) {
        ctx.response.status = 400
        ctx.response.body = { error: "image length can't be higher than 5MB" }
        return
    }

    try {
        if (body.type === "form-data") {
            const value = body.value
            const formData = await value.read()

            if (formData.files &&
                formData.files.length > 0 &&
                formData.files[0].name === 'img') {
                const file = formData.files[0]

                if (!["image/png", "image/jpeg"].includes(file.contentType)) {
                    ctx.response.status = 400
                    ctx.response.body = { error: "only png & jpeg accepted!" }
                    return
                }

                if (file.filename) {
                    const fileData = await Deno.readFile(file.filename)
                    const fileName = file.filename.split('/').pop()
                    const filePath = uploadDir + "/" + fileName
                    await Deno.writeFile(filePath, fileData)

                    ctx.response.status = 201
                    ctx.response.body = { imgId: fileName }
                    return
                }
            } else {
                ctx.response.status = 400
                ctx.response.body = { error: "body should have a file type param call 'img'" }
                return
            }
        } else {
            ctx.response.status = 400
            ctx.response.body = { error: "body type should be 'form-data'!" }
            return
        }
    } catch (error) {
        console.log(`Faild to connect to upload image: ${error}`)
        ctx.response.status = 500
        ctx.response.body = {
            message: `Faild to upload image!!`,
            errorName: error.name,
            errorMessage: error.message,
        }
    }
}


export const getProductImage = async (ctx: RouterContext<any,{ imgId: string }>) => {
    try {
        await send(ctx, ctx.params.imgId, {
            root: `${Deno.cwd()}/uploads/product-imge`
        })
    } catch (error) {
        ctx.response.status = 404;
        ctx.response.body = "404 File not found";
    }
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
    } = await parseBody(request)


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