import { ObjectId } from "mongo";


export interface IUser{
    _id: ObjectId;
    fullname: string;
    email: string;
    birthday: string;
    username: string;
    password: string;
    role: string;
}