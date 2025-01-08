import { T_INFO } from "@/broken-types/comp";
import { OBJ_WITH_ID } from "@/broken-types/g_type";
import GFN from "@/GFN";
import { generate_draft_id } from "@/utils/draft";
import { subscribe_selected_one } from "@/utils/selected-one";
import { MutableRefObject } from "react";
import { Subscription } from "rxjs";

import AS from "@/gfn/AS";



type T_INIT_CO = {
    INFO: T_INFO,
    subs: MutableRefObject<Subscription[]>,
    VARS: any,
    M: any,
    SET_M: any,
    SET_SM: any,
    props: any,
    set_pre: (M: OBJ_WITH_ID) => OBJ_WITH_ID,
    set_post: (M: OBJ_WITH_ID) => OBJ_WITH_ID,
    
}

// DEFAULT INIT FUNCTION - for GET_ONE
export const co_init = async (p: T_INIT_CO) => {
    const {INFO, subs, VARS, SET_M, set_pre, set_post, M, props, SET_SM} = p;
    const relation = VARS.relation; 


    // -----------//
    // -- @SUGGESTION: IF you want a different version of this for your own component, you can copy this code below and paste in your comp.tsx inside the init function
    // -- YOU CAN SIMPLY copy from down below. It will work. We are using same variable names inside the comp.tsx and here
    // ----------//

    const mid = INFO.mid;
    const cid = INFO.cid;
    if(!mid || !cid) return console.warn("NO MODEL ID OR COMP ID FOUND");



    // remove all previous subscriptions
    subs.current.forEach(s=>s.unsubscribe()); subs.current = [];



    // only for create one we generate new id
    // const id = GFN.get_ulid();

    const idx = props.idx || props.IDX; // @@todo: decide capital or small

    const did = generate_draft_id(cid, idx);


    // When draft changes - update the state - because this is not dependent on the entity id we we need this only once
    subs.current.push(AS.GSTORE.subscribe_draft(mid, did, (e)=>{
        const data = e.data;
        if(!data || !data.id) return;
        SET_M(set_pre(data));
    }));
    
    //When created change the draft id so that we can create a new entity
    subs.current.push(AS.GSTORE.subscribe((e)=>{
        if(e.mid !== mid) return;

        if(e.type !== "DRAFT_EVENT" || e.name !== "commited") return;

        //checking draft id
        if(did !== e.did) return;

        const data  = e.data;
        if(!data ) return;

        const DV = VARS.DV || {}; // {seller: AS.USER.profile.id}
        // {rel: AS.GSTORE.get_selected_first(mid).id}

        AS.GSTORE.update_draft(mid, e.did, {...DV, id: GFN.get_ulid()});
    }))


    // IF RELATION is true
    if(VARS.relation){
        subs.current.push(AS.GSTORE.subscribe_message(mid, (e) => {

            if(e.message !== "CREATED") return;

            // check for id
            if(!e.eid) return console.error("NO ENTITY ID IN MESSAGE : ", e);

            // when no relation -> top level form then clear the form
            if(!relation){
                const data = {id: GFN.get_ulid()};
                AS.GSTORE.set_draft(mid, did, data);
                SET_M(set_pre(data));
                return
            }


            // if relation exists, update the parent model draft
            

            //uodating rel prop in parent model through on_created fn

            const rel_created = props.on_created || props.INFO?.on_created;
            if(rel_created){
                // console.log("RELATION CREATED : ",props.PM_PN, e.data);
                rel_created(props.PM_PN, e.data);
            }

            // const rel_mid = relation.PM_MID;
            // const rel_cid = relation.PM_CID || props.INFO?.comp_id; // this is for parent component
            // const pdata = {[relation.PM_PN] : e.data}; // partial data for parent model
            // // pdata = {id, name, email}

            // // @todo: idx should be for parent component not for tvchis component
            // const pdid = generate_draft_id(rel_cid, idx);
            // AS.GSTORE.update_draft(rel_mid, pdid, pdata);
        }));
    }

    


    // FIRST TIME
    const draft = AS.GSTORE.get_draft(mid, did);
    if(draft){			// if draft exists, set it
        SET_M(set_pre(draft));
    }				
    else{ 				// if draft doesn't exist, create one, this will trigger set_M via subscription
        
        const DV = VARS.DV || {}; // {seller: AS.USER.profile.id}
        const data = {...DV, id: GFN.get_ulid()};
        AS.GSTORE.set_draft(mid, did, data);
    }


    // subscribe to selected entity
    subscribe_selected_one(INFO.mid, subs.current, SET_SM);



    return () => {
        // if(INITIALIZING.value) return; // don't unsubscribe if initializing. There is a strange react unmount bug happeing
        subs.current.forEach(s=>s.unsubscribe());
    }

}



export const co_on_relation_created = (p: {VARS: any, prop_name:string, data:OBJ_WITH_ID, idx?:number, INFO: T_INFO, set_show_relation_selector: (s:any)=>void}) => {
    const {prop_name, data, idx, VARS, INFO, set_show_relation_selector} = p;
    const relation = VARS.relation as { PM_MID: string, PM_CID: string, PM_PN: string } | null



    // if it's a relation then we need to update the parent model draft
    const mid = relation?.PM_MID || INFO.mid;
    const cid = relation?.PM_CID || INFO.cid;
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

export const co_on_relation_selected = (p: {VARS: any, prop_name:string, data:OBJ_WITH_ID, idx?:number, INFO: T_INFO, set_show_relation_selector: (s:any)=>void}) => {
    const {prop_name, data, idx, VARS, INFO, set_show_relation_selector} = p;


    const mid = INFO.mid;
    const cid = INFO.cid;
    if(!mid || !cid) return console.warn("NO MODEL ID OR COMP ID FOUND");
    const cidx = INFO.cidx;

    // update the draft
    const did = generate_draft_id(cid, cidx);

    AS.GSTORE.update_draft(mid, did, {[prop_name]: data});

    set_show_relation_selector(false);
}

// data from parent component. will be passed to child component after appending current component data
export const gen_comp_datas = (p: {INFO: T_INFO, props: any, idx: number}) => {
    const {INFO, props, idx} = p;
    return [...(props.COMP_DATAS||[]), { mid: INFO.mid, cid: INFO.cid, idx, model_name: INFO.model_name, prop_name: INFO.prop_name}]
}
        