import { z } from 'zod';
import {  z_filters,  } from './filter';


// [{created_at: "ASC"}, {age: "DESC"}]
export const z_query_params_sort = z.object({
    attr    :   z.string(),
    order   :   z.union([z.literal("ASC"), z.literal("DESC")]),
    id      :   z.string(),
});

export const z_query_params_sorts = z.array(z_query_params_sort);


export const z_query_params_search = z.array(z.object({
    id: z.string(),
    text: z.string(),
    case_sensitive: z.boolean().default(false),
    modifiers: z.union([
        z.literal("LIKE"), 
        z.literal("EQUALS"),
        z.literal("DOES_NOT_EQUAL"),
        z.literal("STARTS_WITH"),
        z.literal("DOES_NOT_START_WITH"),
        z.literal("ENDS_WITH"),
        z.literal("DOES_NOT_END_WITH"),
        z.literal("CONTAINS"),
        z.literal("DOES_NOT_CONTAIN"),
    ]).default("LIKE"),
}));




export const z_query_params_level_2 = z.object({
    qid: z.string(), // when we don't have direct id but we have conditions we need to use a query id. To subscribe
    type: z.literal("QP_LEVEL2"),
    filters: z_filters.optional(),
    search: z_query_params_search.optional(),
    sorts: z_query_params_sorts.optional(),
    limit: z.number().default(16).optional(),
    cursor: z.object({
        first: z.union([z.string(), z.number()]),   // id can be string or number
        last: z.union([z.string(), z.number()]),    // id can be string or number
    }).optional(),
    offset: z.number().optional(),
});

export type T_QUERY_PARAMS_LEVEL_2 = z.infer<typeof z_query_params_level_2>;




export const z_query_params_id = z.object({
    qid: z.string(), // when we have id qid is same as id. We can use both to subscribe
    type: z.literal("QP_ID"),
    id: z.union([z.string(), z.number()]),  // id can be string or number
    limit: z.literal(1).optional(),
});
export type T_QUERY_PARAMS_ID = z.infer<typeof z_query_params_id>;


// query params can be code 
export const z_query_params_code = z.object({
    qid: z.string(), // when we don't have direct id but we have conditions we need to use a query id. To subscribe
    type: z.literal("QP_CODE"),
    provider: z.union([
        z.literal("DATASCRIPT"), 
        z.literal("DRIZZLE"), 
        z.literal("SUPABASE"), 
        z.literal("GRAPHQL"), 
        z.literal("POSTGRES"), 
        z.literal("SQL"),
    ]), // provider is the backend that will be used to execute the code
    op: z.union([
        z.literal("CREATE"), 
        z.literal("READ"), 
        z.literal("UPDATE"), 
        z.literal("DELETE"),
        z.literal("UPSERT"),
    ]),
    code: z.string(), 
    data: z.any(), // when query is insert or update this will be the data that will be inserted or updated


    // pagination
    next: z.string().optional(), // code for getting next values given the last id
    prev: z.string().optional(), // code for getting prev values given the first id


    // parameters that can be used in code if available
    filters: z_filters.optional(),
    search: z_query_params_search.optional(),
    sorts: z_query_params_sorts.optional(),
    limit: z.number().default(16),
    cursor: z.object({
        first: z.union([z.string(), z.number()]),   // id can be string or number
        last: z.union([z.string(), z.number()]),    // id can be string or number
    }).optional(),
    offset: z.number().optional(),


});
/* 
    e.g => {
        type: "QP_CODE", 
        op: "READ", 
        code: `
            const r = await db
                .select()
                .from(countries)
                .leftJoin(cities, eq(cities.countryId, countries.id))
                .where(eq(countries.id, 10));
            if(!r || !r.length) return {success: false, errors: ["No data found"]};
            return {success: true, data: r};
        `,
         data: {name: "John"}
    }
*/

export const z_query_params = z.union([
    z_query_params_level_2,
    z_query_params_id,
    z_query_params_code,
]);
export type T_QUERY_PARAMS = z.infer<typeof z_query_params>;

// query params can be any of the above but they have to be converted into query_params_final before we send to server






// this is final query params that is sent by the frontend
// now the backend should be able to use this to generate the final query
export const z_query_params_final = z.union([
    z_query_params_level_2,
    z_query_params_id,
    z_query_params_code,
]);
// query params level 1 has to be converted to query params level 2 before we send to server

export type T_QUERY_PARAMS_FINAL = z.infer<typeof z_query_params_final>;

export type T_SORT = z.infer<typeof z_query_params_sort>;
export type T_SORTS = z.infer<typeof z_query_params_sorts>;



