import { z } from "zod"
import { z_user } from "./user-internals"



const z_user_email_to_create = z.object({
    role : z.string(),
    email: z.string(),
}).passthrough()

const z_user_mobile_to_create = z.object({
    role : z.string(),
    mobile: z.string(),
}).passthrough()




export const z_users_create = z.object({
    users: z.array(z.union([z_user_email_to_create, z_user_mobile_to_create])) ,
    app_id: z.string().optional(),
    token :  z.string().optional()
})

export const z_users_update = z.object({
    ids: z.array(z.string()),
    method: z.literal("ids"),
    update : z.record(z.any()),
    app_id: z.string().optional(),
    token :  z.string().optional()
})

export const z_users_delete = z.object({
    ids: z.array(z.string()),
    method: z.literal("ids"),
    app_id: z.string().optional(),
    token :  z.string().optional()
})



export const z_users_get_with_id = z.object({
    app_id  :   z.string().optional(),
    token   :   z.string().optional(),
    method  :   z.literal("id"),
    ids     :   z.array(z.string())
})

export const z_users_get_with_email = z.object({
    app_id  :   z.string().optional(),
    token   :   z.string().optional(),
    method  :   z.literal("email"),
    emails  :   z.array(z.string())
})

export const z_users_get_with_mobile = z.object({
    app_id  :   z.string().optional(),
    token   :   z.string().optional(),
    method  :   z.literal("mobile"),
    mobiles :   z.array(z.string())
})




export const z_users_get = z.union([z_users_get_with_email, z_users_get_with_mobile, z_users_get_with_id])


const z_user_update = z.object({
    user: z_user,
    app_id: z.string().optional(),
    token :  z.string().optional()
})