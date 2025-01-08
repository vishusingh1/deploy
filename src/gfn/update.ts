// import { feedback, get_api, get_ulid, json_parse } from "./utils";

import GFN from "../GFN";
import authz from "../user/auth";
import AS from './AS';
import {GC} from "../global_state";
import { Patch } from "structurajs";
import { prepare_data_for_create } from "./create";
import { get_token, get_user, get_user_token_api } from "./user";
import { inc_tx } from "./db";
import { get_attr_from_event } from "./events";
import { get_model, get_model_by_name } from "./models";
import { feedback, json5_parse } from "./utils";
import { T_UPDATES } from "../broken-types/update";
import { DEFAULT_RES_SINGLE_P, OBJECT_TYPE } from "../broken-types/default_res";
import { OBJ_WITH_ID } from "../broken-types/g_type";
import { T_INFO } from "../broken-types/comp";
import { t_update_patch } from "../broken-types/broken-data-api/crud";
import entity from "../stdlib/api/sql";
import toast from "react-hot-toast";
import { GEN_DEPLOY_APP_ID } from "@/utils/app";

export const assign_id_and_user_and_time = function (data: any, is_update?: boolean) {
    // only assign if not already assigned
    // because the user might have already assigned it in custom code


    // set user and id
    if(is_update){
        // NO NEED - THESE ARE BEING SET IN BACKEND!!!
        const user = get_user();
        if(!user) return console.warn("User not found", "error");
        if(!data.updated_by) data.updated_by = user.profile?.id || "SYSTEM";
        data.updated_at = new Date().getTime();
    }
    else{
        // if(!data.id) data.id = get_ulid() || data.id; // id might get generated in the backend

        // NO NEED - THESE ARE BEING SET IN BACKEND!!!
        const user = get_user();
        if(!data.created_by) data.created_by = user?.profile?.id || "SYSTEM";
        if(!data.updated_by) data.updated_by = user?.profile?.id || "SYSTEM";
        data.created_at = new Date().getTime();
        data.updated_at = new Date().getTime();
    }
}

export const prepare_data_for_update = async function (model_id: string, PD: any, ND: any) {
    // @commented by ashish on 17th Dec 2023. _meta __prevM no longer used

    if(!PD || !ND || !PD.id || !ND.id) return;



    console.log("PREPARE DATA FOR UPDATE PM and M : ", PD, ND);
    
    // let's remove unnecessary props
    // for(let [k, v] of Object.entries(M)){
    //     if(k.startsWith("_")) delete M[k]; // for _meta and __prevM
    // }
    // for(let [k, v] of Object.entries(PM)){
    //     if(k.startsWith("_")) delete PM[k]; // for _meta and __prevM
    // }


    // FIRST
    // update: // images, files, default values, id and user and time
    await prepare_data_for_create(model_id, ND, true);


    const all_keys      = [...Object.keys(ND), ...Object.keys(PD)];
    const unique_keys   = [...new Set(all_keys)];


    const updates = {id: ND.id, add : {}, delete: {}}; // {prop_name: [1, 2],  prop_name: "1"}
    
    // let's compare
    for(let k of unique_keys){
        if(k.startsWith("__")) continue; // ignore __meta

        let a = PD[k];
        let b = ND[k];

        const u = update_one_get_changed_values(a, b);

        if(u.set !== null)      updates.add[k] = u.set;
        if(u.unset !== null)    updates.delete[k] = u.unset;

        if(u.added.length)      updates.add[k] = u.added;
        if(u.deleted.length)    updates.delete[k] = u.deleted;
    }

    return updates;

}

export const update_one_get_changed_values = function (a: any, b: any) {
    let set:any = null;
    let unset:any = null;

    let added:any[] = [];
    let deleted:any[] = [];


    const is_object_same = (a, b) => {
        return JSON.stringify(a) === JSON.stringify(b);
    }



    const get_deleted_items_in_array = (a, b) => {
        // all removed or b is undefined
        if(!b || !Array.isArray(b)){
            // console.log("pushing all into deleted from a... ", a);
            const arr = a.map(m=>{
                if(typeof(m) === "object") {
                    return m.id;
                }
                else return m;
            })
            deleted.push(...arr);
            return;
        }
        // a is array & b is array
        for(let item of a){
            const aitems = JSON.stringify(item);
            const bitem = b.find((bitem)=>{
                if(typeof(item) === "object") return item.id === bitem;
                return JSON.stringify(bitem) === aitems;
            });

            if(bitem) continue;
            deleted.push(item);
        }
    }

    const get_added_items_in_array = (a, b) => {
        if(!b || !Array.isArray(b)){
            return; // nothing is added
        }

        if(!a || !Array.isArray(a)){
            added.push(...b); // everything is added
            return;
        }


        // a is array & b is array
        for(let bitem of b){
            const bitems = JSON.stringify(bitem);
            const aitem = a.find((aitem)=>{
                if(typeof(aitem) === "object") return aitem.id === bitem;
                return JSON.stringify(aitem) === bitems;
            });

            if(aitem) continue;
            added.push(bitem);
        }
    }


    if(Array.isArray(a) && Array.isArray(b)){
        get_deleted_items_in_array(a, b);
        get_added_items_in_array(a, b);
    }
    else if(Array.isArray(a) && !Array.isArray(b)){
        get_deleted_items_in_array(a, b);
    }
    else if(Array.isArray(b) && !Array.isArray(a)){
        get_added_items_in_array(a, b);
    }
    else if(typeof(a) === "object" && typeof(b) === "object"){
        if(!is_object_same(a, b)){
            set  = b; // new value
        }
    }
    // b cannot be object unless it is is_json, but id is now implemented in is_json, so it will be replaced with id
    else if (typeof(a) === "object" && typeof(b) === "string") { // relation with is_many = false
        if(b === "SYSTEM" || !a.id) {
            set = null;
            unset = null;
        }
        else if (a.id === b) {
            set = null;
            unset = null;
        }
        else {
            set = b;
        }
    }
    else if(a !== b){
        if(b === undefined){
            unset = a;
        }
        else{
            set = b;
        }
    }


    return {set, unset, added, deleted};
}

export const update_one = async function (model_id:string, eid: string, update: T_UPDATES):DEFAULT_RES_SINGLE_P<OBJ_WITH_ID> {
    const uat = get_user_token_api();
    if(!uat.success) {
        return {success: false, errors: uat.errors};
    } 


    const {api, token, user} = uat.data;
    

    
    // permission we can check only for type=DATA rest of the method has not been implemented yet
    if(update.type === "DATA"){
        const permission = authz.update(model_id, update.data, user);
        if(!permission.success) return {success: false, errors: permission.errors}
    }
    else if(update.type === "PATCHES"){
        console.error("PATCHES NOT IMPLEMENTED YET");
        // return {success: false, errors: ["PATCHES NOT IMPLEMENTED YET"]};
    }
    else if(update.type === "OPERATIONS"){
        console.error("OPERATIONS NOT IMPLEMENTED YET");
        // return {success: false, errors: ["OPERATIONS NOT IMPLEMENTED YET"]};
    }




    if(update.type === "DATA"){
        const PD = update.prev || AS.GSTORE.get(model_id, eid);
        if(!PD || !PD.id) {
            return {success: false, errors: ["PREV DATA NOT_FOUND"]};
        }
        const ND = update.data;
        if(!ND || !ND.id) {
            return {success: false, errors: ["NEW DATA NOT_FOUND"]};
        } 

        const u = await prepare_data_for_update(model_id, PD, ND);
        if(!u) {
            return {success: false, errors: ["PREPARE DATA FAILED"]};
        }

        // console.log('updating data: ', u);

        let patches_arr:{op:'add' | 'remove'| 'replace' |'test', path:string, value:any}[] = [];

        if(!u.add || !u.delete) {
            return {success: false, errors: ["NO CHANGES"]}
        } 

        for(let [k, v] of Object.entries(u.delete)){
            patches_arr.push({op: "remove", path: `/${k}`, value: v});
        }

        for(let [k, v] of Object.entries(u.add)){
            patches_arr.push({op: "add", path: `/${k}`, value: v});
        }

       


        // This has to match the datascript - api update type {id, patches: [{op, path, value}]}
        const updates = {
            entity:{
                data: {
                    with: "id",
                    patches:patches_arr,
                    id: ND.id
                }
            }

        }
        // @todo: implement patches
        console.log('Final Update data: ', updates);
        const appid = GC.APP_ID;
        const branch  = GC.BRANCH;
        const r = await api.entity.update_one({app_id: appid, model_id: model_id, branch,token, update_entity: {
            entity: {data: {with: "id", patches:patches_arr, id: ND.id}},
        }});
        if(!r || !r.success) {
            return {success: false, errors: r.errors};
        }

        inc_tx("update", model_id, [eid], ["*"], r.data);
        return {success: true, data: r.data};
    }
    else if(update.type === "PATCHES"){
        console.error("PATCHES NOT IMPLEMENTED YET");
        return {success: false, errors: ["PATCHES NOT IMPLEMENTED YET"]};
    }
    else if(update.type === "OPERATIONS"){
        console.error("OPERATIONS NOT IMPLEMENTED YET");
        return {success: false, errors: ["OPERATIONS NOT IMPLEMENTED YET"]};
    }
    

    
    return {success: false, errors: ["UNKNOWN TYPE"]};

}

// update a single property of an entity
export const update_one_prop = async  (mid: string, eid: string, update_props: OBJECT_TYPE<any>) => {
   
    const uat = get_user_token_api();
    if(!uat.success) {
        return {success: false, errors: uat.errors};
    } 
    const {api, token, user} = uat.data;

    if(!Object.keys(update_props).length) return {success: false, errors: ["NO_PROPS_TO_UPDATE"]};

    const k     =   Object.keys(update_props)[0];
    const v     =   update_props[k];

    const updates: T_UPDATES = {
        type    :   "PATCHES",
        id      :   eid,
        patches :   [{op: "replace", path: `/${k}`, value: v}]
    };

    const app_id = GEN_DEPLOY_APP_ID();

    const r = await api.entity.update_one({app_id,  model_id: mid, token, update_entity: {
        entity: {data: {with: "id", patches: updates.patches, id:eid}},
    }});
  

    return r;

}



export const bro_update_one = async function (e: any, M: any, INFO: T_INFO, props: any, idx?: number) {
    toast.loading("UPDATING...");

    const mid = INFO.mid;
    if(!M || !M.id) {
        toast.dismiss();
        toast.error("data not found, Can't update item");
        return console.warn("M || M.id not found Can't update item", M);
    }
    // console.log(" INSIDE BRO_UPDATE_ONE : ", M ,mid);
    await AS.GSTORE.update_one(mid, M.id, M);
    toast.dismiss();
}

const updates_ops_to_patches = function (updates: T_UPDATES) {
    if(updates.type !== "OPERATIONS") return [];

    const patchupdates:t_update_patch[] = [];
    // add
    for(let [k, v] of Object.entries(updates.add)){
        patchupdates.push({op: "add", path: `/${k}`, value: v});
    }
    // delete
    for(let [k, v] of Object.entries(updates.delete)){
        patchupdates.push({op: "remove", path: `/${k}`, value: v});
    }

    // set
    for(let [k, v] of Object.entries(updates.set)){
        patchupdates.push({op: "replace", path: `/${k}`, value: v});
    }

    return patchupdates;
}


// takes a update object which has the diff and changes the DB
export const apply_updates = async function (mid: string, updates: T_UPDATES) {
    if (!updates.id) return feedback('No id found to update entity', "error");

    const uat = get_user_token_api();
    if(!uat.success) return {success: false, errors: uat.errors};


    const {api, token, user} = uat.data;
    
    // permission we can check only for type=DATA rest of the method has not been implemented yet
    if(updates.type === "DATA"){
        const permission = authz.update(mid, updates.data, user);
        if(!permission.success) return {success: false, errors: permission.errors}
    }
    else if(updates.type === "PATCHES"){
        console.error("PATCHES NOT IMPLEMENTED YET");
        // return {success: false, errors: ["PATCHES NOT IMPLEMENTED YET"]};
    }
    else if(updates.type === "OPERATIONS"){
        console.error("OPERATIONS NOT IMPLEMENTED YET");
        // return {success: false, errors: ["OPERATIONS NOT IMPLEMENTED YET"]};
    }


    if(updates.type === "OPERATIONS"){
        const patches = updates_ops_to_patches(updates);
        const data = {
            id: updates.id,
            patches: patches
        }
        const branch  = GC.BRANCH;
        const r = await api.entity.update_one({app_id: GC.APP_ID, model_id: mid,branch, token, update_entity: {
            entity: {data: {with: "id", patches: patches, id: updates.id}},
        }});
        if(!r || !r.success) return {success: false, errors: r.errors};
        if(!r.data) return {success: false, errors: ["NO DATA RETURNED"]};

        inc_tx("update", mid, [updates.id], ["*"], r.data);
        feedback(`Updated Successfully`, "success");
        return r;

    }
    else if(updates.type === "DATA"){
        // convert to patches, by using previous data
        console.warn("APPLY UPDATES : DATA TYPE NOT IMPLEMENTED YET");
        return {success: false, errors: ["DATA TYPE NOT IMPLEMENTED YET"]};
    }
    else if(updates.type === "PATCHES"){
        const data = {
            id: updates.id,
            patches: updates.patches
        }
        const branch  = GC.BRANCH;
        const r = await api.entity.update_one({app_id: GC.APP_ID, model_id: mid,branch, token, update_entity: {
            entity: {data: {with: "id", patches: updates.patches, id: updates.id}},
        }});
        if(!r || !r.success) return {success: false, errors: r.errors};
        if(!r.data) return {success: false, errors: ["NO DATA RETURNED"]};

        inc_tx("update", mid, [updates.id], ["*"], r.data);
        feedback(`Updated Successfully`, "success");

        return r;
    }
    
}

export const bro_apply_updates = async function (e: any, M: any, INFO: T_INFO, props: any, idx?: number) {
    const app_id = GC.APP_ID;

    const uta = get_user_token_api();


    const updates_str = get_attr_from_event(e, ['updates']);
    if(!updates_str) return;
    const updates = json5_parse(updates_str);
    if(!updates) return;
    if(!Array.isArray(updates)) return;

    // if(!updates.length) return;
    // if(!updates.every(u=>u.source && u.action && u.dest)) return; console.warn("Invalid updates: ", updates);


    // const update
    /**
     * add to cart
     * user.cart[product_id]
     * product
     */
    console.log("UPDATES : ", updates);
    for(let u of updates){
        /* Actions like unset does not need source for execution */
       
        if((!u.source || !u.action || !u.dest) && !(["unset"].includes(u.action) && u.dest)) {
            if(!u.code) continue; // condition not included in above if statement to make it look neat
        }


        const update_body  = {id: null, add: {}, delete: {}}
        // M:product.id = > set => M:logedinuser.cart
       
        const des_a = u.dest.trim().split(".");
        if(des_a.length !== 2) continue;

        const dest_prop_name  =   des_a[1];

        let dest_model_id:any   =   null;
        let dest_model:any      =   null;
        let dest_entity:any     =   null;


        if(des_a[0].startsWith("M:") || des_a[0].startsWith("S:")){
            const m         =   des_a[0].split(":");
            if(m.length !== 2)  continue;
            dest_model_id   =   m[1];
            dest_model      =   get_model(dest_model_id);
            if(m[0] === "M"){
                dest_entity    =    M;
                // dest_entity_id =    M.id;    
            }
            else if(m[0] === "S"){
                dest_entity    = AS.GSTORE.selected_entity[dest_model_id]
            }
            else{
                //continue for now;
                continue
            }

        }
        else if (des_a[0].startsWith("user") || des_a.startsWith("logedinuser")){
            const user_model    =   get_model_by_name("user");
            dest_model          =   user_model;
            dest_model_id       =   user_model?.id;
            dest_entity         =   AS.USER;
        }
        else{
            //continue for now
            continue;
        }

        if(!dest_model){
            console.warn("destination model not found");
            continue;
        };
        const p = dest_model.props.find(p => p.name === dest_prop_name);
        if(!p) {
            console.warn("destination prop not found");
            continue;
        }
        if(!dest_entity){
            console.warn("destination entity not found");
            continue;
        }
        const dest_entity_id = dest_entity.id;

        if(!dest_entity_id){
            console.warn(`destination id in ${JSON.stringify(dest_entity)} not found`);
            continue;
        }
        update_body.id = dest_entity_id;

        //source

        let source_val:any = undefined;
        const source_a = u.source?.trim();
        let source_entity:any = undefined; // to make the source entity available in the eval code;

        if(source_a.startsWith("M:") || source_a.startsWith("S:") ){
            const s = source_a.split(".");
            if(s.length !== 2) continue;
            const source_prop = s[1];
            const s_m = s[0].split(":");
            if(s_m.length !== 2) continue;
            const source_model_id = s_m[1];
            if(source_a.startsWith("M:")){
                source_val = M[source_prop];
                source_entity = M;
            }
            else{
                source_entity = AS.GSTORE.selected_entity[source_model_id];
                if(!source_entity){
                    console.warn("source entity not found");
                    continue;
                }
                source_val = source_entity[source_prop];
            }
        }
        else if(source_a.startsWith("user.")||source_a.startsWith("logedinuser.")){
            const s = source_a.split(".");
            if(s.length !== 2) continue;
            const source_prop = s[1];

            // @todo: re-write this complete block
            // if(!AS.user){
            //     console.warn("user is not found in app state");
            //     continue;
            // }
            // source_val = AS.user[source_prop];
            // source_entity = AS.user;
            //
        }
        else {
            source_val = source_a;
        }

        if(source_val === undefined){
            if(!u.code) {
                console.warn("source value is undefined");
                continue;
            }
        }

        const code = u.code;
        if (code) {
            try {
                /*
                    variables available inside the text area :
                        1. update_body : {id, add : {}, delete : {}}
                        2. dest_entity
                        4. source_entity
                        5. global variables like AS.user
                */
               console.log("SOURCE ENTITY : ", source_entity);
                eval(code); // update_body should be updated inside the code written by the user.
            } catch (e) {
                console.log("ERROR DURING EVAL : ", e);
            }
        }

        //actions

        let action_a = u.action;
        if(!action_a){
            if(!u.code) {
                console.warn("id not found for action ", u.action);
                continue;
            }
        }
        if(u.code) action_a = null;
        //array add ops
        if(["push", "push_unique", "push_and_inc", "push_and_group", "push_and_set"].includes(action_a)){
            const add_val:any[]  = [];
            //@to-do : check the type of sourceval with dest prop type
            if(Array.isArray(source_val)){
                const a = source_val.filter(s => s);
                add_val.push(...a)
            }
            else{
                add_val.push(source_val);
            }

            update_body.add[dest_prop_name] = add_val;
        }
        else if (["remove", "remove_and_set", "remove_and_unset"].includes(action_a)){
            const del_val:any[] = [];
            //@to-do : check the type of sourceval with dest prop type
            if(Array.isArray(source_val)){
                const a = source_val.filter(s => s).map(s=>{
                    if(typeof(s) === "object") return s.id;
                    return s;
                });
                del_val.push(...a)
            }
            else{
                if(typeof(source_val) === "object") del_val.push(source_val.id);
                else  del_val.push(source_val);
            }
            update_body.delete[dest_prop_name] = del_val;
        }
        else if (["set", "unset"].includes(action_a)){

            if(action_a === "set"){
                update_body.add[dest_prop_name] = source_val;
            }
            else{
                const prop_name = u.dest.split(".").filter(r=>r)[1];
                if(!prop_name) continue;
                console.log("DESTINATION PROP : ", dest_entity[prop_name]);
                const prop_value = dest_entity[prop_name];
                if(typeof(prop_value) === "object") {
                    update_body.delete[dest_prop_name] = prop_value.id;
                }
                else {
                    update_body.delete[dest_prop_name] = prop_value;
                }
            }
        }
        else if (["increment", "decrement"].includes(action_a)){
            if(isNaN(Number(source_val))) {
                console.warn("invalid action, source type is not number");
                continue;
            }
            const dest_value = dest_entity[dest_prop_name];
            if(action_a === "increment") source_val = dest_entity[dest_prop_name] + Number(source_val);
            if(action_a === "decrement") source_val = dest_entity[dest_prop_name] - Number(source_val);
            update_body.add[dest_prop_name] = source_val;
        }
        else if (["set_true", "set_false", "toggle"].includes(action_a)){
            if(action_a === "set_true") source_val = true;
            if(action_a === "set_false") source_val = false;
            if(action_a === "toggle"){
                if(dest_entity[dest_prop_name]) source_val = false;
                else source_val =  true;
            }
            update_body.add[dest_prop_name] = source_val
        }
        else{
            // new update actions
        }
        
        // const r = await apply_updates(app_id, dest_model_id, update_body);
        // console.group();
        // console.log("updates : ", updates);
        // console.log("response: ", r);
        // console.log("update body : ", update_body);
        // console.groupEnd();
    }
}