import { produce } from "structurajs";
import { T_INFO } from "../broken-types/comp";
import { generate_draft_id } from "../utils/draft";
import AS from "./AS";
import { get_attr_from_event } from "./events";
import { get_ulid, sort_objs } from "./utils";
import { generateNKeysBetween,  generateKeyBetween } from 'fractional-indexing';
import { GC } from "../global_state";

export const bro_add_rel_item = function(rel_prop, set_M, cm, idx){

    const name = rel_prop;
    set_M((M) => {
        let _meta = M._meta;
        if (!_meta) {
            _meta = {};
            M._meta = _meta;
        }
        const K = 'keys_' + name;
        if (!_meta[K]) _meta[K] = [];
        const keys = _meta[K];
        // keys are for react to organise the list
        let p = M[name];
        if (!p) {
            M[name] = [];
        }
        p = M[name];
        if (!Array.isArray(p)) return M;

        let v = cm.id;

        let l = p.length;
        if(l === 0){
            p.push(v);
            keys.push(get_ulid());
        }
        else if(p[l-1] === undefined){
            p[l-1] = v;
        }
        else{
            p.push(v);
            keys.push(get_ulid())
        }

        // if(p.length > idx)p[idx] = v;
        // else{
        //     p.push(v);
        // }

        // if(keys.length > idx){
        //     keys.push(g_fn.get_ulid());
        // }
        // else{
        //     keys.push(g_fn.get_ulid());
        // }

        return { ...M, [name]: [...p] };
    })
}

const get_default_value = function (mid: string, prop_name: string){
    let value:any = undefined;


    const AJ = GC.APP_JSON;
    if (!AJ) return value;

    const model = AJ.models.find((m) => m.id === mid);
    if (!model) return value;


    const prop = model.props.find((p) => p.name === prop_name);
    if (!prop) return value;



    // @todo: have a section for default values for each prop
    if(prop.type === "any-one-of"){
        // 
    }


    // boolean
    if(prop.type === "boolean"){
        // value = prop.default || false; // @todo: default value for boolean
        value = false;
    }


    return value;
}

export const bro_add_prop_item = function (e:any, M:any, INFO: T_INFO, props: any, idx?:number) {
    const name = get_attr_from_event(e, ['prop-name', 'name']);
    if (!name) return;
    const b_type = get_attr_from_event(e, ['prop-type', 'type']);
    if (!b_type) return;
    const is_rel = get_attr_from_event(e, ["is-rel"]);

    
    const did = generate_draft_id(INFO.cid, INFO.cidx);
    const D = AS.GSTORE.get_draft(INFO.mid, did);
    if(!D || !D.id) return console.warn("D || D.id not found", D);


    const ND = produce(D, (draft)=>{
        let values = draft[name];  
        if(!values){
            values = [];
            draft[name] = values;
        }

        if(!Array.isArray(values)) return console.warn("PROPS is not an Array", draft, "prop-name: ", name);

        
        if(is_rel === "true"){
            const id = get_ulid() || Math.random().toString(36).substring(0, 8);
            values.push({id:id});
            return;
        }


        const newvalue = get_default_value(INFO.mid, name);


        // not a rel
        sort_objs(values, "id", 1);

        if(values.length > 0){
            const last_item = values[values.length - 1];
            const id = generateKeyBetween(last_item.id, null);
            values.push({id:id, v: newvalue});
        }
        else{
            const id = generateKeyBetween(null, null);
            values.push({id:id, v:newvalue});
        }

        let meta = draft.__meta || {};
        const props = meta.props;

        if(!props) {
            if(b_type === 'image' || b_type === 'file') {
                meta.props = {[name]: [{progress:''}]};
            } else {
                meta.props = {};
            }
        } else {
            const P = props[name];
            if(b_type === 'image' || b_type === 'file'){
    
                if(!P) meta.props[name] = [{progress:''}];
                else if(!Array.isArray(meta.props[name])) meta.props[name] = [{progress:''}];
                else meta.props[name] = [...meta.props[name], {progress:''}];
    
            }
        }


        draft.__meta = meta;


    });

    AS.GSTORE.set_draft(INFO.mid, did, ND);
    

    // @deprecated
    // set_M((M) => {
        
    //     // keys are for react to organise the list
    //     let p = M[name];
    //     if (!p) {
    //         M[name] = [];
    //     }
    //     p = M[name];
    //     if (!Array.isArray(p)) return M
    //     if(is_rel === "true"){
    //         const id = get_ulid() || Math.random().toString(36).substring(0, 8);
    //         p.push({id:id});
    //         return { ...M, [name]: [...p] };
    //     }


        
    //     let v:boolean|undefined = undefined;
    //     if (b_type === 'boolean') v = false;
    
    //     p.sort((a, b) => {
    //         if(a.id > b.id){
    //             return 1
    //         }
    //         else if (a.id < b.id){
    //             return -1
    //         }
    //         else{
    //             return 0
    //         }
    //     });

    //     let id = generateKeyBetween(null, null); // a0
    //     if(p.length > 0){
    //         const last_item = p[p.length - 1];
    //         id = generateKeyBetween(last_item.id, null);
    //     }

    //     p.push({id: id, v});
      
    //     return { ...M, [name]: [...p] };
    // });
}


export const bro_delete_prop_item = function (e:any, M:any, INFO: T_INFO, props: any, idx:number){
    // idx here is prop.map((p, idx)) => this can be used to remove the right item from the array

    const name = get_attr_from_event(e, ['prop-name', 'name']);
    if (!name) return;


    // because idx here is inside the prop.map((p, idx)). It's not for the draft object for this component. This has to be from INFO.cidx
    const did = generate_draft_id(INFO.cid, INFO.cidx);
    const D = AS.GSTORE.get_draft(INFO.mid, did);
    if(!D || !D.id) return console.warn("D || D.id not found", D);

    const ND = produce(D, (draft)=>{
        const values = draft[name];
        if(!values){
            draft[name] = [];
        }

        if(!Array.isArray(values)) return console.warn("PROPS is not an Array", draft, "prop-name: ", name);

        
        if(values.length < idx){
            return console.warn("idx is out of range", draft, "prop-name", name, "idx", idx, "values.length", values.length);
        }

        // draft[name] = values.filter((v, i)=>i !== idx);
        values.splice(idx, 1);

        //removing meta data for that prop idx
        const meta = draft.__meta || {};
        const props = meta.props || {};
        const P = props[name] || [];
        if(!P) return console.warn("P is empty", draft, "prop-name", name);
        if(!Array.isArray(P)) return console.warn("P is not an array", draft, "prop-name", name);
        P.splice(idx, 1);
        draft.__meta = {...meta, props: {...props, [name]: [...P]}};
    });

    AS.GSTORE.set_draft(INFO.mid, did, ND);





    // const idx_s = get_attr_from_event(e, ['b-idx', 'idx']);
    // if (!idx_s) return;
    // const idx1 = parseInt(idx_s);
    // if (isNaN(idx)) return;
    // set_M((M) => {
    //     let p = M[name];
    //     if (!p) return M;
    //     if (!Array.isArray(p)) return M;
    //     console.log("idx : ", idx);
    //     p.splice(idx, 1);
    //     return { ...M, [name]: [...p] };
    // });
}

// delete one prop. It's not prop-is-many
export const bro_delete_prop = function(e:any, M:any, INFO: T_INFO, props: any, idx?:number){
    const name = get_attr_from_event(e, ['prop-name', 'name']);
    if (!name) return;

    const did = generate_draft_id(INFO.cid, INFO.cidx);
    const D = AS.GSTORE.get_draft(INFO.mid, did);
    if(!D || !D.id) return console.warn("D || D.id not found", D);

    const ND = produce(D, (draft)=>{
        delete draft[name];
    });
    AS.GSTORE.set_draft(INFO.mid, did, ND);


    // set_M((M) => {
    //     if(!M) return M;
    //     let p = M[name];
    //     console.log("p : ", p);
    //     if(p === undefined) return M;
    //     delete M[name];
    //     return {...M};
    // })
}

export const on_input_relation = function (e, value, set_M, prop_name, idx) {
    console.log("ON INPUT RELATION : ", e, value, set_M, prop_name);
    set_M(M=>{
        console.log("ON INPUT RELATION : ", JSON.stringify(M));
        // is_one
        if(idx === undefined){
            M[prop_name] = value || {}; // {id: ulid, ...}
            return {...M};
        }
        // is_many
        else{
            // array
            if(!isNaN(idx)){
                const P = M[prop_name];
                if(!Array.isArray(P) || P.length < idx+1) return M;

                M[prop_name][idx] = value || {}; // {id: ulid, ...}
                // seller: {id: ulid}
                // seller: id
                return {...M, [prop_name]: [...P]};
            }
            else console.warn("INVALID IDX for relation: ", e, value, set_M, prop_name, idx);
        }
        return M
    })
}

export const on_is_json_change = function (M, props) {
    console.log("MY INFO => ", props.INFO);
    const parent_set_M = props.INFO.set_M;
    if(!parent_set_M) return console.warn("@BROKEN INTERNAL ERROR: CAN'T FIND set_M IN PARENT");
    if(typeof(parent_set_M) !== "function") return console.warn("@BROKEN INTERNAL ERROR: set_M IS NOT A FUNCTION");

    const prop_name = props.prop_name;
    if(!prop_name) return console.warn("@BROKEN INTERNAL ERROR: CAN'T FIND PROP_NAME IN PROPS");

    const idx = props.IDX;


    console.log("M : ", M);

    if(isNaN(idx)){
        parent_set_M(PM=>{
            if(!M) PM[prop_name] = {};
            if(M && M.id) PM[prop_name] = M || {};
            if(M && !M.id) PM[prop_name] = {...M, id : get_ulid()};
            return {...PM};
        });
    }
    else{

        parent_set_M(PM=>{
            console.log("PM : ", PM, "M is: ", M);
            console.log("propname : ", prop_name);
            const P = PM[prop_name];
            console.log("P : ", P);
            if(!Array.isArray(P) || P.length < idx) return PM;
            if(!P[idx].id){
                console.warn("id not found for item with index : ", idx);
                return PM;
            }
            if(!M) P[idx].v = {};
            if(M && M.id) P[idx].v = M || {};
            if(M && !M.id) P[idx].v = {...M, id : get_ulid()}
            return {...PM, [prop_name]: [...P]};

        });
    }
}