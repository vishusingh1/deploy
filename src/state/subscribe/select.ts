import GFN from "@/GFN";

import BROKENGLOBAL from "@/BROKENGLOBAL";

import AS from "@/gfn/AS";
import { subscribe_selected_one } from "@/utils/selected-one";


export const so_init = async (p: any) => {
    const {INFO, subs, VARS, idx, M, SET_M, set_pre, set_post, props, SET_SM} = p;

    const mid = INFO.mid;
    const cid = INFO.cid;
    if(!mid || !cid) return console.warn("NO MODEL ID OR COMP ID FOUND");

    // remove all previous subscriptions
    subs.current.forEach(s=>s.unsubscribe()); subs.current = [];

    // selected item exits
    const SE = await AS.GSTORE.get_selected_first(mid); // this will not query the db
    if(SE){
        if(SE.id) SET_M(set_pre(SE))
    }
    else{
        // first time - just get one - This many not be selected one
        const GO = await GFN.bro_get_one({}, M, INFO, props, idx);
        if(GO.success) {
            const E = GO.data;
            if(E && E.id) SET_M(set_pre(E));
        }
    }



    // subscription - subscribe to selected entity
    subs.current.push(AS.GSTORE.subscribe_selected_entities(mid, async (e)=>{
        if(!e || !e.eids || !e.eids.length) return;
        const id = e.eids[0];
        if(!id) return;

        const data = await AS.GSTORE.get_one_by_id(mid, id); // even if there is no data we will receive an OBJ_WITH_ID
        SET_M(set_pre(data));
    }));



    // subscribe to selected entity
    subscribe_selected_one(INFO.mid, subs.current, SET_SM);

    return () => {
        // if(INITIALIZING.value) return; // don't unsubscribe if initializing. There is a strange react unmount bug happeing
        subs.current.forEach(s=>s.unsubscribe());
    }
}