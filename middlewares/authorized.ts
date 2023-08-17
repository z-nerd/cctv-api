import { verify } from "djwt"
import { Context } from "oak"
import { getNumericDate } from "djwt"
import { accessSecret } from "../utils/apiKey.ts"


export enum Permission {
    Upload = "upload",
    Create = "create",
    Read = "read",
    ReadFile = "read-file",
    Update = "update",
    Delete = "delete",
}


const Roles = {
    admin: [
        Permission.Upload, 
        Permission.Create, 
        Permission.Read, 
        Permission.ReadFile, 
        Permission.Update, 
        Permission.Delete],
    user: [Permission.Read, Permission.ReadFile],
    anonymous: [Permission.Read, Permission.ReadFile]
}


const checkPermission = (role: string, permission: Permission) => {
    const userPermission = (Roles as any)[role]
    // const hasPerm = userPermission && permission.every( perm => userPermission.includes(perm))
    return userPermission && userPermission.includes(permission)
}


const extractToken = async (ctx: Context) => {
    const jwt = await ctx.cookies.get('token')
    let error = null

    if(jwt) {
        const payload = await verify(jwt, accessSecret)

        if(payload) {
            if ((payload as any).payload.exp > getNumericDate(new Date())) {
                return payload?.payload as any
            } else {
                error = "Token Expired!"
            }
        } else {
            error = "payload!"
        }
    } else {
        error = "Token Needed!"
    }

    
    return new Error(error)
}


export const isAuthourized = (permission: Permission) => async (
    ctx: Context, next: () => Promise<void>
) => {
    try {
        const tokenData = await extractToken(ctx)

        if(!(tokenData instanceof Error)) {
            ctx.state.payload = tokenData

            if (checkPermission(tokenData?.role, permission)) {
                await next()
            } else {
                throw new Error("NotAllow")
            }

            delete ctx.state.payload
        } else {
            if (checkPermission("anonymous", permission)) {
                ctx.state.payload = {
                    role: 'anonymous',
                }
                await next()

                delete ctx.state.payload
            } else {
                throw tokenData
            }
        }
    } catch (error) {
        ctx.response.status = 401
        ctx.response.body = { message: "You are not authorized to access this route" }
        return
    }
}