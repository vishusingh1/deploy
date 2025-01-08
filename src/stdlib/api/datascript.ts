import { t_aggregate } from "../../broken-types/broken-data-api/aggregate";
import { t_create_many, t_create_one, t_delete_one, t_get_many, t_update_one } from "../../broken-types/broken-data-api/crud";
import { t_filter, t_filters_obj, t_query, t_sort } from "../../broken-types/broken-data-api/query";
import { DEFAULT_RES_ARR_P, DEFAULT_RES_SINGLE_P, OBJECT_TYPE } from "../../broken-types/default_res";
import { fetch_get, fetch_post } from "../Fetch";


export const DATASCRIPT_WORKER_URL = 'https://datascript-v2.brokenatom.workers.dev/api/v1';

const gen_ds_url = (params:{app_id: string, branch?: string,  model_id?: string, token: string, op: string}) => {
   
    const query_params : any = {
        app_id: params.app_id,
        token :  params.token,
        model_id : params.model_id,
    }

    if(params.branch) query_params.branch = params.branch;  
    // join all the query string params
    let query_string_params:string[] = [];
    for(const key in query_params) {
        if(query_params[key] !== undefined) {
            query_string_params.push(`${key}=${query_params[key]}`);
        }
    }
    return `${DATASCRIPT_WORKER_URL}/${params.op}?${query_string_params.join('&')}`;
}

const query = async (params: {app_id: string,  model_id?: string, branch?:string, token: string, query: string}): DEFAULT_RES_SINGLE_P<any> => {
    const {app_id, model_id,  token, branch, query} = params;

    const url = gen_ds_url({app_id,  model_id, branch, token, op: 'query'});    
    const post_object = {
        query
    }

    const r = await fetch_post(url, post_object);
    return r;
}

const transact = async (params: {app_id: string,  branch?:string, model_id?: string, token: string,  tx_list: any[][]}): DEFAULT_RES_SINGLE_P<any> => {
    
    
    const {app_id, model_id, branch,  token, tx_list} = params;
    
    const url = gen_ds_url({app_id,   model_id,branch, token, op: 'transact'});    
    const post_object = {
        tx_list
    }
    const r = await fetch_post(url, post_object);
    return r;
}

const pull = async (params: {app_id: string, branch?:string,  model_id?: string, token: string, query: string, _id: any}): DEFAULT_RES_SINGLE_P<any> => {
    
    const {app_id, model_id, branch,  token, query, _id} = params;
    const url = gen_ds_url({app_id, branch,  model_id, token, op: 'pull'}); 

    const post_object = {
        query,
        _id: _id
    }

    const r = await fetch_post(url, post_object);
    return r;
}


//@todo: get type for aggregare_query
const aggregate = async (params: {app_id: string, branch?:string, model_id: string, token: string, aggregare_query: t_aggregate}): DEFAULT_RES_ARR_P<any> => {

    const {app_id, model_id, branch,  token, aggregare_query} = params;
    const url = gen_ds_url({app_id, branch,  model_id, token, op: 'aggregate'});    

    const r = await fetch_post(url, aggregare_query);
    return r;
}

const create_one =  async(params: {app_id: string, branch?:string, model_id: string, token: string, entity: t_create_one}) => {
   
    const {app_id, model_id, branch,  token, entity} = params;
    const url = gen_ds_url({app_id, branch,  model_id, token, op: 'create_one'});

    const r = await fetch_post(url, entity);
    return r;

}

const create_many = async(params: {app_id: string, branch?:string, model_id: string, token: string, entities: t_create_many}) => {
    
    const {app_id, model_id, branch,  token, entities} = params;
    const url = gen_ds_url({app_id, branch,  model_id, token, op: 'create_many'});    
    const r = await fetch_post(url, entities);
    return r;
}

const get_many = async(params: {app_id: string, branch?:string, model_id: string, token: string, get_many_query: t_get_many}) => {
    
    const {app_id, model_id, branch,  token, get_many_query} = params;
    const query = get_many_query.query;

    if(!query.version || query.version === 1 ){
        //@note: adding default id sort, to sort uniquely    
        const find_id_sort  = query.meta?.sorts?.find((sort) => sort.attr === "id");
        if(!find_id_sort) {
            if(!query.meta) query.meta = {};
            if(!query.meta.sorts) query.meta.sorts = [];
            query.meta.sorts.push({attr: "id", order: "DESC", id: "sid"});
        }
    }

    
    const url = gen_ds_url({app_id, branch,  model_id, token, op: 'get_many'});
    const r = await fetch_post(url, get_many_query);
    return r;
}

const get_one = async(params: {app_id: string, branch?:string, model_id: string, token: string, id: string|number}): DEFAULT_RES_SINGLE_P<any> => {
    
    const {app_id, model_id, branch,  token, id} = params;

    const query: t_query = {
        meta: {
            filters: [{attr: "id", op: "eq", val: id, id: "fa-id"}],
            limit: 1,
        }
    }
    const r = await get_many({app_id, model_id, branch, token, get_many_query: {query}});
    if(!r.success) return r;
    if(!r.data) return {success: false, errors: ["NO_DATA_FOUND"]};
    if(r.data.length !== 1) return {success: false, errors: ["INVALID_RESPONSE"]};
    return {success: true, data: r.data[0]};
}


const delete_one = async(params: {app_id: string, branch?:string, model_id: string, token: string, delete_entity: t_delete_one}) => {
    
    const {app_id, model_id, branch,  token, delete_entity} = params;
    const url = gen_ds_url({app_id, branch,  model_id, token, op: 'delete_one'});    
    const r = await fetch_post(url, delete_entity);
    return r;
}

const update_one = async(params: {app_id: string, branch?:string, model_id: string, token: string, update_entity: t_update_one}) => {
    
    const {app_id, model_id, branch,  token, update_entity} = params;
    const url = gen_ds_url({app_id, branch,  model_id, token, op: 'update_one'});    
    const r = await fetch_post(url, update_entity);
    return r;
}

const get_user_profile = async(params: {app_id: string, branch:string, model_id: string, token: string}) => {
    
    const {app_id, model_id, branch,  token} = params;
    const url = gen_ds_url({app_id, branch,  model_id, token, op: 'get_user_profile'});    
    const r = await fetch_get(url);
    return r;
}

const get_items_created_by_user = async(params: {app_id: string, branch?:string, model_id: string, token: string, user_id: string}) => {
    
    const {app_id, model_id, branch,  token, user_id} = params;
    const filters            =   [{attr: 'created_by', op: 'eq', val: user_id, id: "fa-created_by"}];

    const get_many_query : t_get_many = {
        query: {
            meta: {
                filters
            }
        }
    };
    return await get_many({app_id, branch, model_id, token, get_many_query});
}

// this can be used to get the next items in a list
// last item, this case is used for the cursor
const get_next = async(params: {app_id: string, branch?:string, model_id: string, token: string, get_many_query: t_get_many, last_item: OBJECT_TYPE<any>}) => {
    
    const {app_id, model_id, branch,  token, get_many_query, last_item} = params;
    const query = get_many_query.query;
    if(!query.version || query.version === 1) {

        const meta               =   query.meta;
        const filters            =   meta?.filters  || [];
        const sorts              =   meta?.sorts    || [{attr: 'id', order: 'DESC', id: "sid"}];
        const limit              =   meta?.limit    || 16;  
    
        //new filters are to be added to the end of the filters array (from the cursor) for dynamic filtering of data
    
        const new_filters : t_filter[] = [];
    
        sorts.map((sort) => {
            if(last_item[sort.attr] !== undefined) {
    
                let op = "geq";
                sort.id = "fa-"+sort.attr;
                // this done for uniqueness, attr can be id or any other unique property
                if(sort.attr === "id" && sort.order === 'DESC') op = "lt";
                else if(sort.attr === "id" && sort.order === 'ASC')  op = "gt";
                else if(sort.order === 'DESC')   op = "leq";
                else if(sort.order === 'ASC')    op = "geq";
                
                new_filters.push({
                    attr: sort.attr,
                    op,
                    val: last_item[sort.attr],
                    id: "fa-"+sort.attr
                })
               
            }
        })
    
    
        if(Array.isArray(filters)) {
            filters.push(...new_filters);
        }
        else {
    
            // given that filters is an object, we need to add the new filters to the and array(the last of the nested structure)
            const find_last_and = (filters: t_filters_obj) => {
                if(!filters.and){
                    filters.and = new_filters;
                }
                else if(Array.isArray(filters.and)) {
                    filters.and.push(...new_filters);
                }
                else {
                    find_last_and(filters.and);
                }
            }
    
    
            find_last_and(filters);
        }
    
        if(!query.meta) query.meta = {};
    
        //@note: query is changed in place
    
        query.meta.filters  = filters;
        query.meta.sorts    = sorts;
        query.meta.limit    = limit;
    
        return await get_many({app_id, branch, model_id, token, get_many_query});

    }
    else{
        // for new version of query, datascript backend is not implemented yet
        return await get_many({app_id, branch, model_id, token, get_many_query});
    }
}



// this can be used to get the previous items in a list
// first item, this case is used for the cursor
const get_prev = async(params: {app_id: string, branch?:string, model_id: string, token: string, get_many_query: t_get_many, first_item: OBJECT_TYPE<any>}) => {
    
    const {app_id, model_id, branch,  token, get_many_query, first_item} = params;
    const query = get_many_query.query;
    if(!query.version || query.version === 1 ){

        const meta               =   query.meta;    
        const filters            =   meta?.filters  || [];
        const sorts              =   meta?.sorts    || [{attr: 'id', order: 'DESC'}];
        const limit              =   meta?.limit    || 16;  
    
        //new filters are to be added to the end of the filters array (from the cursor) for dynamic filtering of data
    
        //Current sorts are to be replaced with new sorts, the complete order of getting data is changed this case
    
        const new_filters : t_filter[]  =   [];
        const new_sorts : t_sort[]      =   [];
    
        sorts.map((sort) => {
            if(first_item[sort.attr] !== undefined) {
    
                let op = "geq";
                // this done for uniqueness, attr can be id or any other unique property
                if(sort.attr === "id" && sort.order === 'DESC')     op = "gt";
                else if(sort.attr === "id" && sort.order === 'ASC') op = "lt";
                else if(sort.order === 'DESC')op = "geq";
                else if(sort.order === 'ASC') op = "leq";
                
                let new_sort : t_sort = {attr: sort.attr, order: 'DESC', id: "sid"};
    
                new_sorts.push(new_sort);
    
                new_filters.push({
                    attr: sort.attr,
                    op,
                    val: first_item[sort.attr],
                    id: "fa-"+sort.attr
                })
               
            }
        })
    
        // reverse the order of the sorts as well
    
    
        if(Array.isArray(filters)) {
            filters.push(...new_filters);
        }
        else {
            const find_last_and = (filters: t_filters_obj) => {
                if(!filters.and){
                    filters.and = new_filters;
                }
                else if(Array.isArray(filters.and)) {
                    filters.and.push(...new_filters);
                }
                else {
                    find_last_and(filters.and);
                }
            }
    
    
            find_last_and(filters);
        }
    
        if(!query.meta) query.meta = {};
    
        //@note: query is changed in place
    
        query.meta.filters  = filters;
        query.meta.sorts    = new_sorts;
        query.meta.limit    = limit;
    
    
    
        const r = await get_many({app_id, branch, model_id, token, get_many_query});
        if(!r.success) return r;
    
        const data = r.data;
    
        // data comes in the reverse order, we need to reverse it
        if(Array.isArray(data)) {  
            const d = data.reverse();
            return {success: true, data: d};
        }
        // code should never reach here
        return {success: true, data: data};
    }
    else{
        // for new version of query datascript backend is not implemented yet
        return await get_many({app_id, branch, model_id, token, get_many_query});
    }
}



export default {
    create_one,
    get_one,
    get_many,
    delete_one,
    update_one,
    get_user_profile,
    create_many,
    aggregate,
    get_next,
    get_prev,
    get_items_created_by_user
};