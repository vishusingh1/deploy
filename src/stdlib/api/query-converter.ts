//This file converts broken front end query to database api query

import { t_filter, t_filters_v1, t_query, t_query_meta, t_sort } from "../../broken-types/broken-data-api/query";
import { T_QUERY_PARAMS, T_QUERY_PARAMS_ID, T_QUERY_PARAMS_LEVEL_2 } from "../../broken-types/fe-query/query";

//@deprecated

// const search_to_bro_filters = (searchs: {id: string, text: string, case_sensitive: boolean, modifiers: string}[]): t_filter[] => {
    
//     const filters: t_filter[] = [];
    
//     for(let search of searchs){
//         filters.push({
//             attr: search.id,
//             op: search.modifiers.toLocaleLowerCase(),
//             val: search.text,
//         });
//     }

//     return filters;
// }


// const level_2_to_db_query =  (query: T_QUERY_PARAMS_LEVEL_2): t_query => {

//     const db_query: t_query     =   {};
//     const meta: t_query_meta    =   {};

//     if(query.filters){
//         const filters : t_filters_v1  =   query.filters;

//         if(Array.isArray(filters)){
//             if(query.search){
//                 const seach_filters = search_to_bro_filters(query.search);
//                 filters.push(...seach_filters);
//             }
//         }
//         else if(typeof filters === "object"){
//           // In this case, add it to and  part of the filters
            
//         }
//         meta.filters               =   query.filters;
//     }
//     if(query.sorts){
//         const sorts: t_sort[] = [];
//         for(let key of Object.keys(query.sorts)){
//             sorts.push({attr: key, order: query.sorts[key]});
//         }
//         meta.sorts = sorts;
//         //@todo: add id(or any other unique property) to sorts to sort uniquely in case of conflict with other sorts
//     }
//     const limit = query.limit;
//     if(limit){
//         meta.limit = (limit);
//     }
//     db_query.meta = meta;

    
//    return db_query
// }


// const id_to_db_query = (query: T_QUERY_PARAMS_ID): t_query => {

//     const db_query: t_query     =   {};
//     const meta: t_query_meta    =   {};

//     const id        =   query.id;
//     const filter    =   {attr: "id", op: "eq", val: id};
//     meta.filters    =   [filter];
//     meta.limit      =   1;
    
//     db_query.meta   =   meta;
    


//     return db_query;
// }


// const code_to_db_query = (query: T_QUERY_PARAMS): t_query => {


//     //@note : this is not implemented yet in the db or in the broken-data-api
    
//     const db_query: t_query     =   {};
//     const meta: t_query_meta    =   {};
//     if(query.type === "QP_CODE"){
//         const code = query.code;

//     }
//     return db_query;
// }


// export const query_converter = {
//     id      : id_to_db_query,
//     code    : code_to_db_query,
// }