import { literal, z } from "zod"

const z_email_login_1 = z.object({
    email     : z.string().email(),
    app_id    : z.string(),
    ui_id     : z.string().optional(),
    step      : z.literal(1)
}).strict()

const z_email_login_2 = z_email_login_1.extend({
    client_id : z.string(),
    step      : z.literal(2)
}).strict()

export const z_email_login = z.union([z_email_login_1,z_email_login_2]);



const z_mobile_otp_login_1 =z.object({
    mobile   : z.string(),
    app_id   : z.string(),
    ui_id    : z.string().optional(),
    step     : z.literal(1)
}).strict()

const z_mobile_otp_login_2 = z_mobile_otp_login_1.extend({
    step       : z.literal(2),
    otp        : z.number().optional(),
    client_id  : z.string().optional()
}).strict()

export const z_mobile_otp_login = z.union([z_mobile_otp_login_1, z_mobile_otp_login_2]);


export const z_google_login = z.object({
    app_id       : z.string(),
    ui_id        : z.string(),
    access_token : z.string()
})

export const z_microsoft_login = z.object({
    app_id       : z.string(),
    ui_id        : z.string(),
    access_token : z.string()
})

export const z_linkedin_login = z.object({
    app_id       : z.string(),
    ui_id        : z.string(),
    code         : z.string(),
    redirect_uri : z.string()
})


export const z_github_login = z.object({
    app_id          : z.string(),
    ui_id           : z.string(),
    code            : z.string(),
    redirect_uri    : z.string()
})


const z_new_association_1 = z.object({

    app_id  :   z.string(),
    ui_id   :   z.string(),
    token   :   z.string(),
    method  :   z.string(),
    val     :   z.any(),
    step    :   z.literal(1)

})


const z_new_association_2 = z_new_association_1.extend({

    step            :   z.literal(2),
    client_id       :   z.string().optional(),
    access_token    :   z.string().optional(),
    otp             :   z.number().optional()
}).passthrough();


export const z_user_association_req = z.union([z_new_association_1, z_new_association_2]) 


// export const z_new_association_req_token    =   z.object({token: z.string(), new_association:  z_association, app_id: z.string(), client_id: z.string().optional() }).passthrough();
// export const z_new_association_user_id      =   z.object({user_id: z.string(), new_association:  z_association, app_id: z.string()});
// export const z_new_association_prev         =   z.object({prev_association: z_association, new_association:  z_association, app_id: z.string()})