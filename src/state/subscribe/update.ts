import { T_INFO, T_RELATION_OBJ } from "@/broken-types/comp";
import { OBJ_WITH_ID } from "@/broken-types/g_type";
import GFN from "@/GFN";
import { generate_draft_id } from "@/utils/draft";
import { subscribe_selected_one } from "@/utils/selected-one";
import { MutableRefObject } from "react";
import { Subscription } from "rxjs";
import { T_UPDATES } from "../../broken-types/update";


import BROKENGLOBAL from "@/BROKENGLOBAL";

import AS from "@/gfn/AS";


type T_INIT_UO = {
    INFO: T_INFO,
    subs: MutableRefObject<Subscription[]>,
    VARS: any,
    idx: number,
    M: any,
    SET_M: any,
    SET_SM: any,
    props: any,
    set_pre: (M: OBJ_WITH_ID) => OBJ_WITH_ID,
    set_post: (M: OBJ_WITH_ID) => OBJ_WITH_ID, 
}

export const uo_init =  async (p: T_INIT_UO) => {
    const {INFO, subs, VARS, idx, M, SET_M, SET_SM, props, set_pre, set_post} = p;

    const mid = INFO.mid;
    const cid = INFO.cid;
    if(!mid || !cid) return console.warn("NO MODEL ID OR COMP ID FOUND");


    // remove all previous subscriptions
    subs.current.forEach(s=>s.unsubscribe()); subs.current = [];


    // this makes the draft ready and replaces the subscription for set_M when draft changes
    const set_draft = (D: OBJ_WITH_ID) => {
        // it will be done inside the subscribe_draft function, but we do this for redundancy
        SET_M(set_pre(D));
        
        
        const did = generate_draft_id(cid, idx);
        // Make it ready for update
        AS.GSTORE.set_draft(mid, did, D);
    }


    // UPDATE - GET ONE
    const GO = await GFN.bro_get_one({}, M, INFO, props, idx);
    if(GO.success) {
        const E = GO.data;
        if(E && E.id){
            set_draft(E);
        }
    }

    // UPDATE - SELECTED ONE
    else {
        // selected item exits
        const SE = await AS.GSTORE.get_selected(mid); // this will not query the db
        if(SE && SE.length){
            const E = SE[0];
            if(E.id) set_draft(E);
        }



        // subscription - subscribe to selected entity - and set as draft
        subs.current.push(AS.GSTORE.subscribe_selected_entities(mid, async (e)=>{
            const SE = await AS.GSTORE.get_selected_first(mid);
            if(!SE || !SE.id) return;
            const clone = JSON.parse(JSON.stringify(SE));
            const clone_with_meta = add_meta_info_to_draft(clone);
            set_draft(clone_with_meta); // can call set draft here - will not cause infinite loop
        }));
    }



    // When draft changes - update the state - because this is not dependent on the entity id we we need this only once
    const did = generate_draft_id(cid, idx);
    subs.current.push(AS.GSTORE.subscribe_draft(mid, did, (e)=>{
        const data = e.data;
        if(!data || !data.id) return;
        SET_M(set_pre(data));
    }));


    // subscribe to selected entity
    subscribe_selected_one(INFO.mid, subs.current, SET_SM);


    return () => {
        // if(INITIALIZING.value) return; // don't unsubscribe if initializing. There is a strange react unmount bug happeing
        subs.current.forEach(s=>s.unsubscribe());
    }
}




type T_INIT_GUO = {
    INFO: T_INFO,
    subs: MutableRefObject<Subscription[]>,
    VARS: any,
    idx: number,
    M: any,
    SET_M: any,
    SET_SM: any,
    props: any,
    set_pre: (M: OBJ_WITH_ID) => OBJ_WITH_ID,
    set_post: (M: OBJ_WITH_ID) => OBJ_WITH_ID, 
}

// DEFAULT INIT FUNCTION - for GET_UPDATE_ONE
export const guo_init = async (p: T_INIT_GUO) => {
    const {INFO, subs, VARS, SET_M, set_pre, set_post, M, props, idx, SET_SM} = p;

    // -----------//
    // -- @SUGGESTION: IF you want a different version of this for your own component, you can copy this code below and paste in your comp.tsx inside the init function
    // -- YOU CAN SIMPLY copy from down below. It will work. We are using same variable names inside the comp.tsx and here
    // ----------//


    const mid = INFO.mid;
    const cid = INFO.cid;
    if(!mid || !cid) return console.warn("NO MODEL ID OR COMP ID FOUND");


    // remove all previous subscriptions
    subs.current.forEach(s=>s.unsubscribe()); subs.current = [];


    // this makes the draft ready and replaces the subscription for set_M when draft changes
    const set_draft = (D: OBJ_WITH_ID) => {
        // it will be done inside the subscribe_draft function, but we do this for redundancy
        SET_M(set_pre(D));
        
        
        const did = generate_draft_id(cid, idx);
        // Make it ready for update
        AS.GSTORE.set_draft(mid, did, D);
    }


    // UPDATE - GET ONE
    const GO = await GFN.bro_get_one({}, M, INFO, props, idx);
    if(GO.success) {
        const E = GO.data;
        if(E && E.id){
            set_draft(E);
        }
    }
    // UPDATE - SELECTED ONE
    else {
        // selected item exits
        const SE = await AS.GSTORE.get_selected(mid); // this will not query the db
        if(SE && SE.length){
            const E = SE[0];
            if(E.id) set_draft(E);
        }



        // subscription - subscribe to selected entity - and set as draft
        subs.current.push(AS.GSTORE.subscribe_selected_entities(mid, async (e)=>{
            const SE = await AS.GSTORE.get_selected_first(mid);
            if(!SE || !SE.id) return;
            set_draft(SE); // can call set draft here - will not cause infinite loop
        }));
    }



    // When draft changes - update the state - because this is not dependent on the entity id we we need this only once
    const did = generate_draft_id(cid, idx);
    subs.current.push(AS.GSTORE.subscribe_draft(mid, did, (e)=>{
        const data = e.data;
        if(!data || !data.id) return;
        SET_M(set_pre(data));
    }));



    // subscribe to selected entity
    subscribe_selected_one(INFO.mid, subs.current, SET_SM);



    return () => {
        subs.current.forEach(s=>s.unsubscribe());
    }

}


export const uo_on_relation_created = (p: {VARS: any, prop_name:string, data:OBJ_WITH_ID, idx?:number, INFO: T_INFO, set_show_relation_selector: (s: any)=>void}) => {
    const {VARS, prop_name, data, idx, INFO, set_show_relation_selector} = p;
    const {relation} = VARS;


    const REL = relation as T_RELATION_OBJ | null;
    if(!REL) return console.warn("RELATION NOT FOUND");

    //if it's a relation then we need to update the parent model draft
    const mid = REL?.PM_MID || INFO.mid;
    const cid = REL?.PM_CID || INFO.cid;
    if(!mid || !cid) return console.warn("NO MODEL ID OR COMP ID FOUND");

    const cidx = INFO.cidx;

    // generate draft io
    const did = generate_draft_id(cid, cidx);
    console.log('updating rel prop using on_rel_created: ', prop_name, mid, did, data);
    // update the draft
    AS.GSTORE.update_draft(mid, did, {[prop_name]: data});

    // update the state
    set_show_relation_selector(false);
}

export const uo_on_relation_selected = (p: {VARS: any, prop_name:string, data:OBJ_WITH_ID, idx?:number, INFO: T_INFO, set_show_relation_selector: (s: any)=>void}) => {
    const {VARS, prop_name, data, idx, INFO, set_show_relation_selector} = p;

    const mid = INFO.mid;
    const cid = INFO.cid;
    if(!mid || !cid) return console.warn("NO MODEL ID OR COMP ID FOUND");
    const cidx = INFO.cidx;

    // update the draft
    const did = generate_draft_id(cid, cidx);
    console.log('updating rel prop using on_rel_selected: ', prop_name, data.id, mid, did, data)
    AS.GSTORE.update_draft(mid, did, {[prop_name]: data});

    // update the state
    set_show_relation_selector(false);
}




export const show_prop_update = (p: {e: any, set_show_update_popup: (s: any)=>void, set_prop_to_update: (s: any)=>void}) => {
    const {e, set_show_update_popup, set_prop_to_update} = p;

    set_show_update_popup(true);

    const target = e?.target;
    if(!target) {
        console.warn("NO TARGET FOUND");
        set_prop_to_update("")
        return;
    }
    const prop_name = target.getAttribute("pname");
    if(!prop_name) {
        console.warn("NO PROP NAME FOUND");
        set_prop_to_update("")
        return;
    };
    set_prop_to_update(prop_name);
}


export const update_prop = async (p: {e: any, prop_to_update: string, M: any, INFO: T_INFO}) => {
    const {e, prop_to_update, M, INFO} = p;

    console.log("UPDATING PROP", prop_to_update);
    const prop_name = prop_to_update;
    if(!prop_name) return console.warn("NO PROP NAME FOUND");

    const model_id = INFO.mid;
    if(!M || !M.id) return console.warn("M || M.id not found Can't update item", M);

    const eid = M.id;
    const data = M[prop_name];
    if(!data) return console.warn("NO DATA FOUND TO UPDATE", data);


    const r = await AS.GSTORE.update_one(model_id, M.id, M);
    if(!r.success) console.warn('update failed: ', r);
    return r;
}

 

//adding meta info to draft for update
const add_meta_info_to_draft = (D: OBJ_WITH_ID) => {
    if(!D || !D.id) return D;
    const neglected_props = ["id", "created_at", "created_by", "updated_at", "updated_by"];
    for(let [k, v] of Object.entries(D)){
        if(neglected_props.includes(k)) continue;
        if(typeof(v) === "object" && v.url){
            const meta = D.__meta || {};
            meta.props = meta.props || {};
            meta.props[k] = meta.props[k] || {};
            meta.props[k].progress = 'done';
            D.__meta = meta;
        } else if (Array.isArray(v)){
            for(let e of v){
                if(typeof(e.v) === "object" && e.v.url){
                    const meta = D.__meta || {};
                    meta.props = meta.props || {};
                    meta.props[k] = meta.props[k] || [];
                    meta.props[k].push({progress: 'done'});
                    D.__meta = meta;
                }
                
            }

        }
    }
    
    return D;
}