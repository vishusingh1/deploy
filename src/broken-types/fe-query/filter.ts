import { z } from 'zod';


export const z_filter_atom = z.object({
    type    : z.literal("atom").optional(),
    id      : z.string(),
    attr    : z.string(),
    op      : z.string(),
    val     : z.any(),
    is_static: z.boolean().optional(),
    meta    : z.any()
})


const base_filters = z.object({
    id          :   z.string(),
    group_by    :   z.union([z.literal("and"), z.literal("or"), z.literal("not")]).optional(),
    type        :   z.literal("group"),
    is_static   :   z.boolean().optional(),
})




type filters = {
    id          : string,
    group_by?   : "and" | "or" | "not",
    type        : "group",
    is_static?  : boolean,  
    filters     : {[key: string]:  T_FILTER_ATOM | filters}
}

export const z_filters : z.ZodType<filters> = base_filters.extend({
    filters: z.record(z.string(), z.lazy(()=> z.union([z_filters, z_filter_atom])))
})


export type T_FILTER_ATOM = z.infer<typeof z_filter_atom>

export type T_FILTERS                              =     z.infer<typeof z_filters>;

