import { config } from "dotenv"




export const envVariable = <T> (
    name: string,
    type: 'string' | 'number' | 'boolean' = 'string',
    throwError = true
) => {
    const env = config()[name] || Deno.env.get(name)
    if (!env && throwError) throw new Error(`Invalid/Missing environment variable: ${name}`)

    switch (type) {
        case 'number': return Number(env) as T
        case 'boolean': return (String(env).toLowerCase() === "true" ? true : false) as T
        default: return env as T
    }
}
