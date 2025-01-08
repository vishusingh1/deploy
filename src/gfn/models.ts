
import { OBJ_WITH_ID } from "@/broken-types/g_type";
import {GC} from "../global_state";
import { json5_parse } from "./utils";


export const get_model = function (mid : string) {
    const AJ = GC.APP_JSON;
    if (!AJ || !AJ.models) return null;

    const model = AJ.models.find((m) => m.id === mid) || AJ.models.find((m) => m.name === mid);
    if (!model) return;

    return model;
}
export const get_model_by_name = function (name : string) {
    const AJ = GC.APP_JSON;
    if (!AJ) return null;

    const model = AJ.models.find((m) => m.name.toLowerCase() === name.toLowerCase());
    if (!model) return null;

    return model;
}

export const get_prop = (mid: string, prop_name: string) => {
    const model = get_model(mid);
    if(!model) return null;

    const prop = model.props.find(p => p.name === prop_name);
    if(!prop) return null;

    return prop;
}

export const get_prop_options = (mid: string, prop_name: string) => {
    const prop = get_prop(mid, prop_name);
    if(!prop || !prop.options) return [];

    if(!Array.isArray(prop.options)) return []; // @todo: why is this required

    // ["{id:1, name:'A'}", "{id:2, name:'B'}", "{id:3, name:'C'}"] => string[]
    // or 
    // ['A', 'B', 'C']

    // array or string => array of objects
    const options = prop.options.map((o, idx)=>{
        // {id: 1, name: 'A'}
        // or
        // 'A'

        const isobj = o.trim().startsWith('{');
        if(isobj){
            const v = json5_parse(o);
            if(v) return v;
            return {id: idx+1, name: idx+1};
        }

        // not obj
        if(o){
            return {id: o, name: o};
        }

        // not defined
        return {id: idx+1, name: idx+1};
    });

    return options;
}

export const get_prop_option = (mid: string, prop_name: string, id: string) => {
    const options = get_prop_options(mid, prop_name);
    // const opt = options.find(o=>o.id === id);
    // id might be converted to string. UNTIL this is fixed everywhere just use string
    const opt = options.find(o=>String(o.id) === String(id));
    
    if(!opt) return {id: "", name: "OPTION NOT FOUND"};
    return opt;
}



const MODELFN = {
    get_prop,
    get_prop_options,
    get_prop_option,
    options: get_prop_options,  // short form 
    option: get_prop_option,    // short form
    get_model,
    get_model_by_name
}
export default MODELFN;
