import AS from "@/gfn/AS";
import { fetch_post } from "../Fetch";
import { GEN_DEPLOY_APP_ID } from "@/utils/app";

const DOMAIN = "https://gateway.brokenatom.workers.dev/api/v1/relation";


const set = async(params: {mid1: string, prop: string, eid1: string|number, eid2: string|number, mid2?: string, data: any, token?: string}) =>{
    
    const DEP_APPID = GEN_DEPLOY_APP_ID();
    const token = params.token || AS.USER.token;

    const url = new URL(`${DOMAIN}/set`);

    url.searchParams.set('app_id', DEP_APPID);
    url.searchParams.set('token', token);


    const req_body = {
        mid1: params.mid1,
        prop1: params.prop,
        eid1: params.eid1,
        eid2: params.eid2,
        data: params.data

    }
    
    const r = await fetch_post(url.href, req_body);
    return r;


}


const get = async(params: {mid1: string, prop: string, eid1: number|string|(string|number)[], eid2?: number|string|(string|number)[],  token?: string}) =>{


    const DEP_APPID = GEN_DEPLOY_APP_ID();
    const token = params.token || AS.USER.token;

    const url = new URL(`${DOMAIN}/get`);

    url.searchParams.set('app_id', DEP_APPID);
    url.searchParams.set('token', token);

    const req_body  =   {
        eid1    :   params.eid1,
        mid1    :   params.mid1,
        prop1   :   params.prop,
        eid2    :   params.eid2,
    }

    const r = await fetch_post(url.href, req_body);
    return r;
}


const remove = async(params: {mid1: string, prop: string, eid1: number|string|(string|number)[], eid2: number|string|(string|number)[],  token?: string}) =>{


    const DEP_APPID = GEN_DEPLOY_APP_ID();
    const token = params.token || AS.USER.token;

    const url = new URL(`${DOMAIN}/delete`);

    url.searchParams.set('app_id', DEP_APPID);
    url.searchParams.set('token', token);

    const req_body  =   {
        eid1    :   params.eid1,
        mid1    :   params.mid1,
        prop1   :   params.prop,
        eid2    :   params.eid2,
    }

    const r = await fetch_post(url.href, req_body);
    return r;
}




const relations = {
    set, 
    get,
    remove
}


export default relations