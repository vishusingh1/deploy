import {z} from 'zod';
import { z_query_params } from './fe-query/query';

const z_comp_data = z.object({
    mid: z.string(),
    cid: z.string(),
    idx: z.number(),        // idx doesn't make sense. It should be directly passed in the comp props
    model_name: z.string(),  // model name
    prop_name: z.string(),   // prop name of the parent component
})

const inputschema = z.tuple([
    z.string(),   // prop name of the parent component
    z.any()
])


export const z_info_obj = z.object({
    // react useState function
    SET_M: z.any(),         // it's not z.function()
    model_name: z.string(),
    prop_name: z.string(),
    op: z.string(),
    mid: z.string(),            // model id
    cid: z.string(),            // comp id
    cidx: z.number(),           // props.idx // will come from parent component e.x: PM.map((V, idx)=>{< CURRENT_COMP> {use props.idx here which comes from parent component}  </CURRENT_COMP>})

    idx: z.number().optional(), // let idx = 0; will be defined in current component. e.x: M.map((V, idx)=>{<div> {use idx here in the same component}  </div>})
    query: z_query_params.optional(),


    COMP_DATAS: z.array(z_comp_data).optional(),



    
    on_created: z.function(inputschema, z.void()).optional(),
    on_selected:z.function(inputschema, z.void()).optional(),
});
export type T_INFO = z.infer<typeof z_info_obj>;

export const z_relation_obj = z.object({
    PM_MID: z.string(),
    PM_CID: z.string(),
    PM_PN: z.string()
});
export type T_RELATION_OBJ = z.infer<typeof z_relation_obj>;