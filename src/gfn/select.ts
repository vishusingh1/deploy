import { get_attr_from_event } from "./events";



import GFN from "../GFN";
import { Subscription } from "rxjs";
import AS from './AS';
import { T_INFO } from "../broken-types/comp.js";
import toast from "react-hot-toast";
import { generate_draft_id } from "@/utils/draft.js";


const disable_select = (params: {e: any, M: any, V?:any, INFO: T_INFO, props: any, idx?: number}) => {
    const M = params.M || params.V;
    // don't select __freeze items
    if(M && M.__freeze){
        console.warn("CAN'T SELECT __freeze ITEM");
        return true;
    }

    return false;
}

export const bro_select_one = async function (e: any, M: any, INFO: T_INFO, props: any, idx?: number) {
    const disable = disable_select({e, M, INFO, props, idx});
    if(disable) return;


    
    let mid = get_attr_from_event(e, ["mid", 'model_id']) || INFO.mid;
    if(!mid) {
        toast.error("model Id not found Can't select item");
        return console.warn("model_id not found Can't select item");
    }

    if(!M || !M.id) {
        toast.error("M or M.id not found Can't select item");
        return console.warn("M or M.id not found Can't select item");
    }

    const multi = e?.shiftKey || false;

    console.log("SELECTING ITEM", M);

    AS.GSTORE.set_selected_eid(mid, M.id, multi);

    const name = M.name || M.id?.substring(0, 8);
    // toast.success(`Selected: ${name}`);

    if (props.on_selected && typeof props.on_selected === 'function'){
        props.on_selected(e, M, INFO, props, idx);
    }
}

export const select_one = async (params: {e: any, M: any, V: any, INFO: T_INFO, props: any, idx?: number}) => {
    const {e, M, V, INFO, props, idx} = params;
    return await bro_select_one(e, M, INFO, props, idx); 
}
export const is_selected = async (params: {mid: string, M: any, V: any, idx?: number}) => {
    const {mid} = params;
    const M = params.M || params.V;
    return AS.GSTORE.is_selected({mid, M});
}


export const get_selected_entity_id = function (e: any, M: any, INFO: T_INFO, props: any, idx?: number) {
    const mid = INFO.mid;
    if(!mid) {
        console.warn("NO MODEL ID FOUND FROM INFO TO GET SELECTED ENTITY ID");
        return null;
    }

    const selected = AS.GSTORE.get_selected_eids(mid);
    if(!selected || !selected.length){
        console.warn("NO SELECTED ENTITY FOUND");
        return null
    }

    return selected[0];

    // @why @when will we want this
    // if(INFO.query === "{[user].id}") {
    //     return GFN.AS.user?.id;
    // }
}


// @deprecated
// export const bro_subs_for_get_selected_one = async function (INFO) {

//     if(!INFO.model_id) {
//         console.warn("model_id not found");
//         return;
//     }

//     const set_M = INFO.set_M;
//     if(!set_M) return console.warn("set_M not found", INFO);

//     const SUB_ID = INFO.comp_id + "_get_selected_one"; // make a unique id
//     remove_subs(SUB_ID);



//     add_sub(SUB_ID,
//         GFN.AS.rx_selected_entity.subscribe((selected) => {
//             if (!selected) return;

//             const se = selected[INFO.model_id];
//             if (!se) return;
//             set_M(se);
//         })
//     );

//     return () => remove_subs(SUB_ID);
// }

// export const bro_subs_for_selected_entity = async function (set_selected_M, INFO) {
//     const subs:Subscription[] = [];

//     subs.push(AS.rx_selected_entity.subscribe((entity_kv)=>{
//         if(!entity_kv) return;
//         const M = entity_kv[INFO.model_id];
//         set_selected_M(M);
//     }));

//     return ()=>{
//         subs.forEach(s=>s.unsubscribe());
//     }
// }