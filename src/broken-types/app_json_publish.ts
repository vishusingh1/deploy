import {z} from 'zod'

export const z_app_json_publish = z.object({
    published:z.object({
        at:z.number(),
        hash:z.string()
    })
})


export type T_APP_JSON_PUBLISH = z.infer<typeof z_app_json_publish>