import authz from "../user/auth";
import { get_token, get_user, get_user_token_api } from "./user";
import { feedback, hashJoaat } from "./utils";


import GFN from "../GFN";
import AS from './AS';
import {GC} from "../global_state";
import { get_query_from_path, runtime_get_url_state } from "./path";
// import { DEFAULT_RES_ARR_P, DEFAULT_RES_SINGLE_P } from "../types/g-fn";
import { EN_BROKEN_G_FN_LOGS } from "./logs";
import { T_QUERY_PARAMS, T_QUERY_PARAMS_ID, T_QUERY_PARAMS_LEVEL_2, T_SORT, z_query_params } from "../broken-types/fe-query/query";
// import { T_INFO } from "../types/comp";
// import { z_url_eids, z_url_qs } from "../types/url";
import { apply_filter_action, fe_to_be_query, modify_filters_dsl } from "./filters";
import { DEFAULT_RES_ARR_P, DEFAULT_RES_SINGLE_P } from "../broken-types/default_res";
import { GET_MANY_RESULT, OBJ_WITH_ID } from "../broken-types/g_type";
import { T_INFO } from "../broken-types/comp";
import { z_url_eids, z_url_qs } from "../broken-types/url.js";
import { t_query } from "../broken-types/broken-data-api/query.js";
import { generate_draft_id, generate_query_id } from "../utils/draft.js";
import { T_FILTERS, T_FILTER_ATOM } from "@/broken-types/fe-query/filter.js";
import UTILS from "@/utils/index.js";
// import { OBJ_WITH_ID } from "../types/g-type.js";

export const get_one = async function (model_id: string, params: T_QUERY_PARAMS): DEFAULT_RES_SINGLE_P<OBJ_WITH_ID> {
    const errors: string[] = [];
    
    if(params.type === "QP_ID"){


        const id = params.id;
        if(!id) return {success: false, errors: ["ID_NOT_FOUND"]};
        
        const uta = get_user_token_api();
        if(!uta.success) return {success: false, errors: uta.errors};


        const {user, token, api} = uta.data;
    
        // Doing auth based on roles before img adding in the frontend
        const permission = authz.get(model_id, user);
        if(!permission.success) return {success: false, errors: permission.errors};
    
    


        const app_id = GC.APP_ID;
        const branch  = GC.BRANCH;
        const r = await api.entity.get_one({app_id, model_id,branch, token, id});
        if (!r || !r.success) {
            feedback(`Get one unsuccessful`, "error");
            console.warn(
                `Failed to get one entity with id :  ${id}`,
                r.errors,
                app_id,
                model_id,
                id
            );
            return {success: false, errors: r.errors||[]};
        }
    
        // console.log("@debug: THE DATA IN GET ONE DATASCRIPT IS => ", r, app_id, model_id, token, id);
        
        // g_fn.feedback(`Get one successful`, "success");
        // GFN.feedback(`@TODO: check types of get one`, "warn");
        console.error("@TODO: check types of get one", "warn");
        
        return r;
    }
   
    else if(params.type === "QP_LEVEL2"){
        params.limit = 1; // force limit to 1
        const r = await GFN.get_many(model_id, params);

        if(!r.success) return {success: false, errors: r.errors};
        if(!r.data) return {success: false, errors: ["NO_DATA_FOUND"]};
        if(!Array.isArray(r.data)) return {success: false, errors: ["INVALID_RESPONSE"]};

        // success but no data
        if(!r.data.length) return {success: true, data: {id: 0}};

        // success with data
        return {success: true, data: r.data[0]};
    }
    else if(params.type === "QP_CODE"){
        // @TODO: implement it
        errors.push("CODE_QUERY_PARAMS_NOT_SUPPORTED");
        alert(errors.join("\n"));
        GFN.feedback(errors.join("\n"), "error");
    }

    return {success: false, errors};
}


export const get_one_find_id = function (props: any, INFO:T_INFO){
    const model_id = INFO.mid;
    if(!model_id) return console.warn("NO MODEL ID FOUND TO FIND ID FOR GET ONE");
    // take from props
    if(props && props.M){
        if(typeof(props.M) === "string") {
            return props.M;
        }
        else if(props.M.id) {
            return props.M.id
        }
        else {
            // do nothing
        }
    }

    // filters => this will not give id without querying db

    // url
    const url_state = runtime_get_url_state();
    if(url_state && url_state.model_id && url_state.entity_id){
        // check INFO.model_id === url_state.model_id

        return url_state.entity_id;
    }

    // INFO.query
    // e.g: INFO.query = {[user].id}
    // const q = INFO.query;
    // if(q){
    //     const prop_name = q.prop_name;
    //     const prop_value = get_prop_value_from_query(q.prop_value);
    //     const op = q.op;
    //     if(op === "eq" ) {
    //         const entity_store = AS.GSTORE.entity[model_id];
    //         if(entity_store) {
    //             const id = Object.entries(entity_store).find(e=>(e[0] === prop_name) && (e[1] === prop_value));
    //             if(id) return id[0];
    //         }
    //     }
    //     // const entity_store = AS.GSTORE.entity[model_id];
    //     // if(entity_store) {
    //     //     Object.entries(entity_store).find(e=>(e[0] === q.prop_name) && (e[1] === q.prop_value));
    //     // }
    //     if(q === "{[user].id}"){
    //         console.warn("QUERY FOUND : ", q, AS.user)
    //         return AS.user?.id
    //     }
    // }

    return null;
}





export const get_many_qid = function (FO:any) {
    // const FILTERS = GFN.generate_filters(FO);

    // const q = {
    //     filters: FILTERS,
    //     sorts: FO.sorts,
    //     limit: FO.limit,
    //     cursor_first: FO.cursor_first,
    //     cursor_last: FO.cursor_last,
    //     offset: FO.offset
    // };

    // const qid = hashJoaat(JSON.stringify(q));

    // return qid;
}


// note: donot remove this code, this is not deprecated, have to add more types to implement this

/* export const get_props_data = async (model_id: string, params: T_QUERY_PARAMS_PROPS):DEFAULT_RES_SINGLE_P<any>  => {
    
    const uta = get_user_token_api();
    if(!uta.success) return {success: false, errors: uta.errors};
    const {user, token, api} = uta.data;

    //Doing auth based on roles in the frontend
    const permission = authz.get(model_id, user);
    if(!permission.success) {
        return {success: false, errors: ["NO_PERMISSION"]};
    }

    if(params.type !== "QP_PROPS"){
        return {success: false, errors: ["INVALID_QUERY_TYPE"]};
    }


    const app_id    = GC.APP_ID;

    const branch  = GC.BRANCH;


    const q: t_query  = {
        version: 2,
        entity_id : params.entity_id.toString(),
        props: params.props,
    }

    let r = await api.entity.get_many({app_id, model_id, branch, token, query: {query: q}}); 

    return r;


}


// given an entity, get  prop data, query is valid for relational props
export const get_prop_data = async(mid: string, eid: string, prop: string, query?: t_query_v2) =>{

    const q: T_QUERY_PARAMS = {
        qid: eid,
        type: "QP_PROPS",
        entity_id: eid,
        props: {[prop]: query? query : true},
    }

    const r = await get_props_data(mid, q);
    return r
}   


// if there is a relation from model A to model B via prop Ap, given model B entity Eb, get all the entities of model A which are related to Eb via prop Ap
export const get_rev_rel_prop_data = async(mid: string, eid: string, params: {rel_from_model: string, rel_prop_name : string, query?: t_query_v2}) =>{
    
    const {rel_from_model, rel_prop_name} = params;

    const prop = `--${rel_from_model}--${rel_prop_name}`;

    const q : T_QUERY_PARAMS = {
        qid: eid,
        type: "QP_PROPS",
        entity_id: eid,
        props: {[prop]: params.query? params.query : true},
    }

    const r = await get_props_data(mid, q);
    return r

} */






export const get_many = async function (model_id: string, params: T_QUERY_PARAMS):DEFAULT_RES_ARR_P<OBJ_WITH_ID> {

    const uta = get_user_token_api();
    if(!uta.success) return {success: false, errors: uta.errors};
    const {user, token, api} = uta.data;

    //Doing auth based on roles in the frontend
    const permission = authz.get(model_id, user);
    if(!permission.success) {
        return {success: false, errors: ["NO_PERMISSION"]};
    }

    if(params.type !== "QP_LEVEL2"){
        console.warn("QUERY PARAMS OF TYPE : ", params.type, " IS NOT SUPPORTED");
        return {success: false, errors: ["QUERY_PARAMS_OF_TYPE_NOT_SUPPORTED"]};
    }

    if(EN_BROKEN_G_FN_LOGS.FILTERS){
        console.log("filters in the get many is  :", params);
    }

    const app_id    = GC.APP_ID;

    const bq = fe_to_be_query(params);

    const branch  = GC.BRANCH;
    let r = await api.entity.get_many({app_id, model_id, branch, token, query: {query: bq}}); 

    return r;
}









// bro_get_one: get by using various methods. This can be called in the component init function any number of time
export const bro_get_one = async function (e: any, M: any, INFO: T_INFO, props: any, idx?: number):DEFAULT_RES_SINGLE_P<OBJ_WITH_ID> {

    const app_id    = GC.APP_ID;
    const mid       = INFO.mid;
    const cid       = INFO.cid; 

    
    // CHILD TO PARENT preference 
    // INFO.query -> props.query -> GSTORE.query -> url state


    if(INFO.query){
        const q = INFO.query;
        if(q.type === "QP_ID" && !q.id){
            // try other way
        }
        else{
            const M = await AS.GSTORE.get_one(mid, INFO.query);
            return M;
        }
    }

    // take from query params
    const Q = props.query;
    if(Q){
        const p = z_query_params.safeParse(Q);
        if(!p.success){
            console.warn("INVALID QUERY PARAMS", Q, p.error, mid);
            return {success: false, errors: ["INVAID QUERY PARAMS"]};
        }

        const qparams = p.data;

        // SAVE THE QUERY IN INFO - so that we can modify filters and pagination
        if(!INFO.query) INFO.query = qparams;

        const M = await AS.GSTORE.get_one(mid, qparams);
        return M;
    }

    // take from props.M
    if(props && props.M && props.M.id){
        const id: string = props.M.id;
    
        // if freeze is set then we will not query db
        if(props.M.__freeze) return props.M;
        // When parent component sends data with __freeze we will not query db


        // if M has more than just id then return M
        const keys = Object.keys(props.M).filter(k=>k !== "id");
        if(keys.length > 0) return {success: true, data: props.M};
        // @notice: there is a error somewhere becuase we are getting id of the relation->parent but and the mid doen't match 
        // remove this if condition to see the error. It happens on get_one of relation



        const qparams: T_QUERY_PARAMS = {
            type: "QP_ID",
            id: id,
            limit: 1,
            qid: id
        }
        const M = await AS.GSTORE.get_one(mid, qparams);
        return M;
    }

    


  
    // ?state={ids:[{mid: a, eid: b}, {mid: c, eid: d}]}
    const state = GFN.runtime_get_url_state();


    // next many modelid and entityid
    if(state.eids){
        const p = z_url_eids.safeParse(state.eids);
        if(!p.success){
            console.warn("INVALID URL IDS", state.eids);
            return {success: false, errors: ["INVALID URL IDS"]};
        } 
        const eids = p.data;
        const eid = eids.find(e=>e.mid === mid);
        if(!eid){
            console.warn("NO ENTITY ID FOUND IN URL IDS", state.eids);
            return {success: false, errors: ["NO ENTITY ID FOUND IN URL IDS"]};
        } 
        
        const id = eid.eids[0]; // let's take the first one 
        // @todo: what can we do if more than one selected entity is found

        // constraints on cid
        if(eid.cid && cid && eid.cid !== cid){
            console.warn("CID MISMATCH", eid.cid, cid);
            return {success: false, errors: ["CID MISMATCH"]};
        }

        const qparams: T_QUERY_PARAMS = {
            type: "QP_ID",
            id: id,
            limit: 1,
            qid: id
        }
        

        const M = await AS.GSTORE.get_one(mid, qparams);
        return M;
    }


    // PATH to QUERY
    const P = get_query_from_path(window.location.pathname);
    if(P && P.op === "go" && P.mid === INFO.mid){
        const {mid, q} = P;
        const M = await AS.GSTORE.get_one(mid, q);
        return M;
    }


    // USE SELECTED ONE
    const SE = AS.GSTORE.get_selected_first(INFO.mid);
    if(SE && SE.id){
        return {success: true, data: SE};
    }

   


    // NO WHERE TO FIND ID
    console.warn("NO WHERE TO FIND ID", INFO, props);
    return {success: false, errors: ["NO WHERE TO FIND ID"]};
}

// bro_get_many: get using various methods. This can be called in the component init function any number of time. We will cache the result
export const bro_get_many = async function (e: any, M: any, INFO: T_INFO, props: any, idx?: number):DEFAULT_RES_SINGLE_P<OBJ_WITH_ID[]> {
    const errors: {code: string, message: string}[] = [];

    const app_id    = GC.APP_ID;
    const mid       = INFO.mid;
    const cid       = INFO.cid; 
    // CHILD TO PARENT preference 
    // INFO.query -> props.query -> GSTORE.query -> url state


    const CS = UTILS.GET_STATE(INFO, "COMP");

    if(INFO.query){
        const MS = await AS.GSTORE.get_many(mid, INFO.query, ["BRO_GET_MANY"]);
        return MS;
    }


    // take from props params
    const Q = props.query;
    if(Q){
        const p = z_query_params.safeParse(Q);
        if(!p.success){
            console.warn("INVALID QUERY PARAMS", Q, p.error, mid);
            return {success: false, errors: ["INVALID QUERY PARAMS"]};
        }

        const qparams = p.data;

        // SAVE THE QUERY IN INFO - so that we can modify filters and pagination
        if(!INFO.query) INFO.query = qparams;

        const MS = await AS.GSTORE.get_many(mid, qparams, ["BRO_GET_MANY"]);
        return MS;
    }


    // take from props.M
    // parent has M.liked as [{id: 1}, {id: 2}]
    // <child M={M.liked}></child>
    if(props && props.M && Array.isArray(props.M)){

        
        // if freeze is set then we will not query db
        if(props.M.__freeze) return {success: true, data : props.M}; 
        // When parent component sends data with __freeze we will not query db
        // @caution: when we do {props.M.map(m=>JSX)} we will not get the __freeze. But Object.values(props.M) will get it




        const eids = props.M.map(e=>e.id).filter(id=>id);
        const MS: OBJ_WITH_ID[] = [];

        const qid = generate_query_id(cid, idx);

        // do it with id $in [id1, id1] query instead of doing many get_one
        
        for(let id of eids){
            const qparams: T_QUERY_PARAMS = {
                type: "QP_ID",
                id: id,
                limit: 1,
                qid: id
            }
            const M = await AS.GSTORE.get_one(mid, qparams).catch(e=>{errors.push(e)});
            if(M && M.success && M.data){
                MS.push(M.data);
            }
        }

        // No pagination posible when list of ids are passed
        const params:T_QUERY_PARAMS = {type: "QP_ID", qid, id: eids.join(",")}; // this ois meaningless because data is actually coming from parent
        const GMR: GET_MANY_RESULT = {params, queried_at: Date.now(), data: MS};
        return {success: true, data: GMR.data};
    }



    // @todo: get from GSTORE
    

    // get from url
    // or
    // ?state={qs:[{mid: a, q: q1}, {mid: c, q: q2}]}
    const state = GFN.runtime_get_url_state();
    if(state && state.qs){
        const p = z_url_qs.safeParse(state.qs);
        if(!p.success) {
            console.warn("INVALID URL QS", state.qs);
            return {success: false, errors:["INVALID URL QS"]};
        }
        const qs = p.data;
        const q = qs.find(e=>e.mid === mid);
        if(!q){
            console.warn("NO QUERY FOUND IN URL QS", state.qs);
            return {success: false, errors:["NO QUERY FOUND IN URL QS"]};
        } 

        const p1 = z_query_params.safeParse(q.q);
        if(!p1.success){
            console.warn("INVALID URL QS", q.q);
            return {success: false, errors:["INVALID URL QS"]};
        }

        const qparams = p1.data;

        // SAVE THE QUERY IN INFO - so that we can modify filters and pagination
        if(!INFO.query) INFO.query = qparams;

        const MS = await AS.GSTORE.get_many(mid, qparams, ["BRO_GET_MANY"]);
        return MS;
    }

    // We can change INFO.query to have a different query. Which means you can change filter dynamically


    // PATH to QUERY
    const P = get_query_from_path(window.location.pathname);
    if(P && P.op === "gm" && P.mid === INFO.mid){
        const {mid, q} = P;
        const MS = await AS.GSTORE.get_many(mid, q, ["BRO_GET_MANY - PATH to QUERY"]);
        return MS;
    }


    // DEFAULT
    const qid = generate_query_id(cid, idx);
    const q: T_QUERY_PARAMS = {type: "QP_LEVEL2", qid,  limit: 16, };
    const MS = await AS.GSTORE.get_many(mid, q, ["BRO_GET_MANY"]);
    return MS;
}

// setting the query for pagination
const set_query_for_pag = (query : T_QUERY_PARAMS, M: any, op: "next"|"prev") => {

    // cursor (limit 10)
    // 0 to 10 to 20 to 30 to 40 to 50
    // on next at 20, should return 20 to 30 => data = data.filter(cursor => cursor > 20).slice(0, 10)
    // on prev at 30, should return 20 to 30 => data = data.filter(cursor => cursor < 30).slice(-10)

    // gets filter id for given a sort
    const filter_id = (sort: T_SORT) =>  "fa-"+sort.attr;

    // generates filter atom given a sort and order
    const gen_filter = (sort: T_SORT,val: any, order: "next"|"prev", op?: string):T_FILTER_ATOM => {

        let id = filter_id(sort);
        if(op) id += "-op" + op;

        if(order === "next"){
            if(!op){
                op = sort.order === "ASC" ? "gt" : "lt";
            } 
            return {type: "atom", attr: sort.attr, id, val: val, op};
        }
        else{
            if(!op){
                op = sort.order === "ASC" ? "lt" : "gt";
            } 
            return {type: "atom", attr: sort.attr, id, val: val, op};
        }
    }

  

    if(query.type !== "QP_LEVEL2"){
        return "NO_CHANGE";
    };

    const default_filters: T_FILTERS = {
        type : "group",
        id : "fg-1",
        filters: {
        }
    }
    if(!query.filters) query.filters = default_filters;

    const sorts = query.sorts || [];


    // id has to be part of sorts because id is unique 
    // if there is any other property which is unique, then there is no need of id
    // there needs to be a unique property in sorts because, there has to be no repetition
    // this type of pagination is dynamic pagination, we set filters to get next/prev data


    const gen_pagination_filters = (sort1: T_SORT, sort2: T_SORT, val1: any, val2: any, order:"next"|"prev"): T_FILTERS => {
        
        const fg: T_FILTERS = {
            type : "group",
            id : "fg-or-pagination",
            group_by : "or",
            filters : {}
        }

        // used later when setting in filter
        const and_id = "fg-and"

        if(op === "next"){

            // next
            // eg : sort1 name : asc , sort 2 id : asc
            // val1 : n1, val2 : id1

            // name > n1  
            const filter_atom_s11 = gen_filter(sort1, val1, "next");
            fg.filters[filter_atom_s11.id] = filter_atom_s11;
            
            // name = n1, id > id1

            // filter => name = n1
            const filter_atom_s12   = gen_filter(sort1, val1, "next",  "eq");
            //filter => id > id1
            const filter_atom2      = gen_filter(sort2, val2, "next");

            // and 
            fg.filters[and_id] =     {
                type: "group",
                id: and_id,
                group_by: "and",
                filters: {
                    [filter_atom_s12.id] : filter_atom_s12,
                    [filter_atom2.id]: filter_atom2
                }
            }        
        }
        else{

            // prev
            // eg : sort1 name : asc , sort 2 id : asc
            // val1 : n1, val2 : id1

            // name < n1  
            const filter_atom_s11 = gen_filter(sort1, val1, "prev");
            fg.filters[filter_atom_s11.id] = filter_atom_s11;
            
            // name = n1, id < id1
            // filter => name = n1
            const filter_atom_s12   = gen_filter(sort1, val1, "prev",  "eq");
            //filter => id < id1
            const filter_atom2      = gen_filter(sort2, val2, "prev");

            // and 
            fg.filters[and_id] =     {
                type: "group",
                id: and_id,
                group_by: "and",
                filters: {
                    [filter_atom_s12.id] : filter_atom_s12,
                    [filter_atom2.id]: filter_atom2
                }
            }   
        }
        return fg;
    }


    // add id sort if not present
    const sid = "id-sort";
    // by default sort by id in DESC order (lastest created entity first)
    const id_sort: T_SORT = {id: sid, attr:"id", order: "DESC"};
    const fi = sorts.find(s=>s.attr === "id");
    if(!fi) sorts.push(id_sort);

  

    if(op === "next"){
        query.limit = Math.abs(query.limit || 16) ;
       
        // find for this filter in query
        // cursor
        // whenever there are multiple sorts,
        // condition has to be {or : {s1_filter , and : {s1_filter, unique_id_filter}}} s1_filter: filter for sort1
        // if there are more than 1 sorts (apart from id), then implementation becomes more complex 

        // if only one sort is present
        const sorts_len =  sorts.length;

        if(sorts_len === 1){
            // only sort of id is present
            const filter =  gen_filter(sorts[0], M.slice(-1)[0]["id"], "next");
            apply_filter_action(query.filters, filter, "replace");
        }
        else{
            // more than one sorts are present
            // ignore rest of the sorts for now
            // use the first one and id sort

            const val1 = M.slice(-1)[0][sorts[0].attr];
            const val2 = M.slice(-1)[0]["id"];
            const filters = gen_pagination_filters(sorts[0], id_sort, val1, val2, "next");
            
            apply_filter_action(query.filters, filters, "replace");

        }
    }
    else if(op === "prev"){
        // setting negative limit to get data from last (slice)
        query.limit = Math.abs(query.limit || 16) * -1;
       
        // if only one sort is present
        const sorts_len =  sorts.length;

        if(sorts_len === 1){
            // only sort of id is present
            const filter =  gen_filter(sorts[0], M[0]["id"], "prev");
            apply_filter_action(query.filters, filter, "replace");
        }
        else{
            // more than one sorts are present
            // ignore rest of the sorts for now
            // use the first one and id sort

            const val1 = M.slice(0,1)[0][sorts[0].attr];
            const val2 = M.slice(0,1)[0]["id"];
            const filters = gen_pagination_filters(sorts[0], id_sort, val1, val2, "prev");
            
            apply_filter_action(query.filters, filters, "replace");
        }
    }

}





export const get_query_for_pagination = function (props: {M: any, INFO: T_INFO, idx?: number, op:"next"|"prev"}): null | T_QUERY_PARAMS {

    const {M, INFO, idx, op} = props;

    const qid = INFO.query?.qid || generate_query_id(INFO.cid, idx);
    if(!M || !Array.isArray(M) || !M.length){
        console.warn("NO DATA FOUND TO GET PREV", M);
        return null;
    } 
    const q = AS.GSTORE.get_query(INFO.mid, qid) || {type: "QP_LEVEL2", qid: qid, limit: 16};
    const clone_q = JSON.parse(JSON.stringify(q));
    set_query_for_pag(clone_q, M, op);
    return clone_q;

}

// PAGINATION: NEXT
export const bro_get_many_next =  function (e: any, M: any, INFO: T_INFO, props: any, idx?: number) {
    
    const qid = INFO.query?.qid || generate_query_id(INFO.cid, idx);
    const q = get_query_for_pagination({M, INFO, idx, op:"next"});
    if(!q) return;
    AS.GSTORE.set_query(INFO.mid, qid, q, ["BRO_GET_MANY_NEXT"]);
}

// PAGINATION: PREV
export const bro_get_many_prev =  function (e: any, M: any, INFO: T_INFO, props: any, idx?: number) {
    const qid = INFO.query?.qid || generate_query_id(INFO.cid, idx);
    const q = get_query_for_pagination({M, INFO, idx, op:"prev"});
    if(!q) return;
    AS.GSTORE.set_query(INFO.mid, qid, q, ["BRO_GET_MANY_PREV"]);
}





















// @deprecated
export const get_many_pagination = async function (app_id, model_id, set_M, {filters, sort, limit, prev}) {}




// @deprecated: is_json also should have id and we will use the default get one to get the data
// when we receive an entity with json inside we will also store the json data wrt it's model id and entity id
// export const bro_get_is_json = async function (INFO, props) {}


// @deprecated
export const bro_subs_for_get_many_on_tx = async function (INFO) {return {}}