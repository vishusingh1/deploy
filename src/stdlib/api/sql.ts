import { fetch_post, fetch_get } from "../Fetch";
import { t_create_many, t_create_one, t_delete_one, t_get_many, t_update_one } from "../../broken-types/broken-data-api/crud";
import { DEFAULT_RES_ARR_P, OBJECT_TYPE } from "../../broken-types/default_res";
import { t_aggregate } from "../../broken-types/broken-data-api/aggregate";
import { GEN_DEPLOY_APP_ID } from "@/utils/app";


const ENTITY_WORKER_URL = 'https://entity-v2.brokenatom.workers.dev/api/v1';

const gen_entity_url = (params:{app_id: string, branch?:string, model_id: string, token: string, op: string}) => {
    const APPID = GEN_DEPLOY_APP_ID();
    
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
    return `${ENTITY_WORKER_URL}/${params.op}?${query_string_params.join('&')}`;

}

//@todo: get type for aggregare_query
const aggregate = async (params: {app_id: string, branch?:string, model_id: string, token: string, aggregare_query: t_aggregate}): DEFAULT_RES_ARR_P<any> => {

    const {app_id, branch, model_id, token, aggregare_query} = params;
    const url = gen_entity_url({app_id, branch, model_id, token, op: 'aggregate'});    
    const r = await fetch_post(url, aggregare_query);
    return r;
}

const create_one =  async(params: {app_id: string, branch?:string, model_id: string, token: string, entity: t_create_one}) => {
   
    const {app_id, branch, model_id, token, entity} = params;
    const url = gen_entity_url({app_id, branch, model_id, token, op: 'create_one'});

    const r = await fetch_post(url, entity);
    return r;

}

const create_many = async(params: {app_id: string, branch?:string, model_id: string, token: string, entities: t_create_many}) => {
    
    const {app_id, branch, model_id, token, entities} = params;
    const url = gen_entity_url({app_id, branch, model_id, token, op: 'create_many'});    
    const r = await fetch_post(url, entities);
    return r;
}

const get_many = async(params: {app_id: string, branch?:string, model_id: string, token: string, get_many_query: t_get_many}) => {
    
    const {app_id, branch, model_id, token, get_many_query} = params;
    const url = gen_entity_url({app_id, branch, model_id, token, op: 'get_many'});
    const r = await fetch_post(url, get_many_query);
    return r;
}

const delete_one = async(params: {app_id: string, branch?:string, model_id: string, token: string, delete_entity: t_delete_one}) => {
    
    const {app_id, branch, model_id, token, delete_entity} = params;
    const url = gen_entity_url({app_id, branch, model_id, token, op: 'delete_one'});    
    const r = await fetch_post(url, delete_entity);
    return r;
}

const update_one = async(params: {app_id: string, branch?:string, model_id: string, token: string, update_entity: t_update_one}) => {
    
    const {app_id, branch, model_id, token, update_entity} = params;
    const url = gen_entity_url({app_id, branch, model_id, token, op: 'update_one'});    
    const r = await fetch_post(url, update_entity);
    return r;
}

const get_user_profile = async(params: {app_id: string, branch?:string, model_id: string, token: string}) => {
    
    const {app_id, branch, model_id, token} = params;
    const url = gen_entity_url({app_id, branch, model_id, token, op: 'get_user_profile'});    
    const r = await fetch_get(url);
    return r;
}

export default {
    aggregate,
    create_many,
    create_one,
    delete_one,
    get_many,
    get_user_profile,
    update_one
};
