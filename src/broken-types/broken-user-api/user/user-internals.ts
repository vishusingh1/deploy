import { z } from "zod";


const z_user_props_v1_base = z.object({
    id: z.string(),
    name: z.string(),
    image_url: z.string().optional(),
    role: z.string(),
    universe: z.number().optional(),
    level: z.number(),
    app_id: z.string().optional(),
    scope: z.record(z.string()).optional(),
    created_at: z.number(),
    org: z.string().optional(),
    team: z.string().optional(),
    verified_at: z.number(),
    modified_at: z.number().optional(),
    version: z.literal(1).optional()
})

// const z_user_props = z.object({
//     version: z.literal(2),
//     id: z.string(),
//     name: z.string().optional(),
//     image_url: z.string().optional(),
//     role: z.string(),
//     universe: z.number().optional(),
//     level: z.number(), // level 0 for broken team, 1 for dev users and 2 for app users
//     app_id: z.string(), // for dev users => app_id will be BROKEN
//     scope: z.record(z.string()).optional(),
//     created_at: z.number(),
//     org: z.string().optional(),
//     team: z.string().optional(),
//     verified_at: z.number(),
//     modified_at: z.number().optional(),
//     version : z.literal(1).optional()
// })

export const z_user_props_v1_mobile = z_user_props_v1_base.extend({
    mobile: z.string(),
    email: z.string().email().optional()
})


const z_user_props_v1_mobile_ddb = z_user_props_v1_base.extend({
    pk: z.string(),
    sk: z.string()
})


export const z_user_props_v1_email = z_user_props_v1_base.extend({
    email: z.string().email(),
    mobile: z.string().optional()
})


const z_user_props_v1_email_ddb = z_user_props_v1_base.extend({
    pk: z.string(),
    sk: z.string()
})



const z_user_props_v2_base = z.object({
    version: z.literal(2),
    id: z.string(),
    name: z.string().optional(),
    image_url: z.string().optional(),
    role: z.string(),
    universe: z.number().optional(),
    level: z.number(), // level 0 for broken team, 1 for dev users and 2 for app users
    app_id: z.string(), // for dev users => app_id will be BROKEN
    scope: z.record(z.string()).optional(),
    created_at: z.number(),
    org: z.string().optional(),
    team: z.string().optional(),
    verified_at: z.number(),
    modified_at: z.number().optional()
})


export const z_user_props_v2_mobile = z_user_props_v2_base.extend({
    mobile: z.string(),
    created_with: z.literal("mobile"),
}).passthrough()

const z_user_props_v2_mobile_ddb = z_user_props_v2_base.extend({
    pk: z.string(),
    sk: z.string()
})

export const z_user_props_v2_email = z_user_props_v2_base.extend({
    email: z.string().email(),
    created_with: z.literal("email"),
}).passthrough()

const z_user_props_v2_email_ddb = z_user_props_v2_base.extend({
    pk: z.string(),
    sk: z.string()
})


const z_user_props = z.union([z_user_props_v1_base, z_user_props_v2_base]);



// const z_user_props = z.union([z_user_props_v1, z_user_props_v2]);

export const z_user_with_mobile = z.union([z_user_props_v1_mobile, z_user_props_v2_mobile]);
export const z_user_with_email = z.union([z_user_props_v1_email, z_user_props_v2_email]);



export const z_ddb_user_with_mobile = z.union([z_user_props_v1_mobile_ddb, z_user_props_v2_mobile_ddb]);
export const z_ddb_user_with_email = z.union([z_user_props_v1_email_ddb, z_user_props_v2_email_ddb]);



export const z_user = z.union([z_user_with_email, z_user_with_mobile]);
export const z_ddb_user = z.union([z_ddb_user_with_email, z_ddb_user_with_mobile]);


export const z_login_response = z.object({
    response: z.string(),
    token: z.string(),
    user: z_user
});




export const z_accounts_type_v1 = z.union([
    z.literal('free'),
    z.literal('standard'),
    z.literal('professional')
]);


export const z_accounts_type_v2 = z.object({
    version: z.literal(2),
    type: z.union([
        z.literal('FREE'),
        z.literal('STANDARD'),
        z.literal('PROFESSIONAL'),
        z.literal('ENTERPRISE')
    ])

})

export const z_subscribe_reccurence = z.union([
    z.literal('MONTHLY'),
    z.literal('YEARLY')
]);




export type user_props_type = z.infer<typeof z_user_props>;
export type user_type = z.infer<typeof z_user>;
export type user_with_mobile_type = z.infer<typeof z_user_with_mobile>;
export type user_with_email_type = z.infer<typeof z_user_with_email>;
export type login_response_type = z.infer<typeof z_login_response>;
export type acc_type = z.infer<typeof z_accounts_type_v1>;
export type subscribe_reccurence_type = z.infer<typeof z_subscribe_reccurence>;
export type ddb_user_type = z.infer<typeof z_ddb_user>


