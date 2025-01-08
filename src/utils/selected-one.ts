import { Subscription } from "rxjs";
import GFN from "../GFN";
import AS from "../gfn/AS";

export const subscribe_selected_one = (mid: string, subs: Subscription[],  set_selected: any) => {
    // subscription - subscribe to selected entity
    subs.push(AS.GSTORE.subscribe_selected_entities(mid, async (e)=>{
        if(!e || !e.eids || !e.eids.length) return;
        const id = e.eids[0];
        if(!id) return;

        const data = await AS.GSTORE.get_one_by_id(mid, id); // even if there is no data we will receive an OBJ_WITH_ID
        if(data && data.id) set_selected(data);
    }));
}