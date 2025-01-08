import {z} from "zod";

export const z_bro_action_fn  = z.object({
    name: z.string(),
    description: z.string(),
    function: z.function().optional(),
    arguments: z.record( // {[k: name]: z.any()} arguments name has to be unique
        z.string(),
        z.object({
            type: z.string(),
            value: z.any(),
            description: z.string(),
        })
    ).optional(),
    returns: z.object({
        type: z.string(), // js type
        description: z.string(), // jsdescription
    }).optional(),
    icon: z.string(),
    async: z.boolean(),
    code: z.string(),
    params:z.string().optional() //this is js expression
});
export type BRO_ACTION_FN_T = z.infer<typeof z_bro_action_fn>;
// const z_bro_fn_group_base = z.object({
//     type: z.union([z.literal("seq"), z.literal("parallel")]),
// });
// export type t_bro_fn_group_base = z.infer<typeof z_bro_fn_group_base>;
// export type BRO_FN_GROUP_T =  {
//     type: "seq" | "parallel",
//     fns:   BRO_FN_GROUP_T[]|BRO_ACTION_FN_T[]
// }
// export const z_bro_fn_group  = z.lazy(()=> z.object({
//     type: z.union([z.literal("seq"), z.literal("parallel")]),
//     fns: z_bro_action_fn.array(),
// })) ;
export const z_bro_action = z.object({
    event: z.object({
        name: z.string(),   // onClick | onInput 
        type: z.string(),   // click | websocket | timeout
    }),
    type: z.union([z.literal("seq"), z.literal("parallel")]),
    fns: z_bro_action_fn.array(),
    config: z.object({
        preventDefault: z.boolean().default(false),
        stopPropagation: z.boolean().default(false),
        preventDefaultOnClick: z.boolean().default(false),
    }).optional(),
    scope: z.object({
        type: z.string().optional(), // prop | model | ui
    }).optional(),
});
export type BRO_ACTION_T = z.infer<typeof z_bro_action>;

export interface ACTION {
    name: string,
    description: string,
    function: Function,
    arguments: {name: string, type: string, description?: string}[],
    return_type: string,
    return_description?: string,
    icon?: string,
    code?: string
}