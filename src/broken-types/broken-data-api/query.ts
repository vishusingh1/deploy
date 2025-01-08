import { z } from 'zod';

// sorts => [{id: "id1", attr: created_at, order: 'DESC'}, {id: "id2", attr: updated_at, order: 'DESC'}]
export const z_sort         =   z.object({
    id      :   z.string(),
    attr    :   z.string(),
    order   :   z.union([z.literal("ASC"), z.literal("DESC")])
})


/* 

    Note: 
        if you want to filter based on relations 
        eg : get all the posts which are liked by users whose age is greater than 60
        model : posts
        filter : {attr : liked_by.age , op: gt, val: 60}

*/


export const z_filter       =   z.object({
    id      :   z.string(),
    attr    :   z.string(),
    val     :   z.any(),
    op      :   z.string()
}).passthrough()





const z_filter_arr      =   z_filter.array();

const z_base_filters = z.object({
    and     :   z_filter_arr.optional(),
    or      :   z_filter_arr.optional(),
    not     :   z_filter_arr.optional()
});


type t_base_filters     =   z.infer<typeof z_filter_arr >;


// @todo : change not to this type : not => {attr : op: val} | {and : { and : [], or: []} } | {or : filter_type} | {not: filter_type}
type filter_type = {
    and? : filter_type | t_base_filters  ,
    or?  : filter_type | t_base_filters  ,
    not? : filter_type | t_base_filters  
}




/* 
    eg for filters =>   { 
        and :  { 
            and :   [{attr: "", op: "", val}],
            or  :   {
                not : [{attr: "", op: "", val}],
                or  : [{attr: "", op: "", val}],
            } 
        },

        or  : [{attr: "", op: "" , val: ""}],

        not : []
    }


    all the high level operations (in the above example, and or not) are and-ed
*/


export const z_filters_obj : z.ZodType<filter_type> =  z_base_filters.extend(
    { and :  z.lazy(()=> z.union([z_filters_obj, z_filter_arr])).optional(),
      or  :  z.lazy(()=> z.union([z_filters_obj, z_filter_arr])).optional(),
      not :  z.lazy(()=> z.union([z_filters_obj, z_filter_arr])).optional()
    }
);
export type t_filters_obj   = z.infer<typeof z_filters_obj>



export const z_filters_v1 = z.union([z_filters_obj, z_filter_arr]);

/* 
    meta structure : {

        sorts => list of sort objects => sorts the data based on the order of the sort objects provided
        eg : [sort1, sort2] => first based on sort1 and then in conflicting cases use sort2

        filters => to filter data
        limit => to limit the no of data, its good to keep a  maximum
        offset => useful for pagewise pagination  

        limit and offset combinedly provides pagewise pagination

        columns =>  to include and exclude certain coulums from the data that is needed
        model : user 
        eg1 :  {name : true, posts: true} => this would include only  name and posts and excludes remaining
        eg2 :  {age: false} =>  this would exclude age and give remaining
        eg3 :  {name: true, age: false, posts: true} =>  all the coulums with false would be ignored right away , this would include only name and posts

        cursor =>  to do pagination dynamically

    }


*/

export const  z_query_meta = z.object({
    sorts           :   z_sort.array().optional(),
    // filters can be a json structure altogether(with:  and or and not as high level ops ) or just array of filters which are and-ed
    filters         :   z_filters_v1.optional(), //  direct array of filters => 
    limit           :   z.number().optional(),
    offset          :   z.number().optional(),
    fields          :   z.record(z.string(), z.boolean()).optional(),
    cursor: z.object({
        first: z.union([z.string(), z.number()]),   // id can be string or number
        last: z.union([z.string(), z.number()]),    // id can be string or number
    }).optional(),
})
const z_base_query_v1 = z.object({
    version   :   z.literal(1).optional(),
    model_id  :   z.string().optional(),
    meta      :   z_query_meta.optional(),
    map       :  z.record(z.string(), z.string()).optional(),
    find      :  z.object(
        {
            id: z.union([z.string(), z.number()])

        }).array().optional(),
    depth     :  z.number().optional(),
    
})
type base_query_v1 = z.infer<typeof z_base_query_v1>

type query_type_v1 = base_query_v1 & {
    props? : {
        [k : string]     :   query_type_v1
    }
    
} 
const z_query_v1:  z.ZodType<query_type_v1>    = z_base_query_v1.extend({props: z.record(z.string(),  z.lazy(()=> z_query_v1)).optional()} );







// version 2 of filters

const z_filter_atom = z.object({
    type    : z.literal("atom").optional(),
    id      : z.string(),
    attr    : z.string(),
    op      : z.string(),
    val     : z.any(),
    meta    : z.any()
}).passthrough()

type t_filter_atom = z.infer<typeof z_filter_atom>

const base_filters_v2 = z.object({
    id: z.string(),
    group_by: z.union([z.literal("and"), z.literal("or"), z.literal("not")]).optional(),
    type: z.literal("group")
})

type filters_group = {
    id: string,
    group_by?: "and" | "or" | "not",
    type: "group",
    filters: {[key: string]: filters_group | t_filter_atom}
}

export const z_filters_group : z.ZodType<filters_group> = base_filters_v2.extend({
    filters: z.record(z.string(), z.lazy(()=> z.union([z_filters_group, z_filter_atom])))
})

export const z_filters_v2 = z.union([z_filters_group, z_filter_atom, z_filter_atom.array()]);








/*
    depth is for relations => no of levels downwards in getting relations data
    user: {posts: {liked_by}}
    // depth = 2 would give liked by info of depth as well when querying for user

    map will map the result to the props provided

    {name, age } could be mapped to {full_name, age_of_user}

    find is to specifically get data given id of it along with the data with filters in meta
*/







const z_base_query_v2 = z.object({
    version         :   z.literal(2),
    model_id        :   z.string().optional(),
    sorts           :   z_sort.array().optional(),
    eids            :   z.union([z.string(), z.string().array()]).optional(),
    // filters can be a json structure altogether(with:  and or and not as high level ops ) or just array of filters which are and-ed
    filters         :   z_filters_v2.optional(), //  direct array of filters => 
    limit           :   z.number().optional(),
    offset          :   z.number().optional(),
    fields          :   z.record(z.string(), z.boolean()).optional(),
    cursor: z.object({
        first: z.union([z.string(), z.number()]),   // id can be string or number
        last: z.union([z.string(), z.number()]),    // id can be string or number
    }).optional(),

    map       :  z.record(z.string(), z.string()).optional(),
    find      :  z.object(
        {
            id: z.union([z.string(), z.number()])

        }).array().optional(),
    depth     :  z.number().optional(),
    
})

type base_query_v2 = z.infer<typeof z_base_query_v2>


/*
    In Props you can add query structure for props which has is relation true 
    It filters on the relation data ( not on the actual model )

    eg: get users whose age is greater than 60  and the posts of user which has likes more than 100 


    model: user

    query : {
        meta : {
            filters: [{attr: age, op: gt, val: 60}]
        },
        props: {
            posts : [{attr: likes, op: gt, val: 100}]
        }
    }

    all the posts of the user are filtered by the given filter for the posts property

*/



type query_type_v2 = base_query_v2 & {
    props? : {
        [k : string]     :   query_type_v2 | boolean 
    }
    
}
const z_query_v2:  z.ZodType<query_type_v2>    = z_base_query_v2.extend({
    props: z.record(
        z.string(),  
        z.union([z.lazy(()=> z_query_v2), z.boolean()])
    ).optional()
} );



export const z_query                                  =     z.union([z_query_v1, z_query_v2]);   
export type t_sort                                    =     z.infer<typeof z_sort>
export type t_filter                                  =     z.infer<typeof z_filter>  
export type t_query_meta                              =     z.infer<typeof z_query_meta>;
export type t_query                                   =     z.infer<typeof z_query>;
export type t_filters_v1                              =     z.infer<typeof z_filters_v1>;
export type t_filters_group                           =     z.infer<typeof z_filters_group>;
export type t_filters_v2                              =     z.infer<typeof z_filters_v2>;
