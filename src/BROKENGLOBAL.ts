// This file will be used for customising all global functions and actions

import actions from "./action";
import user from "./user";
import GFN from "./GFN";
import libapi from "./lib/api";
import STDLIB from "./stdlib";
import AS from "./gfn/AS";
import DEV_MODE from "./dev";
import { G_TYPE } from "./broken-types/g_type";


export const BROKENGLOBAL: G_TYPE = {
    fns: {},
    actions: [],
    // GFN: GFN,
    // AS: AS,
    // api: STDLIB.api
}


const init = async ()=>{
    console.log("INIT MODULE BROKENGLOBAL: ");



    // STDLIB.init(GFN.GET_GC().APP_ID);
    // window.broken.current = window.broken.online; // @decprecated: 

    


    actions.init(BROKENGLOBAL);
    user.init(BROKENGLOBAL);
    libapi.init(BROKENGLOBAL);



    DEV_MODE.init(BROKENGLOBAL);
}

export default {
    init
}

