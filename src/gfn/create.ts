import { get_model } from "./models";
import { feedback } from "./utils";

import {GC} from "../global_state";

import { assign_id_and_user_and_time } from "./update";
import { DEFAULT_RES_ARR_P, DEFAULT_RES_SINGLE, DEFAULT_RES_SINGLE_P } from "../broken-types/default_res";
import {get_user_token_api } from "./user";
import authz from "../user/auth";
import { inc_tx } from "./db";
import AS from "./AS";
import { OBJ_WITH_ID } from "../broken-types/g_type";
import { T_INFO } from "../broken-types/comp";
import { EN_BROKEN_G_FN_LOGS } from "./logs";
import { generate_draft_id } from "../utils/draft";
import toast from "react-hot-toast";
import UTILS from "@/utils";


// const get_url = (r: DEFAULT_RES_SINGLE<any>): string|undefined => {
//     if (!r || !r.success || !r.data) {
//         feedback('Unable to upload ', "error");
//         return;
//     }

//     const o = r.data;

//     if (!o) {
//         feedback('Invalid response for upload ', "error");
//         return;
//     }

//     if (o.url && typeof(o.url) === "string") return o.url;
// };

// const DEFAULT_FILE_URL = "https://image.lexica.art/full_jpg/1716b9b9-3bdc-4f9f-a933-ecac5b141cbd"



export const prepare_data_for_create = async function (model_id: string, data: {[k:string]: any}, is_update?: boolean) {
    if(!data) return; // don't check for id. It might get generated in the server

    const MODEL = get_model(model_id);
    if(!MODEL) {
        feedback(`Model not found: ${model_id}`, "error");
        return null;
    }

    const app_id = GC.APP_ID;

    const r = get_user_token_api();
    if (!r.success) return feedback('Unable to get api', "error");


    const {api, token} = r.data;


    // set id and user and time
    assign_id_and_user_and_time(data, is_update);



    // any of the props of data could be image, images[], file or files[]
    // const images: File[] = [];
    // const files:  File[] = [];

    
    // const get_file_json_obj = async (F:any, eid:string, prop_name:string, idx:number, IS_IMAGE:boolean) => {
    //     if(typeof(F) === "string"){
    //         return {name: F, url: F, size: 1, type: "image/jpeg"};
    //     }
    //     else if(!(F instanceof File)){
    //         if(F && F.url && F.name && F.size && F.type) return F; // already formated json obj
    //         return {name: "", url: DEFAULT_FILE_URL, size: 0, type: "jpg"};
    //     }
    
    
    //     let r:any = {};
    //     if (IS_IMAGE) {
    //         const file = { image: F, name: F.name || 'file', uid: idx.toString() };
    //         r = await api.image
    //             .put_one({access: 'PUBLIC', app_id, model_id, entity_id: eid, prop_id: prop_name, data: file, token: token})
    //             .catch((e) => {
    //                 feedback(`Error in file upload: ${e.message} `, "error");
    //             });
    //     }
    //     else{
    //         const file = { file: F, name: F.name || 'file', uid: idx.toString() };
    //         r = await api.file
    //         .put_one({access: 'PRIVATE', app_id, model_id, entity_id: eid, prop_id: prop_name, data: file, token: token})
    //         .catch((e) => {
    //             feedback(`Error in file upload: ${e.message} `, "error");
    //         });
    //     }
    
    //     const upload_url = get_url(r) || DEFAULT_FILE_URL;
    //     // const url_res = await fetch(upload_url).catch((e) => { 
    //     //     console.warn('Error in fetching file url: ', e); 
    //     //     return DEFAULT_FILE_URL; 
    //     // });

    //     // if(!url_res) return {name: F.name, url: DEFAULT_FILE_URL, size: F.size, type: F.type};
    //     // const url = await url_res.json().catch((e) => { console.warn('Error in fetching file url: ', e); return DEFAULT_FILE_URL; });   
    //     console.log('url : ', upload_url);
    //     return {name: F.name, url:upload_url, size: F.size, type: F.type};
    // }
    
    // const get_file_json_obj_for_arr = async(Fitem:any, eid:string, prop_name:string, idx:number, IS_IMAGE:boolean) => {
    //     const r = await get_file_json_obj(Fitem.v, eid, prop_name, idx, IS_IMAGE);
    //     return {id: Fitem.id, v: r};
    // }


    


    // Images && Files
    // app_json?.models[0].props[0].type
    // for(let p of MODEL.props){
    //     if (!["file", "image"].includes(p.type)) continue;

    //     const k = p.name;
    //     const v = data[k];

    //     // v is not a required property
    //     if(v === undefined) continue;


    //     const IS_IMAGE = p.type === "image";

    //     if(p.is_many){
    //         if(Array.isArray(v)) {
    //             data[k] = await Promise.all(v.map(async (f, i)=> await get_file_json_obj_for_arr(f, data.id, k, i, IS_IMAGE)));
    //         }
    //         else {
    //             data[k] = [];
    //         }
    //     }
    //     else{
    //         data[k] = await get_file_json_obj(v, data.id, k, 0, IS_IMAGE);
    //     }
    // }


    // relations
    // convert object to id before saving
    for(let p of MODEL.props){
        if(!p.is_relation) continue;

        const k = p.name;
        const v = data[k];

        if(p.is_many){
            if(Array.isArray(v)) {
                data[k] = v.map((rm)=>{
                    if(typeof(rm) === "object") return rm.id;
                    return rm;
                }).filter((rm)=>rm);
            }
        }
        else{
            if(typeof(v) === "object") data[k] = v.id || "SYSTEM";
            if(typeof(v) === "string") data[k] = v;
            if(!data[k]) delete data[k];
        }
    }



    // if relation is user the user id has to be 26 character
    // remove this limitation




    // Default value for boolean
    // @for boolean type if it is not selected then it should be false
    // if it is not in UI it should be undefined
    for(let p of MODEL.props){
        if(p.type !== "boolean") continue;

        if(p.is_many){
            const ds = data[p.name];
            if(Array.isArray(ds)){
                data[p.name] = ds.map((d)=> d || false);
            }
        }
        else{
            data[p.name] = data[p.name] || false;
        }
    }



    // JSON with text prop
    for(let p of MODEL.props){
        if(p.type !== "text") continue;
        
        // maybe it's optional
        const json = data[p.name];
        if(!json) continue;

        
        if(p.is_many){
            if(Array.isArray(json)){
                for(let i = 0; i < json.length; i++){
                    // already text
                    if(typeof(json[i]) === "string") continue;

                    // convert to text
                    json[i] = JSON.stringify(json[i]);
                }
            }
        }
        else{
            // already text
            if(typeof(json) === "string") continue;


            // convert to text
            data[p.name] = JSON.stringify(json);
        }


        // @remember: on download we have to convert it back to json
    }
}

export const create_one = async function (mid: string, data: OBJ_WITH_ID): DEFAULT_RES_SINGLE_P<any> {
    const errors: {code: string, message: string}[] = [];

    if(EN_BROKEN_G_FN_LOGS.CREATE_ONE){
        console.log("CREATE ONE DATA INSIDE BRO_CREATE_ONE : ", data, mid);
    }

    if (!data){
        errors.push({code: "INTERNAL", message: "NO DATA FOUND"});
        AS.GSTORE.set_error(mid, errors);
        return {success: false, errors: []};
    }


    // const data = JSON.parse(JSON.stringify(state)); // clone
    // @warn: If we clone this then file object will get converted to {} when stringified, we will loose all file info
    // const data = state; // // don't clone here first prepare data and clone just before sending to server
  

    const uat = get_user_token_api();
    if (!uat.success) {
        return {success: false, errors: uat.errors};
    }


    const {user, api, token} = uat.data;

    const authr = authz.create(mid, data, user);
    if(!authr.success) {
        return {success: false, errors: ["NO_PERMISSION", String(authr.errors)]};
    }



    

    await prepare_data_for_create(mid, data);

    

    // const d = JSON.parse(JSON.stringify(data));
    // delete d._meta;     // where have we used _meta?
    // delete d.__meta;    // remove all __meta properties
    // data = produce(data, (draft) => {
    //     delete draft._meta;     // // where have we used _meta?
    //     delete draft.__meta;    // remove all __meta properties
    // });

    const app_id = GC.APP_ID;
    const branch  = GC.BRANCH;
    const r = await api.entity.create_one({app_id, model_id: mid, branch, token, entity: {entity: {data}}});

    return r;
}

export const validate= function (INFO:T_INFO, mid:string) {
    const did = generate_draft_id(INFO.cid, INFO.cidx);
    const draft = AS.GSTORE.get_draft(mid, did);
    if(!draft) return {success: false, errors: [{code: "INTERNAL", message: "Draft not found"}]};
    
    //checking for is image and file upload done or not:
    const meta = draft.__meta || {props:{}};
    const props_obj = meta.props || {};

    for(let p of Object.keys(props_obj)){
        const prop_val = props_obj[p]; //this can be object(!is-many) or array(is-many)
        if(!prop_val) continue;
        if(Array.isArray(prop_val)){
            for(let v of prop_val){
                if(v.progress === "uploading"){
                    return {success: false, errors: [{code: "INTERNAL", message: "File upload not done for: " + p}]};
                }
            }
        } else {
            if(prop_val.progress === "uploading"){
                return {success: false, errors: [{code: "INTERNAL", message: "File upload not done for: " + p}]};
            }
        }

    }

   return {success: true, errors: []};
}


export const bro_create_one = async function (e: any, M: any, INFO: T_INFO, props: any, idx?: number): Promise<DEFAULT_RES_SINGLE<OBJ_WITH_ID>> {

    const mid = INFO.mid;
    const cid = INFO.cid;

    const errors: {code: string, message: string}[] = [];

    if(EN_BROKEN_G_FN_LOGS.CREATE_ONE){
        console.log("BRO CREATE ONE : INIT:", M); 
    }


    // GET DRAFT

    const did = generate_draft_id(cid, INFO.cidx);
    
    const CS = UTILS.GET_STATE(INFO, "COMP");

    //validating the draft to proceed with the creation
    const is_vlaid = validate(INFO, mid);
    if(!is_vlaid.success){
        toast.error("VALIDATION FAILED"+ is_vlaid.errors[0].message);
        CS.setStatus("validate-failed");
        errors.push(...is_vlaid.errors);
        return {success: false, errors: errors.map(e => e.message)};
    }

    toast.loading("CREATING...");
    CS.setStatus("creating");

    const r = await AS.GSTORE.create_one(mid, did); // find data using did
    toast.dismiss();

    if (!r || !r.success) {
        CS.setStatus("create-failed");
        toast.error("CREATION UNSUCCESSFULL");
    }
    else {
        CS.setStatus("created");
        toast.success("CREATED");
    }

    // on success
    if (r.data && props.on_created && typeof(props.on_created) === 'function') {
        props.on_created(e, r.data, INFO, props);
    }


    // after creation is successfull, clear cache for this model
    // So that all the get many components will query again and get the latest data
    if(r.success){
        AS.GSTORE.remove_cached_list(mid);
    }

    return r;
}

export const create_many = async function (model_id: string, data: OBJ_WITH_ID[]): DEFAULT_RES_ARR_P<OBJ_WITH_ID> {
    // id may not exits in the data. Because it might get generated in the server

    if (!model_id || !data || !Array.isArray(data) || !data.length){
        return {success: false, errors: ['NO_DATA']};
    }



    data.forEach((d) => {
        // remove the _meta property. It is only useful for preview we don't have to store it in db
        delete d._meta;     // @deprecated

        // remove all props starting with __
        for(let k in d){
            if(k.startsWith("__")) delete d[k];
        }
    });


    const uat = get_user_token_api(true); // alert = true;
    if(!uat.success){
        return {success: false, errors: uat.errors};
    }

    const {user, api, token} = uat.data;

    const permission = authz.create(model_id, data, user);
    if(!permission.success) return {success: false, errors: permission.errors};


    // prepare data
    for(let d of data){
        await prepare_data_for_create(model_id, d);
    }

    const app_id = GC.APP_ID;
    // @todo: remove dependency on api and datascript 
    const branch  = GC.BRANCH;
    const r = await api.entity.create_many({app_id, model_id,branch, token, entities: {entity: {data: data, model_id: model_id}}});
        
    if (!r || !r.success) {
        feedback(`Creation unsuccessful`, "error");
        console.warn(
            `Failed to create many entity with ids :  ${data.map(d=>d.id).join(", ")}`,
            r.errors,
            app_id,
            model_id,
            data
        );
        return {success: false, errors: r.errors};
    }


    feedback(`Created Successfully`, "success");

    // after creation is successfull, clear cache for this model
    // So that all the get many components will query again and get the latest data
    if(r.success){
        AS.GSTORE.remove_cached_list(model_id);
    }

    const results = r.data;
    if(!results || !Array.isArray(results)) return { success: true, data: [] };

    const withids = results.filter(d=>d.id);
    
    return { success: true, data: withids};

}