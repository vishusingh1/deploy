// WE WILL SUBSCRIBE TO GET_MANY EVENT IN THE COMPONENT

import { T_INFO } from "@/broken-types/comp";
import { OBJ_WITH_ID } from "@/broken-types/g_type";
import GFN from "@/GFN";
import UTILS from "@/utils";
import { subscribe_selected_one } from "@/utils/selected-one";
import { MutableRefObject } from "react";
import { Subscription } from "rxjs";

import AS from "@/gfn/AS";
import { generate_query_id } from "@/utils/draft";
import { OBJECT_TYPE } from "@/broken-types/default_res";
import RELFN from "@/gfn/relations";

type T_INIT_GM = {
    INFO: T_INFO,
    subs: MutableRefObject<Subscription[]>,
    idx: number,
    VARS: any,
    M: any,
    SET_M: any,
    SET_SM: any,
    props: any,
    set_pre: (M: OBJ_WITH_ID[]) => OBJ_WITH_ID[],
    set_post: (M: OBJ_WITH_ID[]) => OBJ_WITH_ID[],
    
}


// DEFAULT INIT FUNCTION - for GET_MANY
export const gm_init = async (p: T_INIT_GM) => {
    const {INFO, subs, idx, VARS, SET_M, set_pre, set_post, M, props, SET_SM} = p;
    const query = VARS.query;

    
    // -----------//
    // -- @SUGGESTION: IF you want a different version of this for your own component, you can copy this code below and paste in your comp.tsx inside the init function
    // -- YOU CAN SIMPLY copy from down below. It will work. We are using same variable names inside the comp.tsx and here
    // -- DON'T MODIFY CODE HERE - It's shared
    // ----------//
    
    
    const mid = INFO.mid;
    const cid = INFO.cid;
    if(!mid || !cid) return console.warn("NO MODEL ID OR COMP ID FOUND");


    // remove all previous subs
    subs.current.forEach(s=>s.unsubscribe()); subs.current = [];


    


    
    // default query id
    const qid = INFO.query?.qid || generate_query_id(cid, idx);
    if(INFO.query) INFO.query.qid = qid;
    //STORE QUERY IN GSTORE	
    if(query) AS.GSTORE.set_query(mid, qid, query, ["GET MANY COMP"]);



    // query id provided by user || default query id
    subs.current.push(AS.GSTORE.subscribe_many(mid, qid, (e)=>{
        const data = e.data.data || [];
        SET_M(set_pre(data));
    }));

    // @question: what about url qid 





    // on create, delete, update
    subs.current.push(AS.GSTORE.subscribe((e)=>{
        if(e.mid !== mid) return;

        
        // on delete query again // @todo: this can be optimised further by checking if the deleted entity is in the list of this data
        if(e.type === "ONE_ENTITY_EVENT" && e.name === "delete"){
            // remove models cached list // this will remove for all components
            AS.GSTORE.remove_cached_list(mid);
            GFN.bro_get_many({}, M, INFO, props, idx);
            return;
        }


        // on update // this can be optimised further by checking if the updated entity is in the list of this data
        if(e.type === "ONE_ENTITY_EVENT" && e.name === "update"){
            GFN.bro_get_many({}, M, INFO, props, idx);
            return;
        }

        if(e.type === "ONE_ENTITY_EVENT" && e.name === "create"){
            // remove models cached list // this will remove for all components
            AS.GSTORE.remove_cached_list(mid);
            GFN.bro_get_many({}, M, INFO, props, idx);
            return;
        }


        // filter event
        // if there is a filter which is emitted, listens to it and updates the query for this comp
        if(e.type === "FILTER_EVENT"){
            const filters 	= e.data;
            const op 		= e.op;
            // get the filter and update 
            GFN.update_query_filters({INFO, filters, op, idx, props, M});
            return;
        }
        
    }));


    // on filter change => subs
    subs.current.push(AS.GSTORE.subscribe((e)=>{

        if(e.type !== "QUERY_PARAMS_EVENT") return;
        if(e.mid !== mid || e.qid !== qid) return;
        // QP changed => again query
        // e.data has the new query!
        INFO.query = e.data;
        GFN.bro_get_many({}, M, INFO, props, idx);
    }));


    // query first time
    const GMR = await GFN.bro_get_many({}, M, INFO, props, idx);
    if(GMR && GMR.data && Array.isArray(GMR.data)){
        SET_M(set_pre(GMR.data));
    }



    // subscribe to selected entity
    subscribe_selected_one(INFO.mid, subs.current, SET_SM);


    return () => {
        // if(INITIALIZING.value) return; // don't unsubscribe if initializing. There is a strange react unmount bug happeing
        subs.current.forEach(s=>s.unsubscribe());
    }
}




type T_INIT_GO = {
    INFO: T_INFO,
    subs: MutableRefObject<Subscription[]>,
    idx: number,
    VARS: any,
    M: any,
    SET_M: any,
    SET_SM: any,
    props: any,
    set_pre: (M: OBJ_WITH_ID) => OBJ_WITH_ID,
    set_post: (M: OBJ_WITH_ID) => OBJ_WITH_ID,
    
}

// DEFAULT INIT FUNCTION - for GET_ONE
export const go_init = async (p: T_INIT_GO) => {
    const {INFO, subs, idx, VARS, SET_M, set_pre, set_post, M, props, SET_SM} = p;


    // -----------//
    // -- @SUGGESTION: IF you want a different version of this for your own component, you can copy this code below and paste in your comp.tsx inside the init function
    // -- YOU CAN SIMPLY copy from down below. It will work. We are using same variable names inside the comp.tsx and here
    // ----------//


    const mid = INFO.mid;
    const cid = INFO.cid;
    if(!mid || !cid) return console.warn("NO MODEL ID OR COMP ID FOUND");


    // remove all previous subscriptions
    subs.current.forEach(s=>s.unsubscribe()); subs.current = [];

    
    // first time
    // console.log('GET_ONE INIT', INFO, props, idx,M);
    const GR = await GFN.bro_get_one({}, M, INFO, props, idx);
    if(!GR.success) return console.warn("ERROR IN GET_ONE", GR);

    const E = GR.data;
    if(!E || !E.id) return console.warn("ERROR IN GET ONE DATA", E);
    SET_M(set_pre(E));
    // we may not have id so after this we will have id


    // subscription
    subs.current.push(AS.GSTORE.subscribe_one(mid, E.id, (e)=>{
        const data = e.data;
        SET_M(set_pre(data));
    }));


    // subscription - subscribe to selected entity - and set as draft
    subs.current.push(AS.GSTORE.subscribe_selected_entities(mid, async (e)=>{
        const SE = await AS.GSTORE.get_selected_first(mid);
        if(!SE || !SE.id) return;
        // set_draft(SE); // can call set draft here - will not cause infinite loop
        
        // relation selected
        const rsel = INFO.on_selected;
        if(rsel){
            let prop_name = props.PM_PN || INFO.prop_name;
            // @gopiboppudi: we can't just call this we have to check that prop_name is available
            
            if(!prop_name){
                // if we still can't find prop_name we can use COMP_DATAS to get it
                // get the nearest prop_name
                INFO.COMP_DATAS?.reverse().some(d=>{
                    if(d.prop_name){
                        prop_name = d.prop_name;
                        return true;
                    }
                    return false;
                })

            } 
            
            if(!prop_name){
                console.warn("NO PROP_NAME FOUND IN INFO TO SET RELATION SELECTED");
                return;
            }
            
            rsel(prop_name, SE);		// @now: we are using comp-ref which may not have actual PM_PN info
            // rsel(props.PM_PN, SE); 	// @prev: when only temp-comp was used

        }
    }));



    // subscribe to selected entity
    subscribe_selected_one(INFO.mid, subs.current, SET_SM);



    return () => {
        // if(INITIALIZING.value) return; // don't unsubscribe if initializing. There is a strange react unmount bug happeing
        subs.current.forEach(s=>s.unsubscribe());
    }
}



type T_GM_REL_INIT = {
    INFO: T_INFO,
    subs: MutableRefObject<Subscription[]>,
    idx: number,
    VARS: any,
    M1: OBJ_WITH_ID[]
    M2: OBJ_WITH_ID
    prop_name: string
}


const assign_rels_to_M = (params:{M: OBJ_WITH_ID[], rels: OBJECT_TYPE<any>[], pname: string}) => {
    const {M, rels, pname} = params;

    M.map(m => {
        const eid1  =    m.id;
        const r     =   rels.filter(r => r.eid1 === eid1);
        if(!r.length) return;
        const eid2  =   r.map(r => r.eid2);
        if(!m[pname] || !Array.isArray(m[pname]) ){
            m[pname] = eid2;
        }
        else{
            m[pname].push(...eid2);
        }
    })

}


export const gm_rel_init = async (p: T_GM_REL_INIT) => {
    const {prop_name, subs} = p;

    subs.current.push(AS.GSTORE.many_event.subscribe(async (e)=>{

        if(e.type !== "MANY_ENTITY_EVENT") return;

        const src = "RELFN.GET"; // this helps in stopping infinite loop
        const source = e.source; 
        if(source.includes(src)) return; // stop infinite loop


        // get relations from list of eid1 to eid2
        const r = await RELFN.get({mid1: p.INFO.mid, prop: prop_name, eid1: e.data.data.map(m => m.id), eid2: p.M2.id});
        if(!r.success) return;
        const rel_data  = r.data;

    
        // M1 => map and assign
        assign_rels_to_M({M: e.data.data, rels: rel_data, pname: prop_name});

        
        AS.GSTORE.set_many(p.INFO.mid, e.data.params, e.data, [...source, src]);
    }))
}