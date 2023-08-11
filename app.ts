#!/usr/bin/env -S deno run --allow-read --allow-net --watch
import router from "./routes.ts";
import { Application } from "oak"
import { oakCors } from "cors"
import { green, yellow } from "$std/fmt/colors.ts"
import { Init } from "./system/index.ts";
import { envVariable } from "./utils/env.ts";


const PORT = envVariable<number>("PORT", 'number')
const needSystemSetup = envVariable<boolean>("NEED_SYSTEM_SETUP", 'boolean')


const app = new Application()
// app.use(oakCors(
//     {
//         origin: /^.+localhost:(3000|4200|8080)$/
//     }
// ))


app.use(router.routes());
app.use(router.allowedMethods());


app.addEventListener("listen", ({ secure, hostname, port }) => {
    const protocol = secure ? "https://" : "http://"
    const url = `${protocol}${hostname ?? "localhost"}:${port}`
    
    if(needSystemSetup) {
        Init()
    }

    console.log(`${yellow("Listening on:")} ${green(url)}`)
})


await app.listen({ port: PORT });