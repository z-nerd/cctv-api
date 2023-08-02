export const genKey = async (
    algorithm: AesKeyGenParams | HmacKeyGenParams,
    extractable: boolean,
    keyUsages: KeyUsage[],
) => {
    const key = await crypto.subtle.generateKey(algorithm, extractable, keyUsages)
    const exKey = await crypto.subtle.exportKey("raw", key)

    return new Uint8Array(exKey).toString()
}
// console.log(await genKey({ name: "HMAC", hash: "SHA-512" }, true, ["sign", "verify"]))


export const accessSecret = await crypto.subtle.importKey(
    "raw",
    new Uint8Array([
        143, 14, 95, 36, 135, 35, 223, 102, 69, 53, 253, 163, 118, 148, 62, 97, 255, 174, 68, 232, 39, 81, 254, 213, 209, 118, 184, 139, 93, 94, 83, 115, 204, 101, 64, 107, 221, 156, 183, 147, 71, 117, 235, 66, 56, 104, 171, 168, 71, 144, 91, 203, 160, 87, 178, 187, 250, 239, 164, 212, 41, 5, 157, 36, 161, 154, 61, 153, 103, 109, 91, 184, 80, 160, 90, 214, 243, 145, 184, 31, 56, 244, 127, 95, 67, 159, 197, 68, 255, 48, 237, 165, 247, 213, 122, 129, 40, 214, 235, 21, 114, 22, 70, 255, 135, 32, 131, 180, 198, 173, 200, 20, 17, 55, 3, 254, 137, 75, 197, 226, 193, 103, 43, 72, 132, 220, 33, 119
    ]).buffer,
    { name: "HMAC", hash: "SHA-512" },
    true,
    ["sign", "verify"]
)


export const refreshSecret = await crypto.subtle.importKey(
    "raw",
    new Uint8Array([
        198, 144, 251, 118, 26, 70, 166, 219, 111, 208, 251, 86, 49, 230, 11, 159, 163, 86, 67, 175, 67, 182, 50, 27, 37, 219, 60, 68, 39, 50, 112, 108, 29, 224, 228, 81, 165, 146, 81, 233, 172, 169, 124, 51, 98, 39, 115, 249, 16, 198, 180, 117, 25, 218, 82, 160, 123, 148, 231, 224, 196, 79, 168, 48, 47, 84, 176, 66, 223, 226, 252, 8, 250, 191, 58, 252, 182, 31, 160, 135, 20, 98, 48, 217, 40, 175, 207, 121, 34, 69, 148, 133, 174, 255, 74, 89, 152, 50, 221, 113, 220, 139, 73, 154, 66, 72, 93, 200, 6, 105, 223, 48, 110, 29, 77, 60, 252, 123, 33, 52, 203, 218, 246, 150, 81, 88, 60, 227
    ]).buffer,
    { name: "HMAC", hash: "SHA-512" },
    true,
    ["sign", "verify"]
)