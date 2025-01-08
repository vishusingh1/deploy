import { fetch_post } from "../Fetch";
import { DEFAULT_RES_SINGLE_P, OBJECT_TYPE } from "@/broken-types/default_res";
import AS from "@/gfn/AS";
import { GEN_DEPLOY_APP_ID } from "@/utils/app";

const USER_API_BASE_URL = "https://user-api-v2.brokenatom.workers.dev/api/v1/users";


export interface USER_WITH_EMAIL {
    email: string,
    role: string,
    method: "email"
}


export interface USER_WITH_MOBILE {
    mobile: string,
    role: string,
    method: "mobile"
}


const get_user_api_url = (op: "create"|"update"|"get"|"delete",  app_id: string, token: string) => {

    return USER_API_BASE_URL+"/"+op+"?app_id="+app_id+"&token="+token;
}



const create_users_in_ddb = async (params: {users: (USER_WITH_EMAIL|USER_WITH_MOBILE)[],  token?: string}): DEFAULT_RES_SINGLE_P<OBJECT_TYPE<any>[]> => {

    const token     =   params.token || AS.USER.token;
    const app_id    =   GEN_DEPLOY_APP_ID();

    // this api creates multiple users at once
    const req_body = {
        users: [...params.users],        
    }

    const url = USER_API_BASE_URL+"/create"+"?app_id="+app_id+"&token="+token;
    const res = await fetch_post(url, req_body);
    if(!res.success) return res;
    if(!res.data || res.data.length==0) return {success: false, errors:['No data found']}
    return {success: true, data: res.data};
}

const update_users_in_ddb = async(params: {user_ids: string[],  token?: string, props: any}): DEFAULT_RES_SINGLE_P<OBJECT_TYPE<any>> => {

    const token     =   params.token || AS.USER.token;

    const app_id    =   GEN_DEPLOY_APP_ID();
    const url       =   get_user_api_url("update", app_id, token);



    const req_body = {
        ids     :   [...params.user_ids],
        update  :   params.props,
        method  :   "ids",
    }

    const res = await fetch_post(url, req_body);
    return res;
}

const delete_users_in_ddb = async(params: {user_ids: string[], token?:string}): DEFAULT_RES_SINGLE_P<OBJECT_TYPE<any>> => { 

    const token     =   params.token || AS.USER.token;

    const app_id    =   GEN_DEPLOY_APP_ID();
    const url       =   get_user_api_url("delete", app_id, token);

    const req_body = {
        ids     :   [...params.user_ids],
        method  :   "ids",
    }

    const res = await fetch_post(url, req_body);
    return res;

}

const get_users_from_ddb = async(params: {user_ids: string[], app_id: string, branch: string, token: string}): DEFAULT_RES_SINGLE_P<OBJECT_TYPE<any>> => {

    const app_id    =   params.app_id;
    const token     =   params.token;
    const url       =   get_user_api_url("get", app_id, token);

    const req_body = {
        ids     :   [...params.user_ids],
        method  :   "ids",
    }

    return await fetch_post(url, req_body);
}


export default{
    create_users: create_users_in_ddb,
    update_users: update_users_in_ddb,
    get_users: get_users_from_ddb,
    delete_users: delete_users_in_ddb,
}






