import { decode, encode } from "$std/encoding/base64.ts"
import { envVariable } from "./env.ts"


export const genKey = async (
    algorithm: AesKeyGenParams | HmacKeyGenParams,
    extractable: boolean,
    keyUsages: KeyUsage[],
) => {
    const key = await crypto.subtle.generateKey(algorithm, extractable, keyUsages)
    const exKey = await crypto.subtle.exportKey("raw", key)

    return encode(new Uint8Array(exKey))
}

// console.log(await genKey({ name: "HMAC", hash: "SHA-512" }, true, ["sign", "verify"]));
const a64 = envVariable<string>('ACCESS_TOKEN_SECRET')
const r64 = envVariable<string>('REFRESH_TOKEN_SECRET')


export const accessSecret = await crypto.subtle.importKey(
    "raw",
    decode(a64).buffer,
    { name: "HMAC", hash: "SHA-512" },
    true,
    ["sign", "verify"]
)


export const refreshSecret = await crypto.subtle.importKey(
    "raw",
    decode(r64).buffer,
    { name: "HMAC", hash: "SHA-512" },
    true,
    ["sign", "verify"]
)