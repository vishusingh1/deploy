import {z} from "zod"
import { z_query, z_filters_obj } from "./query";

/*
    patch type ref :  https://jsonpatch.com/

    eg: update age of user to 60

    {
        op      :   'replace',
        path    :   '/age',
        value   :   60
    }

    eg: replace 3rd item of fav_cuisuines of the user


    {
        op      :   'replace',
        path    :   '/fav_cuisuines/2',
        value   :   'bengali'
    }

    @note: to push to the end of the array use " - "

    eg: add new item to fav_cuisuines 
    {
        op      :   'add',
        path    :   '/fav_cuisuines/-'
        value   :   'south_indian'
    }


    @note :  for relations  (when it is many) use id of the relation (cannot have indexes for relations)

    eg: Update caption of the post of a user with post id = 'post6'
    
    {
        op      :   'replace',
        path    :   '/posts/post6/caption'
        value   :   'brighter sun!'
    }

    @note: not using the op 'test' for now 


*/

export const z_update_patch = z.object({
    op      :   z.union([z.literal("replace"), z.literal("add"), z.literal("remove"), z.literal("test")]),
    path    :   z.string(),
    value   :   z.any()
})


/*
    adding app id , token, apikey, model_id parameters to the req body as optional just in case those params cannot be sent through url

    pref : url > reqbody for those params
    pref : token > apikey

    to update entites which after querying, send the query instead of id

*/

// id
const z_update_with_id = z.object({
    id      :   z.union([z.string(), z.number()]),//here id is entity id
    with    :   z.literal("id"),
    patches :   z_update_patch.array(),
})

// ids
const z_update_with_ids  = z.object({
    ids     :   z.union([z.string(), z.number()]).array(),
    with    :   z.literal("ids"),
    patches :   z_update_patch.array(),
})

// query
const z_update_with_query = z.object({
    query   :   z_filters_obj,
    with    :   z.literal("query"),
    patches :   z_update_patch.array(),
})

export const  z_update_one = z.object({

    app_id      :   z.string().optional(), 
    token       :   z.string().optional(),
    apikey      :   z.string().optional(),

    entity      :   z.object({
        model_id    :   z.string().optional(), 
        data        :   z.union([z_update_with_id, z_update_with_ids, z_update_with_query])
    })

})



// multiple models can be updated at once
export const z_update_many  =   z.object({

    app_id      :   z.string().optional(), 
    token       :   z.string().optional(),
    apikey      :   z.string().optional(),

    entities    :   z.object({
        model_id    :   z.string(),
        data        :   z.union([z_update_with_id, z_update_with_ids, z_update_with_query])
    }).array()

})

const z_record = z.record(z.string().min(1), z.any());


export const z_create_one       =   z.object({
    entity : z.object({
        data        :   z_record,
        model_id    :   z.string().optional()
    }),

    app_id  :   z.string().optional(),
    token   :   z.string().optional(),
    apikey  :   z.string().optional()
})


//create multiple data for a single model
const z_create_many_single_model = z.object({
    entity : z.object({
        data        :   z_record.array(),
        model_id    :   z.string().optional()
    }),

    model_cardinality : z.literal("single").optional(),
    app_id  :   z.string().optional(),
    token   :   z.string().optional(),
    apikey  :   z.string().optional()
})

// can be used when multiple entities need to be created for  different model ids
const z_create_many_multiple_model = z.object({
    entities : z.object({
        data        :   z_record.array(),
        model_id    :   z.string()
    }).array(),
    model_cardinality : z.literal("multiple"),
    app_id: z.string().optional(),
    token: z.string().optional(),
    apikey: z.string().optional()
})

export const z_create_many      =   z.union([z_create_many_single_model, z_create_many_multiple_model]);



const z_delete_with_id = z.object({
    id      :   z.union([z.string(), z.number()]),
    with    :   z.literal("id")
})

const z_delete_with_ids = z.object({
    ids     :   z.union([z.string(), z.number()]).array(),
    with    :   z.literal("ids")
})

const z_delete_with_query = z.object({
    query   :   z_filters_obj,
    with    :   z.literal("query")
})

// delete with single model
export const z_delete_one = z.object({

    app_id      :   z.string().optional(), 
    token       :   z.string().optional(),
    apikey      :   z.string().optional(),
    entity      :   z.object({
        model_id    :   z.string().optional(),
        data        :   z.union([z_delete_with_id, z_delete_with_ids, z_delete_with_query])
    })
})


//delete for multiple models
export const z_delete_many  = z.object({
    app_id      :   z.string().optional(), 
    token       :   z.string().optional(),
    apikey      :   z.string().optional(),
    entities    :   z.object({
        model_id    :   z.string().optional(),
        data        :   z.union([z_delete_with_id, z_delete_with_ids, z_delete_with_query])
    }).array()
})


export const z_get_many = z.object({
    app_id      :   z.string().optional(), 
    token       :   z.string().optional(),
    apikey      :   z.string().optional(),
    query       :   z_query,
})


export type t_update_patch      =   z.infer<typeof z_update_patch>
export type t_update_one        =   z.infer<typeof z_update_one>
export type t_update_many       =   z.infer<typeof z_update_many>

export type t_create_one        =   z.infer<typeof z_create_one>
export type t_create_many       =   z.infer<typeof z_create_many>

export type t_delete_one        =   z.infer<typeof z_delete_one>
export type t_delete_many       =   z.infer<typeof z_delete_many>

export type t_get_many          =   z.infer<typeof z_get_many>




