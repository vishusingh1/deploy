// import { feedback, get_api, get_auth } from "./utils";
import {GC} from "../global_state";

import GFN from "../GFN";
import { EN_BROKEN_G_FN_LOGS } from "./logs";
import { BROKEN_USER } from "../user/user";
import API from "../lib/api";


import AS from "./AS";
import { DEFAULT_RES_SINGLE } from "../broken-types/default_res";
import { jwtDecode } from "@/user/jwt";

export const get_token = function () {
    if(!AS.enable_login) return "{msg:'NO_TOKEN_REQUIRED_LOGIN_TYPE_IS_NONE'}";

    const user = get_user();
    if (!user) return;
    if (!user.token) return;
    return user.token;
}; 
export const get_user = function () {
    const USER = AS.USER;
    if (!USER) return;
    if (!USER.token) return;
    return USER;
}
export const get_user_token_api = function(alert?: boolean): DEFAULT_RES_SINGLE<{api: typeof API.api, user: BROKEN_USER, token: string}>{
    const errors: string[] = [];
    const user = AS.USER;
    const token = AS.USER.token || "";
    const api = API.api;

    return {success: true, data: {api, user, token}};
    
};

export const get_roles = function () {
    const AJ = GC.APP_JSON as any;
    if (!AJ) {
        console.warn("No APP_JSON found in global state. Can't get roles");
        return null;
    }

    const roles = AJ.roles;
    if (!roles || !Array.isArray(roles)) {
        console.warn('roles not found in APP_JSON or is not an array', roles);
        return null;
    }

    return roles;
};


export const generate_user_id_by_email = async function (data : any) {
    const email = data?.email;
    if(!email) return;
    const myText = new TextEncoder().encode(email);

    const myDigest = await crypto.subtle.digest(
        {
        name: 'SHA-256',
        },
        myText // The data you want to hash as an ArrayBuffer
    );
    const hashArray = Array.from(new Uint8Array(myDigest)) 
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    //return first 32 characters
    let hash_str = hashHex.substring(0, 32);

    return hash_str;
}

// This gets the user model in our app
// export const get_user_profile = async function () {
//     if(AS.USER.profile) return AS.USER.profile;
    
    
//     const token = AS.USER.token;
//     if(!token){
//         console.warn("No token found in user: ", AS.USER);
//         return;
//     }
    
    
    
//     const AJ = GC.APP_JSON;
//     const model = AJ.models.find((m) => m.name?.toLowerCase() === "user");
//     if(!model) return console.warn("Unable to get user model: ", AJ.models);

//     const api = GFN.get_api();

//     const app_id    = AJ.id;
//     const model_id  = model.id;
//     const branch    = GC.BRANCH;
//     const r = await api.datascript.get_user_profile({app_id, branch, model_id, token});
//     if(!r || !r.success) return console.warn("Unable to get user profile: ", r);
//     if(!r.data) return console.warn("Unable to get user profile: ", r);

//     const profile = r.data;
//     return profile;
// }
export const get_user_profile = async function (ddbuser: {id: string, token: string}) {
    
    const AJ = GC.APP_JSON;
    const model = AJ.models.find((m) => m.name?.toLowerCase() === "user");
    if(!model) return console.warn("Unable to get user model: ", AJ.models);

    const api = GFN.get_api();
    const token = ddbuser.token;

    const app_id    = AJ.id;
    const model_id  = model.id;
    const branch    = GC.BRANCH;
    const userid    = ddbuser.id;
    if(!userid) return console.warn("NO DDB USER ID FOUND", AS.USER.ddbuser);


    // const r = await api.datascript.get_user_profile({app_id, branch, model_id, token});
    const r = await api.entity.get_user_profile({app_id, model_id, branch, token});
    if(!r || !r.success) return console.warn("Unable to get user profile: ", r);
    if(!r.data) return console.warn("Unable to get user profile: ", r);

    const profile = r.data;
    return profile;
}



