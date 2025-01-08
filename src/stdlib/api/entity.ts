import { t_create_many, t_create_one, t_delete_one, t_get_many, t_update_one } from "@/broken-types/broken-data-api/crud";
import { fetch_get, fetch_post } from "../Fetch";
import { t_aggregate } from "@/broken-types/broken-data-api/aggregate";
import { DEFAULT_RES_ARR_P } from "@/broken-types/default_res";
import { GEN_DEPLOY_APP_ID } from "@/utils/app";

const DOMAIN = "https://gateway.brokenatom.workers.dev/api/v1/entity";


const create_one = async (params: {app_id?: string, branch?:string, model_id: string, token: string, entity: t_create_one}) => {
    const url = new URL(`${DOMAIN}/create_one`);
    const DEP_APPID = GEN_DEPLOY_APP_ID();
    url.searchParams.set('app_id', DEP_APPID);
    url.searchParams.set('token', params.token);
    url.searchParams.set('model_id', params.model_id);

    const r = await fetch_post(url.href, params.entity);
    return r;
}

const create_many = async (params: {app_id?: string, branch?:string, model_id: string, token: string, entities: t_create_many}) => {
    // @TODO: NOT IMPLEMENTED YET
    
    const url = new URL(`${DOMAIN}/create_many`);
    const DEP_APPID = GEN_DEPLOY_APP_ID();
    url.searchParams.set('app_id', DEP_APPID);
    url.searchParams.set('token', params.token);
    url.searchParams.set('model_id', params.model_id);

    const r = await fetch_post(url.href, params.entities);
    return r;
}


const get_many = async (params: {app_id?: string, branch?:string, model_id: string, token: string, query: t_get_many}) => {
    const url = new URL(`${DOMAIN}/query`);
    const DEP_APPID = GEN_DEPLOY_APP_ID();
    url.searchParams.set('app_id', DEP_APPID);
    url.searchParams.set('token', params.token);
    url.searchParams.set('model_id', params.model_id);

    // by default sort by id in DESC order ( why id: id is unique, helps in pagination, id is in order of creation(ulids))
    const query = params.query.query;
    if(query.version === 2){
        if(!query.sorts) query.sorts = [];
        const fid = query.sorts.find(s=>s.attr === "id");
        if(!fid) query.sorts.push({attr: "id", order: "DESC", id: "sid"});
        
        // setting default limit to 16 items if not present
        const limit = query.limit;
        if(limit === undefined) query.limit = 16;
    }

    const r = await fetch_post(url.href, params.query);
    return r;
}

const get_one = async (params: {app_id?: string, branch?:string, model_id: string, token: string, id: string|number}) => {
    const url = new URL(`${DOMAIN}/get`);
    const DEP_APPID = GEN_DEPLOY_APP_ID();
    url.searchParams.set('app_id', DEP_APPID);
    url.searchParams.set('token', params.token);
    url.searchParams.set('model_id', params.model_id);

    url.searchParams.set('id', String(params.id));

    const r = await fetch_get(url.href);
    return r;
}

const delete_one = async(params: {app_id?: string, branch?:string, model_id: string, token: string, delete_entity: t_delete_one}) => {
    const url = new URL(`${DOMAIN}/delete_one`);
    const DEP_APPID = GEN_DEPLOY_APP_ID();
    url.searchParams.set('app_id', DEP_APPID);
    url.searchParams.set('token', params.token);
    url.searchParams.set('model_id', params.model_id);

    const delete_entity = params.delete_entity;
    const r = await fetch_post(url.toString(), delete_entity);
    return r;
}

const update_one = async(params: {app_id?: string, branch?:string, model_id: string, token: string, update_entity: t_update_one}) => {
    const url = new URL(`${DOMAIN}/update_one`);
    const DEP_APPID = GEN_DEPLOY_APP_ID();
    url.searchParams.set('app_id', DEP_APPID);
    url.searchParams.set('token', params.token);
    url.searchParams.set('model_id', params.model_id);

    const update_entity = params.update_entity;
    const r = await fetch_post(url.toString(), update_entity);
    return r;
}

const get_user_profile = async (params: {app_id?: string, branch?:string, model_id: string, token: string}) => {
    const url = new URL(`${DOMAIN}/get_user_profile`);
    const DEP_APPID = GEN_DEPLOY_APP_ID();
    url.searchParams.set('app_id', DEP_APPID);
    url.searchParams.set('token', params.token);
    url.searchParams.set('model_id', params.model_id);
    if(params.branch) url.searchParams.set('branch', params.branch);

    const r = await fetch_get(url.toString());
    return r;

}

const aggregate = async (params: {app_id?: string, branch?:string, model_id: string, token: string, aggregare_query: t_aggregate}): DEFAULT_RES_ARR_P<any> => {

    const {app_id, model_id, branch,  token, aggregare_query} = params;

    const url = new URL(`${DOMAIN}/aggregate`);
    const DEP_APPID = GEN_DEPLOY_APP_ID();
    url.searchParams.set('app_id', DEP_APPID);
    url.searchParams.set('token', params.token);
    url.searchParams.set('model_id', params.model_id);
        

    const r = await fetch_post(url.toString(), aggregare_query);
    return r;
}




const ENTITY_API = {
    create_one,
    create_many,
    get_many,
    get_one,
    update_one, 
    delete_one,
    get_user_profile,
    aggregate
}

export default ENTITY_API;