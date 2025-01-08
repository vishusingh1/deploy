// DATA STRUCTURE UTILS

import { OBJ_WITH_ID } from "../broken-types/g_type";
import { get_ulid } from "./utils";

// utils
export const array_or_null = function (value: any, sub_props?: string[]) {
    // array_or_null(A, [b,c,d]) => we will check if A.b.c.d is array or not
    if (!value) return null;
    if (!Array.isArray(value)) return null;

    if(sub_props && Array.isArray(sub_props)){
        let error:any = null;
        const recurse = (v, i)=>{
            if(i >= sub_props.length) return;
            const prop = sub_props[i];
            if(!v) {error = "error:at"+prop; return;}
            if(!prop) return;
            if(!v[prop]) {error = "error:at"+prop; return;}
            if(!Array.isArray(v[prop])) {error = "error:at"+prop; return;}

            recurse(v[prop], i+1);
        }
        recurse(value, 0);
        if(error){
            console.warn("array_or_null: ", value, sub_props, error);
            return null;
        }
    }

    return value;
}


export const safe_array = function (value, sub_props) {
    // array_or_null(A, [b,c,d]) => we will check if A.b.c.d is array or not
    if (!value) return [];
    if (!Array.isArray(value)) return [];

    if(!sub_props) return value;
    if(!Array.isArray(sub_props)) return value;
    if(!sub_props.length) return value;



    if(sub_props && Array.isArray(sub_props)){
        let error:any = null;
        let final_value: any[] = [];
        const recurse = (v, i)=>{
            if(i >= sub_props.length) return;
            const prop = sub_props[i];
            if(!v) {error = "error:at"+prop; return;}
            if(!prop) return;
            if(!v[prop]) {error = "error:at"+prop; return;}
            if(!Array.isArray(v[prop])) {error = "error:at"+prop; return;}

            final_value = v[prop];
            recurse(v[prop], i+1);
        }
        recurse(value, 0);
        if(error){
            console.warn("array_or_null: ", value, sub_props, error);
            return [];
        }

        return final_value;
    }

    return value;
}


export const non_empty_array_or_null = function (value) {
    if (!value) return null;
    if (!Array.isArray(value)) return null;
    if (!value.length) return null;
    return value;
}

export const get_key_from_meta = function (M:OBJ_WITH_ID, prop_name: string, idx: number) {
    const error = "error:meta-key"
    if (!M)                             return error;
    if(!M[prop_name])                   return error;
    if(!Array.isArray(M[prop_name]))    return error;
    if(idx >= M[prop_name].length)      return error;
    if(!M[prop_name][idx])              return error; // for relation we might just have undefined
    if(!M[prop_name][idx].id)           return error;

    return M[prop_name][idx].id;
}


export const get_safe_condition = function(){}

export const add_meta_to_data = function(M: OBJ_WITH_ID){
    const add_meta = (m) =>{
        if(!m || typeof(m) !== "object") return;

        const _meta = m._meta || {};
        for(let [k, v] of Object.entries(m)){
            if(Array.isArray(v)){
                const K = "keys_" + k;
                _meta[K] = [];
                for(let item of v){
                    const RID = get_ulid() || Math.random().toString(36).substring(0, 8);
                    _meta[K].push(RID);
                }
            }
            else if(typeof(v) === "object"){
                add_meta(v);
            }
        }
        m._meta = _meta;
    }

    if(Array.isArray(M)){
        for(let m of M){
            add_meta(m);
        }
    }
    else{
        add_meta(M);
    }
}

export const add_meta_key_to_state = function (M, prop_name) {
    const prop = M[prop_name];
    if(!prop) return;
    if(!Array.isArray(prop)) return;

    const _meta = M._meta || {};
    const K = 'keys_' + prop_name;
    const keys = _meta[K] || [];

    if(keys.length === prop.length) return; // already added

    for(let i=keys.length; i<prop.length; i++){
        keys.push(get_ulid());
    }

    M._meta = {..._meta, [K]: keys};
}
