import { t_delete_one, t_update_one, t_update_patch } from "@/broken-types/broken-data-api/crud";
import { DEFAULT_RES_SINGLE_P, OBJECT_TYPE } from "@/broken-types/default_res";
import { get_token } from "@/gfn/user";
import { GC } from "@/global_state";
import API from "@/lib/api";
import user_api, { USER_WITH_EMAIL, USER_WITH_MOBILE } from "@/stdlib/api/user";
import { GEN_DEPLOY_APP_ID } from "@/utils/app";


const get_user_model = () => {
    const app_json = GC.APP_JSON;
    const model =  app_json.models.find(m => m.name === "user");
    return model;
}

const create_users = async(users: (USER_WITH_EMAIL|USER_WITH_MOBILE)[]) => {
    const app_id    =   GC.APP_ID;
    const branch    =   GC.BRANCH;
    const token     =   get_token();
    const user_model = get_user_model();
    if(!user_model) return;

    const user_model_id = user_model.id;
    if(!token) return;
    const app_with_branch = GEN_DEPLOY_APP_ID();

    const c = await user_api.create_users({users, token});
    if(!c.success) return;
    const ddb_users = c.data;

    const users_for_app: OBJECT_TYPE<any>[] = [];

    for(const user of users){
        
        if(user.method=="email"){
            const id  = ddb_users.find(u => u.email==user.email)?.id;
            if(!id) return;
            users_for_app.push({
                ...user, id
            });
        }
        if(user.method=="mobile"){
            const id  = ddb_users.find(u => u.mobile==user.mobile)?.id;
            if(!id) return;
            users_for_app.push({
                ...user, id
            });
        }
    }

    const a = await API.api.datascript.create_many({app_id, branch, token, model_id: user_model_id, entities: {entity: {data: users_for_app}}});
    if(!a.success) return;
    return {success: true, data: a.data};
}

const create_user = async(user: USER_WITH_EMAIL|USER_WITH_MOBILE): DEFAULT_RES_SINGLE_P<OBJECT_TYPE<any>> => {
    const app_id    =   GC.APP_ID;
    const branch    =   GC.BRANCH;
    const token     =   get_token();
    const user_model = get_user_model();
    if(!user_model) return {success: false, errors: ["NO_USER_MODEL"]};
    const user_model_id = user_model.id;
    if(!token) return {success: false, errors: ["NO_TOKEN"]};

    const app_with_branch = GEN_DEPLOY_APP_ID();

    const c = await user_api.create_users({users: [user], token});
    if(!c.success) return c;
    const ddb_users = c.data;

    const users_for_app: OBJECT_TYPE<any> = {};

    if(user.method=="email"){
        const id  = ddb_users.find(u => u.email==user.email)?.id;
        if(!id) return {success: false, errors: ["NO_USER_WITH_EMAIL"]};
        users_for_app.push({
            ...user, id
        });
    }
    if(user.method=="mobile"){
        const id  = ddb_users.find(u => u.mobile==user.mobile)?.id;
        if(!id) return {success: false, errors: ["NO_USER_WITH_MOBILE"]};
        users_for_app.push({
            ...user, id
        });
    }
    
    // can we call functions from stdlib directly?
    const a = await API.api.datascript.create_one({app_id, branch, token, model_id: user_model_id, entity: {entity: {data: users_for_app}}});
    if(!a.success) return a;
    return {success: true, data: a.data};
}

const create_update_body = (user_id: string, props: any): t_update_one => {

    const patches :  t_update_patch[] = [];

    for(const key in props){
        const val = props[key];
        if(val === undefined) continue;
        patches.push({
            op: "replace",
            path: key,
            value: val
        })
    }

    const body : t_update_one = {
        entity : {
            data: {
                with :  "id",
                id : user_id,
                patches : patches
            }
        }
    }


    return body;
}

const update_user = async(user_id: string, props: any): DEFAULT_RES_SINGLE_P<OBJECT_TYPE<any>> => {
    const app_id    =   GC.APP_ID;
    const branch    =   GC.BRANCH;
    const token     =   get_token();
    const user_model = get_user_model();
    if(!user_model) return {success: false, errors: ["NO_USER_MODEL"]};
    const user_model_id = user_model.id;
    if(!token) return {success: false, errors: ["NO_TOKEN"]};

    const app_with_branch = GEN_DEPLOY_APP_ID();

    const c = await user_api.update_users({user_ids: [user_id], token, props});
    if(!c.success) return c;

    const update_entity = create_update_body(user_id,props);

    const a = await API.api.datascript.update_one({app_id, branch, token, model_id: user_model_id, update_entity  });
    if(!a.success) return a;
    return {success: true, data: a.data};
}


const delete_user = async(user_id: string): DEFAULT_RES_SINGLE_P<OBJECT_TYPE<any>> => {
    
    const app_id    =   GC.APP_ID;
    const branch    =   GC.BRANCH;
    const token     =   get_token();
    const user_model = get_user_model();
    if(!user_model) return {success: false, errors: ["NO_USER_MODEL"]};
    const user_model_id = user_model.id;
    if(!token) return {success: false, errors: ["NO_TOKEN"]};   

    const app_with_branch = GEN_DEPLOY_APP_ID();    

    const c = await user_api.delete_users({user_ids: [user_id], token});
    if(!c.success) return c;

    const delete_entity: t_delete_one = {
        entity: {
            data: {
                with : "id",
                id : user_id
            }
        }
    }


    const a = await API.api.datascript.delete_one({app_id, branch, token, model_id: user_model_id, delete_entity  });
    if(!a.success) return a;
    return {success: true, data: a.data};
}




export const user_module = {
    create_user,
    delete_user,
    update_user,
    create_users
}