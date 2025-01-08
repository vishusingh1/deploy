import { T_INFO } from "@/broken-types/comp";

import { COMP_STATE } from "@/state/comp";
import { GLOBAL_STATE } from "@/state/global";
import { SERVER_STATE } from "@/state/server";


import BROKENGLOBAL from "@/BROKENGLOBAL";
import AS from "@/gfn/AS";


// generate state id for COMP_STATE, GLOBAL_STATE, SERVER_STATE
export const gen_state_id = (info: T_INFO) => {
    return info.cid + "_" + info.cidx;
}

export const GET_STATE = (info: T_INFO, type: "COMP" | "GLOBAL" | "SERVER") => {
    const state_id = gen_state_id(info);
    if(type === "COMP"){
        let CS = AS.GSTORE.COMP_STATES[state_id];
        if(!CS) CS = new COMP_STATE(info);
        // adding CS  to the GSTORE
        AS.GSTORE.COMP_STATES[state_id] = CS;
        return  CS;

        // @rem: we are NOT destroying the comp state when component is destroyed
    }
    if(type === "GLOBAL"){
       return  AS.GSTORE.GLOBAL_STATE;
    }
    if(type === "SERVER"){
        return  AS.GSTORE.SERVER_STATES;
    }

    // default
    return new COMP_STATE(info);
}