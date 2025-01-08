import { produce, Patch } from "structurajs"
import { BehaviorSubject, Subject, Subscription} from 'rxjs';
import { DRAFT_EVENT_TYPE, FILTER_EVENT_TYPE, GET_MANY_RESULT, MANY_ENTITY_EVENT_TYPE, MESSAGE_EVENT_TYPE,  OBJ_WITH_ID, ONE_ENTITY_EVENT_TYPE, QUERY_PARAMS_EVENT_TYPE, SELECT_EVENT_TYPE } from "../broken-types/g_type";

import {EN_BROKEN_G_FN_LOGS} from "../gfn/logs";

import GFN from "../GFN";
import { DEFAULT_RES_SINGLE, DEFAULT_RES_SINGLE_P, OBJECT_TYPE } from "../broken-types/default_res";
import { T_QUERY_PARAMS_FINAL, T_QUERY_PARAMS } from "../broken-types/fe-query/query";
import { T_UPDATES } from "../broken-types/update";
import { makeObservable, observable } from "mobx";
import {  findDifferences } from "@/utils/obj";
import { COMP_STATE } from "./comp";
import { GLOBAL_STATE } from "./global";
import { SERVER_STATE } from "./server";
import { get_model_by_name } from "@/gfn/models";


// import { T_QUERY_PARAMS, T_QUERY_PARAMS_ID, T_QUERY_PARAMS_LEVEL_1 } from "../types/query";

const hashJoaat = function (b: string) {
	for (var a = 0, c = b.length; c--;)a += b.charCodeAt(c), a += a << 10, a ^= a >> 6; a += a << 3; a ^= a >> 11; return ((a + (a << 15) & 4294967295) >>> 0).toString(16);
};




export class GLOBAL_STORE {

    showmodal: boolean = false;
    devpreview: boolean = false;


    // get one
    // entity maintains data fetched from database
    entity: {
        [model_id:string]: {
            [eid:string]: OBJ_WITH_ID
        }
    } = {};

    // draft is a copy of entity, but it is not saved in the database
    // All form editing will be done on draft
    draft : {
        [model_id:string] : {
            [did: string]: OBJ_WITH_ID
        }
    } = {};


    // patches for update
    patches: {
        [model_id:string]: {
            [eid:string]: undefined|Patch[]
        }
    } = {
    }
    // it has stored diff for each entity between (GSTORE,DB) and React state. The react state has latest data, GSTORE has old data



    // get many
    // this will be a cache, but we will always query fresh data from db
    // because get_many data could be stale
    list: {
        [model_id:string]: {
            [qid: string]: GET_MANY_RESULT
        }
    } = {}


    // every component will have a filters for each model, this filters could be changed in runtime to query a different set of data
    query: {
        [mid:string]: {
            [cid: string]: T_QUERY_PARAMS
        }
    } = {
    }



    // Global state that can be accessed from anywhere, 
    // Use it for global filters, search
    state: {
        [k:string]: any
    } = {}

    COMP_STATES     : {[csid: string]: COMP_STATE}      = {};
    GLOBAL_STATE    = new GLOBAL_STATE()
    SERVER_STATES   = new SERVER_STATE()


    // @deprecated: use CS, GS, SS instead
    // every component can have warnings and errors
    warnings: {
        [comp_id:string]: {
            code: string,
            message: string
        }[]
    } = {
    }

    errors: {
        [comp_id:string]: {
            code: string,
            message: string
        }[]
    } = {
    }


    any_event = new Subject<any>(); // {model_id, *}
    one_event = new Subject<ONE_ENTITY_EVENT_TYPE>();       // {mid, eid, cid, data}
    many_event = new Subject<MANY_ENTITY_EVENT_TYPE>();     // {model_id, qid, data.data[]}
    query_event = new Subject<QUERY_PARAMS_EVENT_TYPE>();  // {model_id, comp_id, data}
    message_event = new Subject<MESSAGE_EVENT_TYPE>();      // 
    select_event = new Subject<SELECT_EVENT_TYPE>();        // 
    draft_event = new Subject<DRAFT_EVENT_TYPE>();

    filter_event = new Subject<FILTER_EVENT_TYPE>();
    

    // selcted entity ids, for update and highlight
    selected_entity: {
        [model_id: string]: (string|number)[] // id can be string or number
    } = {}


    constructor() {
        makeObservable(this, {
            showmodal: observable,
            devpreview: observable,

        });
    }

    // on change  
    emit(e: ONE_ENTITY_EVENT_TYPE | MANY_ENTITY_EVENT_TYPE | QUERY_PARAMS_EVENT_TYPE | SELECT_EVENT_TYPE | MESSAGE_EVENT_TYPE | DRAFT_EVENT_TYPE | FILTER_EVENT_TYPE){
        this.any_event.next(e);
    }

    emit_one(e: ONE_ENTITY_EVENT_TYPE){
        this.one_event.next(e);
        this.emit(e);
    }
    emit_many(e: MANY_ENTITY_EVENT_TYPE){
        this.many_event.next(e);
        this.emit(e);
    }
    emit_query(e: QUERY_PARAMS_EVENT_TYPE){
        this.query_event.next(e);
        this.emit(e);
    }
    emit_selected_entities(e: SELECT_EVENT_TYPE){
        this.select_event.next(e);
        this.emit(e);
    }
    emit_message(e: MESSAGE_EVENT_TYPE){
        this.message_event.next(e);
        this.emit(e);
    }
    emit_draft(e: DRAFT_EVENT_TYPE){
        this.draft_event.next(e);
        this.emit(e);
    }

    emit_filter(e: FILTER_EVENT_TYPE){
        this.filter_event.next(e);
        this.emit(e);
    }    


    entity_from_response_object(qid: string|number, r: DEFAULT_RES_SINGLE<any>): OBJ_WITH_ID {
        // data queried but not found
        if(!r.success || !r.data){
            return {
                id: qid,
                __meta: {queried_at: Date.now(), reason: "NOT_FOUND"}
            }
        }

        if(Array.isArray(r.data) && r.data.length > 0){
            return r.data[0];
        }
        
        if(!r.data.id){
            return {
                id: qid,
                __meta: {queried_at: Date.now(), reason: "NO_ID FOUND IN DATA FROM_DB"}
            }
        }

        return r.data;
    }

    async get_from_db(model_id: string, params: T_QUERY_PARAMS): Promise<OBJ_WITH_ID>{
        if(params.type === "QP_ID"){
            const r = await GFN.get_one(model_id, params);
            return this.entity_from_response_object(params.id, r); // here we could have just used qid as well. We have separated to make it more clear
        }
        else{
            const r = await GFN.get_many(model_id, params);
            return this.entity_from_response_object(params.qid, r);
        }
    }

    async get_one(model_id: string, params: T_QUERY_PARAMS): DEFAULT_RES_SINGLE_P<OBJ_WITH_ID>{
        let mstore = this.entity[model_id];
        if(!mstore) mstore = {};
        this.entity[model_id] = mstore;

        
        
        if(params.type === "QP_ID"){
            const eid = params.id;
            const data = mstore[eid];
            if(data){
                return {success: true, data};
            }    
        }

        // not found in store
        // console.log("GSTORE GET ONE ENTITY FROM DATABASE : ", model_id, params);
        const data = await this.get_from_db(model_id, params);
        
        // qid is query id. Because we don't know the id for this object yet. We only the filters
        // id can only be assigned when we get the data from the server
        this.set(model_id, data.id, data);


        if(!params.qid) params.qid = this.generate_qid(model_id, params);

        // we will also set the entity in with qid so that the original component can get this data
        this.set(model_id, params.qid, data); // qid should be like => modelid+filters+sorts+limit+offset

        return {success: true, data};
    }

    async get_one_by_id(mid: string, id: string|number): Promise<OBJ_WITH_ID|null>{
        const r = await this.get_one(mid, {type: "QP_ID", id, qid: ""});
        if(!r.success) return null;
        return r.data;
    }

    generate_qid(model_id: string, params: T_QUERY_PARAMS){
        const clone = JSON.parse(JSON.stringify(params));
        delete clone.qid; // make it independent of qid
        return model_id + ":" + hashJoaat(JSON.stringify(clone));
    }

    get_cached_list(mid: string, qid: string):GET_MANY_RESULT | null{
        const   A = this.list;
        let     B = A[mid];     if(!B) B = {};  A[mid] = B;
        const   C = B[qid];
        if(!C) return null;

        if(C && C.data){
            console.warn("GET MANY DATA FROM CACHE : ", mid, qid, C);
        }
        
        return C;
    }
    remove_cached_list(mid: string, qid?: string){
        const   A = this.list;
        if(!A) return;
        
        const    B = A[mid];
        if(!B) return;
        
        if(!qid){
            console.warn("REMOVING .. GET MANY DATA FROM CACHE : ", mid, qid);
            A[mid] = {}; // clear all
            return;
        }
        
        // delete only this qid
        console.warn("REMOVING .. GET MANY DATA FROM CACHE FOR QUERY : ", mid, qid, B);
        delete B[qid];
    }

    async get_many(mid: string, params: T_QUERY_PARAMS, source: string[]): DEFAULT_RES_SINGLE_P<OBJ_WITH_ID[]>{ // qid should be like => modelid+filters+sorts+limit+offset
        
        if(!params.qid) params.qid = this.generate_qid(mid, params);
        let qid = params.qid;

        // first check in the list
        const cached_data = this.get_cached_list(mid, qid);
        if(cached_data) {
            this.set_many(mid, params, cached_data, [...source, "GET_MANY"]);
            return {success: true, data: cached_data.data};
        }


        // not found in store
        // console.log("GSTORE GET MANY ENTITIES FROM DATABASE : ", mid, params);
        this.emit_message({type : "MESSAGE_EVENT", level : "log", message : "FETCHING", mid, data : null});
        const r = await GFN.get_many(mid, params);

        if(!r.success){
            //  @todo: figure out how to show errors

            const result = {
                params,
                queried_at: Date.now(),
                data: [],
                errors: r.errors,
                warnings: r.warnings
            }

            this.emit_message({type : "MESSAGE_EVENT", level : "error", message : "FETCH_FAILED", mid, data : null});
            return {success: false, errors: result.errors, warnings: result.warnings};
        
            // don't set in GSTORE when failed
        }


        const result = {
            params,
            queried_at: Date.now(),
            data: r.data
        }
        this.set_many(mid, params, result, [...source, "GET_MANY"]);

        // LOG SUCCESS
        this.emit_message({type : "MESSAGE_EVENT", level : "log", message : "FETCHED", mid, data : result});
        return {success: true, data: result.data};
    }



    // SELECTED ENTITY -> GET | SET
    set_selected_eid(mid: string, eid: string|number, append?: boolean, cid?: string){
        if(append){
            if(!this.selected_entity[mid]) this.selected_entity[mid] = [];
            this.selected_entity[mid].unshift(eid);
            this.emit_selected_entities({type : "SELECT_EVENT", name: "select", mid, eids : this.selected_entity[mid], cid})
        }
        else{
            this.selected_entity[mid] = [eid];
            this.emit_selected_entities({type : "SELECT_EVENT", name: "select", mid, eids : this.selected_entity[mid], cid})
        }
    }
    set_selected(mid: string, e: OBJ_WITH_ID, append?: boolean, cid?: string){
        this.set_selected_eid(mid, e.id, append, cid);
    }
    get_selected(mid : string) : OBJ_WITH_ID[] | null {
        const eids = this.get_selected_eids(mid);
        if(!eids || !eids.length) return null;
        const ents: OBJ_WITH_ID[] = [];
        return eids.map(eid=>this.get(mid, eid)).filter(e=>e) as OBJ_WITH_ID[];
    }
    get_selected_first (mid: string) : OBJ_WITH_ID | null {
        // const eids = this.get_selected_eids(mid);
        // if(!eids || !eids.length) return null;
        // return await this.get_one_by_id(mid, eids[0]);
        const ents = this.get_selected(mid);
        if(!ents || !ents.length) return null;
        return ents[0];
    }
    get_selected_eids(mid : string) {
        let sstore = this.selected_entity[mid];
        if(!sstore){
            // mid could be mname
            const M = get_model_by_name(mid);
            if(M){
                mid = M.id;
                sstore = this.selected_entity[mid];
            }
        }

        if(!sstore) {
            sstore = [];
            this.selected_entity[mid] = sstore;
        }
        return sstore;
    }
    is_selected(p: {mid: string, M: any}){
        const {mid, M} = p;
        const eids = this.get_selected_eids(mid);
        if(!eids) return false;
        return eids.includes(M.id);
    } 
    async get_selected_remote(mid : string) : Promise<OBJ_WITH_ID[] | null> {
        const eids = this.get_selected_eids(mid);
        if(!eids || !eids.length) return null;
        const ents: OBJ_WITH_ID[] = [];
        for(let eid of eids){
            const e = await this.get_one_by_id(mid, eid);
            if(e) ents.push(e);
        }
        return ents;
    }




    async create_one(mid: string, did: string): DEFAULT_RES_SINGLE_P<OBJ_WITH_ID>{
        const data = this.get_draft(mid, did);
        if(!data) {
            return {success: false, errors: ["NO_DATA"]};
        }

        this.emit_message({level : "log", message : "CREATING", mid, type : "MESSAGE_EVENT", eid : data.id, data});
        
        const r = await GFN.create_one(mid, data);

        // reset the id for next item
        this.update_draft(mid, did, {id: GFN.get_ulid()});

        
        // this will also be used as react state
        if(!r.success){
            const errors = r.errors.join(", ");
            this.emit_message({type : "MESSAGE_EVENT", mid, level : "error", message : "CREATE_FAILED", eid : data.id, data});
            const msg = "Creation unsuccessful" + errors;
            return {success: false, errors: [msg]};
        }


        if(!r.data){
            console.warn("CREATE ONE NO DATA: ", r);
            return {success: false, errors: ["NO DATA IN CREATE ONE RESPONSE"]};
        }

        // maybe a new id is assigned by the server
        // @todo: think about this

        // jusr for message 
        this.emit_message({type : "MESSAGE_EVENT", mid, level : "log", message : "CREATED", eid : data.id, data });
            
        // this will be used to refresh get_many
        this.emit_one({type:'ONE_ENTITY_EVENT', name: "create", mid, eid: data.id, data});

        return r
    }


    // async create_many
    async create_many(mid: string, data: OBJ_WITH_ID[]): Promise<OBJ_WITH_ID[]|null>{
        if(!data || !data.length) return null;

        const clones = JSON.parse(JSON.stringify(data.map(d=>d))) as {[k:string]: any}[];

        // id exits in frontend
        for(let d of clones){
            if(d.id){
                const meta_clone = produce(d, (draft)=>{
                    if(!draft.__meta) draft.__meta = {};
                    draft.__meta.status = "CREATING";
                });
                this.set(mid, d.id, meta_clone as any); // @check : why as any
            }
        }
        this.emit_message({level : "log", message : "CREATING", mid, type : "MESSAGE_EVENT", eid : "", data});

        
        
        const r = await GFN.create_many(mid, data);

        
        // this will also be used as react state
        if(!r.success){
            for(let clone of clones){
                if(clone.id){
                    const meta_clone = produce(clone, (draft)=>{
                        if(!draft.__meta) draft.__meta = {};
                        draft.__meta.success = false;
                        draft.__meta.status = "CREATE_FAILED";
                        draft.__meta.errors = r.errors;
                    });
                    this.set(mid, clone.id, meta_clone as any);
                }
            }
            this.emit_message({type : "MESSAGE_EVENT", mid, level : "error", message : "CREATE_FAILED", eid : "", data});
            return null;
        }

        if(!r.data){
            console.warn("CREATE MANY NO DATA: ", r);
            return null;
        }


        // maybe a new id is assigned by the server
        for(let i=0; i<r.data.length; i++){
            if(r.data[i].id) clones[i].id = r.data[i].id;
        }


        for(let d of clones){
            if(d.id){
                const meta_clone = produce(d, (draft)=>{
                    if(!draft.__meta) draft.__meta = {};
                    draft.__meta.success = true;
                    draft.__meta.status = "CREATED";
                    draft.__meta.errors = undefined;
                });
                this.set(mid, d.id, meta_clone as any);
            }
        }


        
        return clones.filter(d=>d.id) as OBJ_WITH_ID[];
    }


    async update_one(mid: string, eid: string, data: any): DEFAULT_RES_SINGLE_P<any>{ // data is model data here, i.e. copy of M
        if(!data || !data.id) data = {id: eid};


        // make sure that you are removing all __props from the data before calling update_one
        const clone = JSON.parse(JSON.stringify(data));



        if(clone.id){
            const meta_clone = produce(clone, (draft)=>{
                if(!draft.__meta) draft.__meta = {};
                draft.__meta.status = "UPDATING";
            });
            // this.set(mid, clone.id, meta_clone);
        }
        this.emit_message({type : "MESSAGE_EVENT", mid, level : "log", message : "UPDATING", eid, data});



        // @warning: data will be modified gy g_fn.update_one when we prepare for update. Most likely __meta will be deleted, we should use immutable data for all operation, than this will not be a problem
        const update:T_UPDATES = {
            type: "DATA",
            id: eid,
            data: clone,
            prev: this.get(mid, eid)
        }
        const r = await GFN.update_one(mid, eid, update);
    
        if(!r.success){
            const failed_data = produce(clone, (draft)=>{
                if(!draft.__meta) draft.__meta = {};
                draft.__meta.success = false;
                draft.__meta.status = "UPDATE_FAILED";
                draft.__meta.errors = r.errors;
            }); 

            this.set(mid, eid, failed_data);
            this.emit_message({type : "MESSAGE_EVENT", mid, level : "error", message : "UPDATE_FAILED", eid, data : clone});

            return r;
        }

        const success_data = produce(clone, (draft)=>{
            if(!draft.__meta) draft.__meta = {};
            draft.__meta.success = true;
            draft.__meta.status = "UPDATED";
            draft.__meta.errors = undefined;
        });


        this.set(mid, eid, success_data);
        this.emit_message({type : "MESSAGE_EVENT", mid, level : "log", message : "UPDATED", eid, data : clone});
        return r;
    }

    async update_single_prop(mid: string, eid: string, updates: OBJECT_TYPE<any>){
        const r = await GFN.update_one_prop(mid, eid, updates);
        if(!r.success){
            this.emit_message({type : "MESSAGE_EVENT", mid, level : "error", message : "UPDATE_FAILED", eid, data : updates});
            return r;
        }
        else{
            this.emit_message({type : "MESSAGE_EVENT", mid, level : "log", message : "UPDATED", eid, data : updates});
            return r;
        }
    }

    async update_one_with_patches(model_id: string, eid: string, data: any, patches: Patch[]){
        // check
        // const ustore = this.patches[model_id];
        // if(!ustore) this.patches[model_id] = {};
        // const patches = this.patches[model_id][eid];
        // if(!patches) this.patches[model_id][eid] = [];
        // console.log("PATCHES : ", patches);

        // if (data.id && data.add && data.delete) {
        //     const entity = await this.get_one_entity(model_id, eid);
        //     if (!entity)
        //     return console.warn('Entity not found in GSTORE, this should not happen');

        //     const updated_entity = produce(entity, (draft) => {

        //         // first delete
        //         for (let key in data.delete) {
        //             if (!Array.isArray(draft[key])) {
        //                 delete draft[key];
        //                 continue;
        //             }
        //             else {
        //                 const arr = entity[key];

        //                 const idx = entity[key].findIndex((e)=>{
        //                     if(typeof(e) === "object"){
        //                         // e => {id: "1", name: "n0"}
        //                         // data.delete[key] => ["1", "2"]
        //                         return data.delete[key].includes(e.id);
        //                     }
        //                     else{
        //                         // e => "1"
        //                         // data.delete[key] => ["1", "2"]
        //                         return data.delete[key].includes(e);
        //                     }
        //                 });
        //                 if(idx === -1) continue;
        //                 draft[key].splice(idx, 1);
        //                 continue;
        //             }
        //         }

        //         // then add
        //         for (let key in data.add) {
        //             // 
        //             if (!Array.isArray(draft[key])) {
        //                 draft[key] = data.add[key];
        //                 continue;
        //             }
        //             else {
        //                 // qids = data.add[key]
        //                 for(let e of data.add[key]){
        //                     // check for duplicates. Fairly not necessary
        //                     const idx = draft[key].findIndex((d)=>{
        //                         if(typeof(d) === "object"){
        //                             return d.id === e;
        //                         }
        //                         else{
        //                             return d === e;
        //                         }
        //                     });
        //                     if(idx !== -1) continue; // already exits

        //                     draft[key].push(e);
        //                 }
        //                 continue;
        //             }
        //         }
        //     })

        //     this.emit_message({ type: "message", model_id, level: "log", message: "UPDATED", eid, data: updated_entity });
        //     this.set(model_id, eid, updated_entity);
        //     this.patches[model_id][eid] = [];
        //     return r;
        // }


        // remove patches on success
        // this.patches[model_id][eid] = [];
    }

    async delete_one(mid: string, eid: string){
        const data = this.get(mid, eid) || {id: eid}; // data may not be in GSTORE, but we still want to delete it


        const clone = produce(data, (draft)=>{
            if(!draft.__meta) draft.__meta = {};
            draft.__meta.status = "DELETING";
        }); 
        this.set(mid, eid, clone);
        this.emit_message({type : "MESSAGE_EVENT", mid, level : "log", message : "DELETING", eid, data});

        const r = await GFN.delete_one(mid, eid);

        if(!r.success){
            const failed_data = produce(data, (draft)=>{
                if(!draft.__meta) draft.__meta = {};
                draft.__meta.success = false;
                draft.__meta.status = "DELETE_FAILED";
                draft.__meta.errors = r.errors;
            });
            this.set(mid, eid, failed_data);
            this.emit_message({type : "MESSAGE_EVENT", mid, level : "log", message : "DELETE_FAILED", eid, data});
           
            return r;
        }

        if(!r.data){
            console.warn("DELETE ONE NO DATA: ", r);
           
            return r;
        }

        const success_data = produce(data, (draft)=>{
            if(!draft.__meta) draft.__meta = {};
            draft.__meta.success = true;
            draft.__meta.status = "DELETED";
            draft.__meta.errors = undefined;
        }); 
        this.set(mid, eid, success_data);
        this.emit_message({type : "MESSAGE_EVENT", mid, level : "log", message : "DELETED", eid, data});
        
        // Finally remove the entity from the store
        this.delete(mid, eid, data);

        return r;
    }

    // @todo: updating filters should be same as updating query for get_many
    // make a descision on which one to use
    //@deprecated
    // async update_filters(model_id: string, comp_id: string, filters: T_QUERY_PARAMS_FINAL){
    //     let fstore = this.query[model_id];
    //     if(!fstore){
    //         fstore = {};
    //         this.query[model_id] = fstore;
    //     }
    //     fstore[comp_id] = filters;

    //     // this.emit_filter({type: 'filter', model_id, comp_id, filters});
    // }




    set(mid: string, eid: string|number, data: OBJ_WITH_ID){
        let mstore = this.entity[mid];
        if(!mstore){
            mstore = {};
            this.entity[mid] = mstore;
        }
        mstore[eid] = data;
        this.emit_one({type:'ONE_ENTITY_EVENT', name: "set", mid, eid, data});

        if(!data) return; // may be we want to empty it


        // relations data - update only if it is not set
        this.set_relations(mid, data);
    }
    set_many(mid: string, params: T_QUERY_PARAMS, data: GET_MANY_RESULT, source: string[]){
        if(!params.qid) params.qid = this.generate_qid(mid, params);
        let lstore = this.list[mid];
        if(!lstore){
            lstore = {};
            this.list[mid] = lstore;
        }
        lstore[params.qid] = data;
        this.emit_many({type: 'MANY_ENTITY_EVENT', name: "set",  mid, qid: params.qid, data, source: [...source, "SET_MANY"]});

        // set entity
        data.data.forEach((e)=>{
            this.set(mid, e.id, e);
        })
    }

    // filters or query
    get_query(mid : string, cid : string) : T_QUERY_PARAMS|null {
        let fstore = this.query[mid];
        if(!fstore) {
            fstore = {};
            this.query[mid] = fstore;
        }

        return fstore[cid];
    }

    set_query(mid : string, qid : string, qparams : T_QUERY_PARAMS, source: string[]) {
               
        let qstore = this.query[mid];
        if(!qstore) {
            qstore = {};
            this.query[mid] = qstore;
        }
    
        // sets query, clears cache, and emits event
        const set_and_emit = () => {
            qstore[qid] = qparams;
            // query changes, remove cached data
            this.remove_cached_list(mid, qid);

            // let the component know that the query params changed, component will query again
            // Given that cache is removed, we will get the data from the server
            this.emit_query({qid: qid, mid, type : "QUERY_PARAMS_EVENT", name: "changed", data : qparams, source: [...source, "SET QUERY"]});
        }

        if(!qstore[qid]) return set_and_emit();
        const prev_query = qstore[qid];
        // check for changes in the queryparams, if there are no changes then donot set the query
        const changes = findDifferences (prev_query, qparams);
        // if there are changes : changes :  {[k:string]: any}
        if(Object.keys(changes).length) return set_and_emit();
        // no changes : changes: {}
        return;
        
    }

    set_draft(mid : string, did: string, data : OBJ_WITH_ID){
        let draft_store = this.draft[mid];

        // {mid: {}}
        if(!draft_store) {
            draft_store = {};
            this.draft[mid] = draft_store;
        }

        

        // {mid: {did: data}}
        draft_store[did] = data;
        this.emit_draft({type: "DRAFT_EVENT", name: "set", mid, did, data});

    }

    // data !== OBJ_WITH_ID so that we can update partial data
    update_draft(mid: string, did: string, data: {[k:string]: any}){
        if(EN_BROKEN_G_FN_LOGS.DRAFT){
            console.log("GSTORE: UPDATE DRAFT: ", mid, did, data);
        }

        if(!data || typeof(data) !== "object") return;

        const D = this.get_draft(mid, did);

        // First time update => new draft
        if(!D || !D.id){

            // needs to have id in the data => setting a new draft
            if(!data.id){
                console.warn("NO ID FOUND IN DRAFT UPDATE : ", D, data);
                
                // let's be generous and create an empty draft
                console.warn("CREATING A NEW DRAFT");
                data.id = GFN.get_ulid();
                // return;
            }

            const datawid = {...data, id: data.id}
            return this.set_draft(mid, did, datawid);
        }


        // succesive updates => partial update
        const ND = produce(D, (draft)=>{
            Object.assign(draft, data);
            draft.id = D.id; // incase id is changed in the data. ! Very unlikely !
        });

        this.set_draft(mid, did, ND);
    }

    clear_draft(model_id : string, comp_id : string, idx: number){
        delete this.draft?.[model_id]?.[comp_id]?.[idx];
    }




    // simply get if exits
    get(model_id: string, eid: string|number){ // id can be string or number
        const mstore = this.entity[model_id];
        if(!mstore) return null;
        const data = mstore[eid];
        if(!data) return null;
        return data;
    }
    exits(model_id: string, eid: string|number){
        const mstore = this.entity[model_id];
        if(!mstore) return false;

        const data = mstore[eid];
        if(!data) return false;

        return true;
    }


    get_draft(mid : string, did: string):OBJ_WITH_ID|null {

        // {mid: {did: data}}
        const draft_store = this.draft[mid];
        if(!draft_store) return null;

        // {cid: {idx: data}}
        const draft = draft_store[did];
        if(!draft) return null;

        if(!draft.id) console.warn("NO ID FOUND IN DRAFT : ", draft);

        return draft;
    }
    

    // given a data find all the relations and set them => ignore if already exits
    // ignore if exists because we might want to keep some meta properties
    set_relations(model_id: string, data: any, force?: boolean){
        // data is supposed to be an object, but still check it
        if(typeof(data) !== "object") return; // no relations data
        
        
        // console.log("SET RELATIONS : ", model_id, data);
        // example product with seller & bought_by
        // product = {
        //     id: "p0",
        //     name: "product 1",
        //     seller: {
        //         id: "s0",
        //         name: "seller 1"
        //     },
        //     bought_by: [
        //         {
        //             id: "u0",
        //             name: "user 1"
        //         },
        //         {
        //             id: "u1",
        //             name: "user 2"
        //         }
        //     ]
        // }

        const relations = Object.entries(data as {[k: string]: any}).filter(([k, v])=>{
            if(typeof(v) !== "object")  return false; // array or object
            if(k.startsWith("__"))      return false; // ignore __meta
            return true;
        });

        if(!relations.length) return; // no relations data

        
        const model = GFN.get_model(model_id);
        if(!model) return;

        for(let [k, v] of relations){
            const prop = model.props.find(p=>p.name === k);
            if(!prop) continue; // no prop found

            // prop.type => model_id of the relation
            const model_id = prop.type;
            if(!model_id) continue;

            // v is an array => many
            if(Array.isArray(v)){
                for(let e of v){
                    if(!e || !e.id) continue;
                    const exits = this.exits(model_id, e.id);
                    if(exits) continue;
                    this.set(model_id, e.id, e);
                }
            }
            else{
                if(!v || !v.id) continue;
                const exits = this.exits(model_id, v.id);
                if(exits) continue;
                this.set(model_id, v.id, v);
            }
        }
    }

    set_prop(mid: string, eid: string, prop_name: string, prop_value: any){
        const mstore = this.entity[mid];
        if(!mstore) return;
        const data = mstore[eid];
        if(!data) return;
        data[prop_name] = prop_value;
        this.emit_one({type: 'ONE_ENTITY_EVENT', name: "set_prop", props: [prop_name], mid, eid, data});
    }
    delete(mid: string, eid: string, data : any){
        const mstore = this.entity[mid];
        if(!mstore) return;
        delete mstore[eid];
        this.emit_one({type: 'ONE_ENTITY_EVENT', name: "delete", mid, eid, data});
    }

    delete_prop (mid: string, eid: string, prop_name: string){
        const mstore = this.entity[mid];
        if(!mstore) return;
        const data = mstore[eid];
        if(!data) return;
        delete data[prop_name];
        this.emit_one({type: 'ONE_ENTITY_EVENT', name: "delete_prop", props: [prop_name],  mid, eid, data});
    }

    // simply clear from the store : no emit event, no delete from server
    clear(model_id: string, eid: string){
        const mstore = this.entity[model_id];
        if(!mstore) return;
        delete mstore[eid];
    }


    set_warning(comp_id: string, warnings: {code: string, message: string}[]){
        this.warnings[comp_id] = warnings;
        // @todo: emit event
    }
    set_error(comp_id: string, errors: {code: string, message: string}[]){
        this.errors[comp_id] = errors;
        // @todo: emit event
    }




    // subscribe
    subscribe_one(mid: string, eid: string|number, fn: (e: ONE_ENTITY_EVENT_TYPE) => void){
        const sub = this.one_event.subscribe((e)=>{
            if(e.mid !== mid) return;
            if(eid && e.eid !== eid) return; // eid won't be there in case get_one happens via query attribute
            fn(e);
        });
        return sub;
    }

    subscribe_many(mid: string, qid: string, fn: (e: MANY_ENTITY_EVENT_TYPE) => void){
        const sub = this.many_event.subscribe((e)=>{
            if(e.mid !== mid)   return;
            if( e.qid !== qid)  return;
            fn(e);
        });
        return sub;
    }

    subscribe_filter(mid: string, qid: string, fn: (e: QUERY_PARAMS_EVENT_TYPE) => void){
        const sub = this.query_event.subscribe((e)=>{
            if(e.mid !== mid) return;
            if(e.qid !== qid) return;
            fn(e);
        });
        return sub;
    }

    subscribe_selected_entities(mid : string, fn : (e : SELECT_EVENT_TYPE) => void){
        const sub = this.select_event.subscribe((e)=>{
            if(e.mid !== mid) return;
            fn(e);
        });
        return sub;
    }

    subscribe_message(mid : string, fn : (e : MESSAGE_EVENT_TYPE) => void, eid? : string, cid? : string) {
        const sub = this.message_event.subscribe((e) => {
            if(e.mid !== mid) return;
            if(eid && e.eid !== eid) return;
            // if(comp_id && e.comp_id !== comp_id) return; // commented out because we don't have component id while emitting message events
            fn(e);
        });
        return sub;
    }

    subscribe_draft(mid : string, did : string, fn : (e : DRAFT_EVENT_TYPE) => void){
        const sub = this.draft_event.subscribe((e) => {
            if(e.mid !== mid) return;
            if(e.did !== did) return;
            fn(e);
        });
        return sub;
    }



    subscribe(fn: (e: ONE_ENTITY_EVENT_TYPE | MANY_ENTITY_EVENT_TYPE | QUERY_PARAMS_EVENT_TYPE | DRAFT_EVENT_TYPE | FILTER_EVENT_TYPE) => void){
        const sub = this.any_event.subscribe(fn);
        return sub;
    }

}

