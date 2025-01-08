import { t_sstate_set, t_sstate_delete, t_sstate_get } from "@/broken-types/broken-data-api/serverstate";
import { fetch_post } from "../Fetch";
import { GEN_DEPLOY_APP_ID } from "@/utils/app";

const DOMAIN = "https://gateway.brokenatom.workers.dev/api/v1/sstate";

const set = async(params:{token: string, req: t_sstate_set}) => {

    const url = new URL(`${DOMAIN}/set`);
    const DEP_APPID = GEN_DEPLOY_APP_ID();

    url.searchParams.set('app_id', DEP_APPID);
    url.searchParams.set('token', params.token);

    const r = await fetch_post(url.href, params.req);
    return r;

}

const get = async(params: {token: string, req: t_sstate_get}) => {
   
    const url = new URL(`${DOMAIN}/get`);
    const DEP_APPID = GEN_DEPLOY_APP_ID();

    url.searchParams.set('app_id', DEP_APPID);
    url.searchParams.set('token', params.token);

    const r = await fetch_post(url.href, params.req);
    return r;
}

const remove = async(params: {token: string, req: t_sstate_delete}) => {
    
    const url = new URL(`${DOMAIN}/delete`);
    const DEP_APPID = GEN_DEPLOY_APP_ID();

    url.searchParams.set('app_id', DEP_APPID);
    url.searchParams.set('token', params.token);

    const r = await fetch_post(url.href, params.req);
    return r;

}

const SSTATE_API = {
    set,
    get,
    remove
}

export default SSTATE_API;