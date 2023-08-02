#!/usr/bin/env -S deno run --allow-read --allow-net --watch
import "./compile-resolve.ts"
import router from "./routes.ts";
import { Application } from "oak"
import { oakCors } from "cors"
import { config } from "dotenv"
import { green, yellow } from "$std/fmt/colors.ts"
import { Init } from "./system/index.ts";


const app = new Application();
const PORT = Number(Deno.env.get("PORT")) || Number(config().PORT) || 80;
const needSystemSetup = Deno.env.get("NEED_SYSTEM_SETUP") === "true" ||
    config().NEED_SYSTEM_SETUP === "true" || false;


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