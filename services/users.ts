import { RouterContext } from "oak"
import { compare, genSalt, hash } from "bcrypt"
import { create, getNumericDate, verify } from "djwt"
import { IUser } from "../types/user.ts"
import { accessSecret, refreshSecret } from "../utils/apiKey.ts"
import { Crud } from "../database/mongo/crud.ts"
import mongoClient from "../database/mongo/client.ts"
import { ObjectId } from "mongo"


const db = "cctv"
const col = "users"
const Users = new Crud<IUser>(mongoClient, db, col)


export const signin = async ({ request, response }: RouterContext<any>) => {
  const body = await request.body()
  const { username, password } = await body.value

  const user = await Users.find({ username })

  if (!user) {
    response.status = 404
    response.body = { message: `user "${username}" not found` }
    return
  }

  const confirmPassword = await compare(password, user.password)
  if (!confirmPassword) {
    response.status = 404
    response.body = { message: `user "${username}" not found` }
    return
  }

  //authenticate a user
  const payload = {
    username: username,
    exp: getNumericDate(60 * 60 * 24 * 30),
  }
  const jwt = await create(
    { alg: "HS512", typ: "JWT" },
    { payload },
    refreshSecret,
  )

  if (jwt) {
    response.status = 200
    response.body = {
      userId: user._id,
      username: user.username,
      token: jwt,
    }
  } else {
    response.status = 500
    response.body = {
      message: "internal server error",
    }
  }
  return
}


export const signup = async ({ request, response }: RouterContext<any>) => {
  const { fullname, birthday, email, username, password } = await request.body().value
  const salt = await genSalt(8)
  const hashedPassword = await hash(password, salt)
  const role = "user"

  const _id = await Users.create({
    _id: new ObjectId,
    fullname,
    birthday,
    email,
    username,
    password: hashedPassword,
    role,
})
  response.status = 201
  response.body = { message: "User created", userId: _id, username, role }
}


export const refresh = async (
  { request, response, cookies }: RouterContext<any>,
) => {
  const headers: Headers = request.headers
  const authorization = headers.get('Authorization')

  if (!authorization) {
    response.status = 401
    return
  }

  const token = authorization.split(' ')[1]
  if (!token) {
    response.status = 401
    return
  }

  const tokenPayload = await verify(token, refreshSecret)
        
  if((tokenPayload as any).payload.exp < getNumericDate(new Date())) {
      // throw new Error("Token Expired!")
      
      response.status = 401
      response.body = { message: "You are not authorized to access this route" }
      return
  }

  if (!tokenPayload) {
    // throw new Error("!payload")

    response.status = 401
    response.body = { message: "You are not authorized to access this route" }
    return
  }

  const user = await Users.find({ username: (tokenPayload as any).payload.username })

  if (!user) {
    response.status = 401
    response.body = { message: "You are not authorized to access this route" }
    return
  }

  const payload = {
    id: user._id,
    fullname: user.fullname,
    username: user.username,
    role: user.role,
    exp: getNumericDate(60 * 60 * 15),
  }
  const jwt = await create(
    { alg: "HS512", typ: "JWT" },
    { payload },
    accessSecret,
  )

  if (jwt) {
    response.status = 200
    response.body = {
      id: user._id,
      fullname: user.fullname,
      birthday: user.birthday,
      username: user.username,
      email: user.email,
      role: user.role,
      token: jwt,
    }
    cookies.set("token", jwt, {
      domain: "localhost",
      overwrite: true,
      // expires: new Date(new Date().getTime() + 5000)
    })
  } else {
    response.status = 500
    response.body = {
      message: "internal server error",
    }
  }
  return
}