import { get_attr_from_event } from "./events";


import AS from './AS';
import { produce, unfreeze } from "structurajs";
// import { T_QUERY_PARAMS, T_QUERY_PARAMS_FINAL, T_QUERY_PARAMS_LEVEL_1, T_QUERY_PARAMS_LEVEL_2 } from "../types/query";
import { get_random_string, json5_parse } from "./utils";
import { T_INFO } from "../broken-types/comp";
import { T_FILTERS, T_FILTER_ATOM, z_filter_atom, z_filters } from "../broken-types/fe-query/filter";
import { T_QUERY_PARAMS, T_QUERY_PARAMS_FINAL, T_QUERY_PARAMS_LEVEL_2, T_SORT, T_SORTS, z_query_params_sort } from "../broken-types/fe-query/query";
import { OBJECT_TYPE } from "@/broken-types/g_type";
import stdlib from "@/stdlib";
import { generate_query_id } from "@/utils/draft";
import { t_filters_v2, t_query } from "@/broken-types/broken-data-api/query";
import { GET, GET_ARRAY } from "./jsx-fns";
import { get_model_by_name } from "./models";
import { findDifferences } from "@/utils/obj";



// if filter_obj is passed, generate a filter id based on the filter object
// this is because filter obj : {name: "john"} should not generate random filter id everytime it is passed 
const gen_filter_id = (prefix: string, filter_obj?: OBJECT_TYPE) => {
    if(!filter_obj)return prefix + "-" + stdlib.utils.nanoid();
    else{
        for(let key in filter_obj){
            let v = filter_obj[key];
            if(!(typeof(v) === "string" || typeof(v) === "number")){
                if(v ===  undefined || v == null) v = "";
                v = JSON.stringify(v);
            };
            prefix += "-" + key + "-" + v;
        }
        return prefix;
    }
};


// always returns the group 
// if tree_id belongs to a filter atom, returns the group(parent of it)
// always return the parent group
const find_subtree = (tree: T_FILTERS, tree_id: string ): T_FILTERS|null => {
    
    if(tree.id === tree_id) return tree;
    const t_filters = tree.filters;

    for(let f in t_filters){

        const f_filters = t_filters[f];

        if(f_filters.type === "group"){

            if(f_filters.id === tree_id) return  tree;
            const found = find_subtree(f_filters, tree_id);
            if(found) return found;
        }
        // f_filters is a filter atom
        if(f_filters.id === tree_id) return  tree;
       
        
    }

    return null;

}

//add filters from subtree to the exist tree
const add_filters = (exist: T_FILTERS, subtree: T_FILTERS|T_FILTER_ATOM  ) => {
   
    const exist_filters     =   exist.filters;
    const new_filters       =   subtree.type === "group" ? subtree.filters : {[subtree.id]: subtree};
    //loop thorugh new filters and add them to the exist filters
    for(let f in new_filters){

        const f_filters = exist_filters[f];
        //adding the new filter to the exist filter
        if(!f_filters){

            exist_filters[f] = new_filters[f];
            continue;
        }

        // what if the new filter already exists?, should we replace it/transform it?
               
    }
}

// find subtree and add filters from subtree in the filters tree or add a new tree
const add_subtree = (tree: T_FILTERS, subtree: T_FILTERS|T_FILTER_ATOM) => {

    const exist = find_subtree(tree, subtree.id);
    if(!exist){
        // if the subtree is not found, add it to the root
        tree.filters[subtree.id] = subtree;
        return;
    }

    if(exist.is_static){
        console.warn("Cannot add to static filters ");
        return;
    }
    else{
        // replace the filter
        exist.filters[subtree.id] = subtree;
        return
    }
    
}


// replace filters from subtree to the exist tree
const replace_filters = (exist: T_FILTERS, subtree: T_FILTERS | T_FILTER_ATOM) => {

    const exist_filters     =   exist.filters;
    const new_filters       =   subtree.type === "group" ? subtree.filters : {[subtree.id]: subtree};
    //loop thorugh new filters and add them to the exist filters
    for(let f in new_filters){

        const f_filters = exist_filters[f];

        //adding the new filter to the exist filter
        if(!f_filters){
            
            exist_filters[f] = new_filters[f];
            continue;
        }
        if(f_filters.is_static){
            console.warn("Cannot replace static filters");
            continue;
        }
        // replacing the filter
        exist_filters[f] = new_filters[f];

        // what if the new filter already exists?, should we replace it/transform it?
               
    }
}

// find subtree and replace filters from subtree in the filters tree or add it to the tree
const replace_subtree = (tree: T_FILTERS, subtree: T_FILTERS | T_FILTER_ATOM) => {
    
    const exist = find_subtree(tree, subtree.id);
    if(exist?.is_static){
        console.warn("STATIC FILTERS CANNOT BE REPLACED");
        return;
    }

    if(!exist){
        // add subtree to the root;
        tree.filters[subtree.id] = subtree;
        return;
    }

    // go throught the filter atoms of the group and add them to the exist filter
    replace_filters(exist, subtree);
 
}

// find subtree and remove filters from subtree in the filters tree
const remove_from_subtree = (tree: T_FILTERS, subtree: T_FILTERS | T_FILTER_ATOM) => {

    const exist = find_subtree(tree, subtree.id);
    if(!exist){
        return;
    }
    const exist_filters     =   exist.filters;
    const new_filters       =   subtree.type === "group" ? subtree.filters : {[subtree.id]: subtree};

    for(let f in new_filters){
        if(exist_filters[f].is_static){
            console.warn("STATIC FILTERS CANNOT BE REMOVED");
            continue;
        }
        delete exist_filters[f];
    }

    // replace_filters(exist, subtree);
}

// find subtree and clear filters from subtree in the filters tree
const clear_from_subtree = (tree: T_FILTERS, subtree: T_FILTERS | T_FILTER_ATOM) => {

    const exist = find_subtree(tree, subtree.id);
    if(!exist) return;

    // remove only if is static is false 
    if(subtree.type === "group"){

        for(let f in exist.filters){
            if(!exist.filters[f].is_static){
                delete exist.filters[f];
            }
        }

    }
    else{
        console.warn("TO CLEAR FILTERS, SEND GROUP ID. TO REMOVE FILTER USE REMOVE OP")
    }

    return;

}

// find subtree and toggle filters from subtree in the filters tree
const toggle_subtree = (tree: T_FILTERS, subtree: T_FILTERS| T_FILTER_ATOM) => {
    const exist = find_subtree(tree, subtree.id);

    if(!exist){

   

        // add subtree to the root;
        tree.filters[subtree.id] = subtree;
        return;
    }
    
    const exist_filters = exist.filters;
    const new_filters = subtree.type === "group" ? subtree.filters : {[subtree.id]: subtree};

    for(let f in new_filters){
        const f_filters = exist_filters[f];
        if(!f_filters){
            // filter doesnot exist, add it
            exist_filters[f] = new_filters[f];
            continue;
        }
        // filter exists, remove it
        delete exist_filters[f];
        
    }

} 

// deep clone toggle or replace
// checks if the filter with id present, if not adds it, else checks deeply if each property is different and if so replaces it, else just removes it
const deep_toggle_replace = (tree: T_FILTERS, subtree: T_FILTERS| T_FILTER_ATOM) => {
    const exist = find_subtree(tree, subtree.id);

    if(!exist){
        // add subtree to the root;
        tree.filters[subtree.id] = subtree;
        return;
    }
    const exist_filters = exist.filters;
    const new_filters = subtree.type === "group" ? subtree.filters : {[subtree.id]: subtree};

    for(let f in new_filters){
        const f_filters = exist_filters[f];
        if(!f_filters){
            // filter doesnot exist, add it
            exist_filters[f] = new_filters[f];
            continue;
        }
        // deeply check if every parameter is same or not, if same then remove it, else replace it
        const com = findDifferences(f_filters, new_filters[f]);
        if(Object.keys(com).length) {
            exist_filters[f] = new_filters[f];
            continue;
        };
        delete exist_filters[f];
        
    }


}


export const apply_filter_action = (old_filters: T_FILTERS, new_filters: T_FILTERS|T_FILTER_ATOM, op: string) => {


    // old filters would be modified
    if(op === "add"){
        add_subtree(old_filters, new_filters);
    }
    else if(op === "toggle"){
        toggle_subtree(old_filters, new_filters);
    }
    else if(op === "replace"){
        replace_subtree(old_filters, new_filters);
    }
    else if(op === "toggle-replace"){
        deep_toggle_replace(old_filters, new_filters);
    }
    else if(op==="remove"){
        // removes the filters from the old filters
        remove_from_subtree(old_filters, new_filters);
    }
    else if(op === "clear"){
        // clears the filters present in the old filters with the new filters id
        clear_from_subtree(old_filters, new_filters);
    }
    else{

    }

    return old_filters;
}

// converts simple object filter to group filters
// obj could be like {name: "john", age: 30}
// or if obj is already a filter, returns it

const obj_to_filter = (obj: OBJECT_TYPE): T_FILTERS | T_FILTER_ATOM | null => {


    // if obj is already a filter, return it
    const sp            =   z_filters.safeParse(obj);
    if(sp.success) return sp.data;

    // check if object is a filter atom
    const sp_atom       =   z_filter_atom.safeParse(obj);
    if(sp_atom.success) return sp_atom.data;

    // obj could of the form {name: "john", age: 30}
    
    const keys = Object.keys(obj);
    if(!keys.length) return null;

    if(keys.length === 1){
        const key = keys[0];
        const val = obj[key];
        return {
            id: gen_filter_id("fa", obj),
            type: "atom",
            attr: key,
            op: "eq",
            val: val
        }
    }
    // no of keys are more than 1, create a group filter with and 

    const and_g: T_FILTERS = {
        id          :   gen_filter_id("fg", obj),
        type        :   "group",
        group_by    :   "and",
        filters     :   {}
    }

    for(let key of keys){
        const val = obj[key];
        const id  = gen_filter_id("fa", {[key] : val});
        const atom: T_FILTER_ATOM = {
            id ,
            type    : "atom",
            attr    : key,
            op      : "eq",
            val     : val
        }
        and_g.filters[id] = atom;
    }
   

    return and_g;

}


// convert filter atom to filter group

const atom_to_filter = (atom: T_FILTER_ATOM): T_FILTERS => {
    const and_g: T_FILTERS = {
        id          :   gen_filter_id("fg"),
        type        :   "group",
        group_by    :   "and",
        filters     :   {}
    }
    and_g.filters[atom.id] = atom;
    return and_g;
}


const get_filters_from_event = (e: any) => {

    // filters_from_event_target
    const f =  e?.target?.value;

    if(f){
        const r         =   json5_parse(f);
        if(r){
            const filters   =    obj_to_filter(r);
            if(filters) return filters;
        }
    }


    const fils       =   get_attr_from_event(e, ['data-filters']);
    if(!fils) return console.warn("filters not found : ", e);

    const r         =   json5_parse(fils);
    if(!r) return console.warn("Unable to JSON parse filters: ", fils);

    const filters   =    obj_to_filter(r);
    if(!filters) return console.warn("Invalid filter object found : ", r);

    return filters;
}

//@bro:var:M.name or @bro:var:props.a.b.c or @bro:var:SM.vjnou
const resolve_filter_values = (filters: T_FILTERS, INFO: any,  M: any, props: any) => {
    // val : @bro:var:M.name or @bro:var:props.a.b.c

    // loop through the filters and resolve the values


    for(let f in filters.filters){
        const filter = filters.filters[f];
        if(filter.type === "group"){
            resolve_filter_values(filter, INFO, M, props);
            continue;
        }
        let val = filter.val;
        if(!val) continue;
        if(typeof(val) !== "string") continue;
        // check if it is a var
        // @bro:var:M.name
        if(val.startsWith("@bro:var:")){
            // replace it with actual values from M
            val = val.replace("@bro:var:", "");
            const vs = val.split(".");

            const source = vs[0];
            const nested_props = vs.slice(1);

            if(source=== "M"){
                const v =  GET(M, nested_props);
                filter.val = v;

            }
            else if (source === "props"){
                const v =  GET(props, nested_props);
                filter.val = v;
            }
            else if(source === "INFO"){
                const v =  GET(INFO, nested_props);  
                filter.val = v;
            }
            else if(source === "AS"){
                // eg :  @bro:var:AS:USER.profile.id
                const v     =  GET(AS, nested_props);
                filter.val = v;
            }
            else if(source === "SM"){
                //"@bro:var:SM.vjnou" => get the first selected value from model id vjnou
                // "@bro:var:SM.user" => get the first selected value from model id vjnou
                // m could be mid or mname
                const m = nested_props[0];
                if(!m){
                    console.warn("Invalid @bro:var:SM: ", val);
                    continue;
                }
                // check if m is mname 
                let model_id = m;
                const M = get_model_by_name(m);
                if(M){
                    model_id = M.id;
                }

                if(!AS.GSTORE.selected_entity[model_id]){
                    console.warn("No selected entity found for model_id: ", model_id);
                    continue;
                }
                const v     =  GET_ARRAY(AS.GSTORE.selected_entity[model_id]);
                if(Array.isArray(v) && v.length){
                    filter.val = v[0];
                }
                continue;
            }
            else{
                console.warn("Invalid @bro:var: ", val);
                continue;
            }
        }
       
    }

}

//@bro:fn:time:now or @bro:fn:time:today or @bro:fn:time:since:10
const resolve_filter_fns = (filters: T_FILTERS) => {
    // val: @bro:fn:time:now or @bro:fn:time:today or @bro:fn:time:since:${no of hours}

    // val: @bro:fn:SM:${model_name}:${prop_name}

    // @todo: keep these functions in a different place and extend them to new modules as well
    const time : {[key: string]: Function} = {
        now     : ()=>  Date.now(),
        today   :  ()=>{
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            return today.getTime();
        },
        today_end : ()=>{
            const today = new Date();
            today.setHours(23, 59, 59, 999);
            return today.getTime();
        },
        month : () => {
            const today = new Date();
            today.setDate(1);
            today.setHours(0, 0, 0, 0);
            return today.getTime();
        },
        
        // @bro:fn:time:since:${seconds}
        since   :   (seconds: number)=>{
            const now = Date.now();
            const since = now - seconds*  1000;
            return since;
        }
    }

    for(const f in filters.filters){
        const filter = filters.filters[f];
        if(filter.type === "group"){
            resolve_filter_fns(filter);
            continue;
        }


        let val = filter.val;
        if(typeof(val) !== "string") continue;
        if(!val.startsWith("@bro:fn:")) continue;

        val  = val.replace("@bro:fn:", "");
        const vs = val.split(":");
        const module = vs[0];
        const fn_name = vs[1];
        if(!module || !fn_name) continue;

        const args = vs.slice(2);

        if(module === "time"){
            const fn = time[fn_name];
            if(!fn) continue;
            const res = fn(...args);
            val =  res;
            filter.val = res;
            continue;
        }


    }

}


// update comp filters in store
export const update_query_filters = async(params: {INFO: T_INFO,  filters: T_FILTERS|T_FILTER_ATOM, op: string, idx?: number, props?: any, M?: any}) => {
    
    const {INFO, filters, op, idx, props, M} = params;

    const mid   =   INFO.mid;
    const cid   =   INFO.cid;
    let qid     =   INFO.query?.qid;
    if(!qid) qid = generate_query_id(cid, idx);

    const query = AS.GSTORE.get_query(mid, qid) || {type: "QP_LEVEL2", qid, limit: 16};
    
    const clone_q = JSON.parse(JSON.stringify(query));
    // add dummy filters if not exists
    if(!clone_q.filters){
        const def_and_filter : T_FILTERS = {
            type: "group",
            id : gen_filter_id("fg"),
            group_by: "and",
            filters: {}
        }
        clone_q.filters = def_and_filter;
    }

    if(clone_q.type !== "QP_LEVEL2") return console.warn("QUERY TYPE IS NOT QP_LEVEL2");

    const nf = apply_filter_action(clone_q.filters, filters, op);

    resolve_filter_fns(nf);
    resolve_filter_values(nf, INFO, M || {}, props || {});
    
    clone_q.filters = nf;
    AS.GSTORE.set_query(mid, qid, clone_q, ["APPLY FILTERS FROM UPDATE COMP QUERY"]);
    return;
}

export const bro_apply_filters = async function (e: any, M: any, INFO: T_INFO, props: any, idx?: number) {
    
    // filters  could be like  this as well  {'name' : 'john'}  => this case, just add it to the root filters
    const filters       =    get_filters_from_event(e);
    if(!filters) return console.warn("Filters/valid filters not found from event : ", e);
    const filter_action =   get_attr_from_event(e, ['op']) ;
    if(!filter_action) return console.warn("Filters action not found from event : ", e);

    const mid = INFO.mid;
    const cid = INFO.cid;

    let  qid = get_attr_from_event(e, ['qid']);
    
    if(!qid){
        // console.warn("qid not found in html : ", e);
        qid = generate_query_id(cid, idx);
    }

    const query = AS.GSTORE.get_query(mid, qid);

    if(!query) {
        // no query found in GSTORE
        // we will create a new query
        const new_filters = filters.type === "group" ? filters : atom_to_filter(filters);
        resolve_filter_values(new_filters, INFO, M, props);
        const q : T_QUERY_PARAMS_LEVEL_2 = {
            type: "QP_LEVEL2",
            qid,
            filters: new_filters ,
            sorts: [],
            limit: 16,
            offset: 0,
        }
        
        AS.GSTORE.set_query(mid, qid, q, ["APPLYING FILTERS FIRST TIME 1"]);
        return;
    }

    if(query.type !== "QP_LEVEL2") return console.warn("QUERY TYPE IS NOT QP_LEVEL2");

    //making a clone of query, currently query is referenced, changes made to it will change it in gstore 
    // and then we will not be able to check if query has changed or not
    const clone_q = JSON.parse(JSON.stringify(query));

    let old_f = clone_q.filters;

    if(!old_f){
        const new_filters = filters.type === "group" ? filters : atom_to_filter(filters);
        resolve_filter_values(new_filters, INFO, M, props);
        clone_q.filters = new_filters;
        AS.GSTORE.set_query(mid, qid, clone_q, ["APPLYING FILTERS FIRST TIME 2"]);
        return;
    }


    const nf = apply_filter_action(old_f, filters, filter_action);
    resolve_filter_values(nf, INFO, M, props);
    clone_q.filters = nf;
    AS.GSTORE.set_query(mid, qid, clone_q, ["APPLY FILTERS 2"]);
}


// update comp sorts 
// this function can be used to update sorts of a comp functionally
export const update_comp_sorts = (params:{INFO: T_INFO, sorts: T_SORTS, op: string}) => {
    
    const {INFO, sorts, op} = params;

    const mid   =   INFO.mid;
    const cid   =   INFO.cid;
    let qid     =   INFO.query?.qid; 
    if(!qid) qid = generate_query_id(cid, INFO.cidx);

    const query = AS.GSTORE.get_query(mid, qid) || {type: "QP_LEVEL2", qid, limit: 16};
    const clone_q = JSON.parse(JSON.stringify(query));
    if(!clone_q.sorts){
        clone_q.sorts = [];
    }
    if(clone_q.type !== "QP_LEVEL2") return console.warn("QUERY TYPE IS NOT QP_LEVEL2");

    const ns = apply_sort_action(clone_q.sorts, sorts, op);
    clone_q.sorts = ns;
    AS.GSTORE.set_query(mid, qid, clone_q, ["APPLY SORTS FROM UPDATE COMP QUERY"]);
    return;


}


export const bro_emit_filters =  function(e: any, M: any, INFO: T_INFO, props: any, idx?: number) {

    // priority INFO > e > M

    let mid = INFO.mid || get_attr_from_event(e, ['data-mid', 'mid', 'bro-mid']) || M.mid || '';
    if(!mid) {
        const mname = INFO.model_name || get_attr_from_event(e, [ 'data-mname', 'mname','bro-mname']) || '';
        if(mname) mid = get_model_by_name(mname)?.id;
        if(!mid) return console.warn("NO MODEL ID FOUND TO EMIT FILTERS");
    };


    const cid = INFO.cid;
    if(!mid || !cid) return console.warn("NO MODEL ID OR COMP ID FOUND");

    let fils = get_filters_from_event(e) || null;

    if(!fils){
        if(M.filters){
            fils = obj_to_filter(M.filters);
        }
        else{
            fils = obj_to_filter(M);
        }
        if(!fils) return console.warn("Filters/valid filters not found from event : ", e);
    }

    const op = get_attr_from_event(e, ['op', 'data-op']) || M.op ||  "toggle";

    return  AS.GSTORE.emit_filter({
        cid: cid,
        mid: mid,
        data: fils,
        source: [...(props?.source || []), ...(props?.target || []), "BRO EMIT FILTERS"],
        op: op,
        type: "FILTER_EVENT",
        idx
    });
}




const obj_to_sorts = (s: OBJECT_TYPE): T_SORTS | null=> {

    const s1 = z_query_params_sort.array().safeParse(s);
    if(s1.success) return s1.data;

    const s2 = z_query_params_sort.safeParse(s);
    if(s2.success) return [s2.data];

    return null;

}

const get_sorts = (e: any) => {

    // filters_from_event_target
    const f =  e?.target?.value;

    if(f){
        const r         =   json5_parse(f);
        if(r){
            const sorts   =    obj_to_sorts(r);
            if(sorts) return sorts;
        }
    }

    const s = get_attr_from_event(e, ['data-sorts']);
    if(!s) return console.warn("sorts not found : ", e);
    const r         =   json5_parse(s);
    if(!r) return console.warn("Unable to JSON parse sorts: ", s);

    const sorts   =    obj_to_sorts(r);
    if(!sorts) return console.warn("Invalid sort object found : ", r);
    return sorts;
}


const apply_sort_action = (sorts: T_SORTS, new_sorts: T_SORTS, op: string) => {

    if(op === "replace_all"){
        return new_sorts;
    }

    if(op === "replace" || op === "add"){
        for(let s of new_sorts){
            const found = sorts.find(s1=> s1.id === s.id);
            if(found){
                found.attr = s.attr;
                found.order = s.order;
            }
            else{
                sorts.push(s);
            }
        }
    }
    else if(op === "toggle"){
        for(let s of new_sorts){
            const fi = sorts.findIndex(s1=> s1.id === s.id);
            if(fi > -1){
                sorts.splice(fi, 1);
            }
            else{
                sorts.push(s);
            }
        }
    }
    else if(op ==="remove"){
        // remove all sorts
        for(let s of new_sorts){
            const fi = sorts.findIndex(s1=> s1.id === s.id);
            if(fi > -1){
                sorts.splice(fi, 1);
            }
        }
    }
    else{
        console.warn("SORTS OP NOT FOUND : ", op);
    }
    return sorts

} 

export const bro_apply_sorts = async function (e: any, M: any, INFO: T_INFO, props: any, idx?: number) {
    
    const ns   =    get_sorts(e);
    if(!ns) return console.warn("Sorts/valid sorts not found from event : ", e);

    const sorts_action =   get_attr_from_event(e, ['op']) ;
    if(!sorts_action) return console.warn("Sorts action not found from event : ", e);

    const mid = INFO.mid;
    const cid = INFO.cid;

    let  qid = get_attr_from_event(e, ['qid']);
    
    if(!qid){
        // console.warn("qid not found in html : ", e);
        qid = generate_query_id(cid, idx);
    }
    const query = AS.GSTORE.get_query(mid, qid);
    if(!query) {
        // no query found in GSTORE
        // we will create a new query
        
        const q : T_QUERY_PARAMS_LEVEL_2 = {
            type: "QP_LEVEL2",
            qid,
            sorts: ns,
            limit: 16,
            offset: 0,
        }
        AS.GSTORE.set_query(mid, qid, q, ["APPLYING SORTS FIRST TIME "]);
        return;
    }

    if(query.type !== "QP_LEVEL2") return console.warn("QUERY TYPE IS NOT QP_LEVEL2");
    const sorts = query.sorts || [];

    apply_sort_action(sorts, ns, sorts_action);

    query.sorts = sorts;
    AS.GSTORE.set_query(mid, qid, query, ["APPLY SORTS 2"]);
}


const get_limit  = (e: any) => {
    const f =  e?.target?.value;
    if(f){
        const l = Number(f);
        // if number then return it
        if(!isNaN(l)) return l;
    }
    // get from html attr
    const s = get_attr_from_event(e, ['data-limit']);
    if(!s) return console.warn("limit not found : ", e);
    const l = Number(s);
    // if number then return it
    if(!isNaN(l)) return l;

    return null
}

export const bro_apply_limit = async function (e: any, M: any, INFO: T_INFO, props: any, idx?: number) {
    const nl = get_limit(e);
    if(nl === null || nl === undefined) return console.warn("Limit not found from event : ", e);
    const mid = INFO.mid;
    const cid = INFO.cid;
    let  qid = get_attr_from_event(e, ['qid']);
    if(!qid){
        // console.warn("qid not found in html : ", e);
        qid = generate_query_id(cid, idx);
    }

    const query = AS.GSTORE.get_query(mid, qid);

    if(!query) {
        // no query found in GSTORE
        // we will create a new query
        const q : T_QUERY_PARAMS_LEVEL_2 = {
            type: "QP_LEVEL2",
            qid,
            limit: nl,
            offset: 0,
        }
        AS.GSTORE.set_query(mid, qid, q, ["APPLYING LIMIT FIRST TIME"]);
        return;
    }

    if(query.type !== "QP_LEVEL2") return console.warn("QUERY TYPE IS NOT QP_LEVEL2");

    const limit_action =   get_attr_from_event(e, ['op']) ;
    if(!limit_action) return console.warn("Limit action not found from event : ", e);

    if(limit_action === "replace" || limit_action === "add"){
        query.limit = nl;
    }
    else if(limit_action === "toggle"){
        if(!query.limit) query.limit = nl;
        else if(query.limit === nl) query.limit = undefined;
        else query.limit = nl;
    }
    AS.GSTORE.set_query(mid, qid, query, ["APPLY LIMIT 2"]);
}


export const bro_on_input_search = async function (e: any, M: any, INFO: T_INFO, props: any, idx?: number) {
    const model_id = INFO.mid;
    const comp_id  = INFO.cid;
    if(!model_id) return console.warn("NO MODEL ID FOUND TO SET TEXT FILTERS");
    if(!comp_id) return console.warn("NO COMP ID FOUND TO SET TEXT FILTERS");

    let qparams = AS.GSTORE.get_query(model_id, comp_id);
    if(!qparams) {
        console.warn("FILTERS NOT FOUND IN GSTORE");
        return;
    }

    if(qparams.type === "QP_ID"){
        return console.warn("SEARCH IS NOT VALID FOR QP_ID");
    }



    // why can't we use use directy produce(qparams, (draft)=>{})?
    // some type error

    let newqp: T_QUERY_PARAMS|null = null;
    
   
    if(qparams.type === "QP_LEVEL2"){
        const qp = produce(qparams, (draft)=>{
            draft.search?.forEach(s=>{
                s.text = e.target.value;
            });
        }); 
        newqp = unfreeze(qp);
        
    }
    else if(qparams.type === "QP_CODE"){
        const qp = produce(qparams, (draft)=>{
            draft.search?.forEach(s=>{
                s.text = e.target.value;
            });
        }); 
        newqp = unfreeze(qp);
    }
    

    if(newqp) AS.GSTORE.set_query(model_id, comp_id, newqp, ["ON INPUT SEARCH"]);
}

export const modify_filters_dsl = (params: T_QUERY_PARAMS_FINAL) => {
    if(params.type === "QP_ID") return console.warn("modify_filters_dsl: QP_ID is not valid for modify_filters_dsl");


    const filters = params.filters;
    if(!filters || !Array.isArray(filters)) return;

    for(let filter of filters){
        let val = filter.val;

        // if(val === undefined || val === null) continue;
        if(typeof(val) !== "string") continue;

        
    }
}


export const fe_to_be_query = (params: T_QUERY_PARAMS_LEVEL_2): t_query => {
    
    const filters = params.filters;
    const sorts = params.sorts;
    const limit = params.limit;

    if(filters){
        resolve_filter_fns(filters);
        resolve_filter_values(filters, {}, {}, {});
    } 
   

    return {
        version: 2,
        filters,
        sorts,
        limit
    }
}

