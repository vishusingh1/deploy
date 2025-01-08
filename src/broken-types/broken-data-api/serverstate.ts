import z from "zod";


const z_app_meta_req = z.object({
    level : z.literal("app"),
    state: z.record(z.any()).optional()
})

const z_ui_meta_req = z.object({
    level : z.literal("ui"),
    ui_id : z.string(),
    state: z.record(z.any()).optional()
})

const z_model_meta_req = z.object({
    level : z.literal("model"),
    model_id : z.string(),
    state: z.record(z.any()).optional()
})

const z_group_meta_req = z.object({
    level : z.literal("group"),
    group_id : z.string(),
    model_id : z.string(),
    state: z.record(z.any()).optional()
})

const z_entity_meta_req = z.object({
    level : z.literal("entity"),
    entity_id : z.string(),
    model_id : z.string(),
    state: z.record(z.any()).optional()
})

export const z_server_state_set = z.union([z_app_meta_req, z_ui_meta_req, z_model_meta_req, z_group_meta_req, z_entity_meta_req]);


export const z_server_state_delete  = z.union([z_app_meta_req, z_ui_meta_req, z_model_meta_req, z_group_meta_req, z_entity_meta_req]);


export const z_server_state_get = z.union([z_app_meta_req, z_ui_meta_req, z_model_meta_req, z_group_meta_req, z_entity_meta_req]);




export type  t_sstate_set       =   z.infer<typeof z_server_state_set>
export type  t_sstate_delete    =   z.infer<typeof z_server_state_delete>
export type  t_sstate_get       =   z.infer<typeof z_server_state_get>




