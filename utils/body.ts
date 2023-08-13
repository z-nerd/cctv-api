import { Request } from "oak"


export const parseBody = async <T> (request: Request) => {
    const body = request.body()
    if(body.type === 'text') return JSON.parse(await body.value)
    
    return (await body.value) as T
}