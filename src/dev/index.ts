// Only usefull for dev mode
// we will use these fns to interact with the app

import { G_TYPE } from "@/broken-types/g_type";
import GFN from "../GFN";
import AS from "../gfn/AS";


import DEV_MODE_USER from "./user";

const init = async (G: G_TYPE) => {
    console.log("DEV_MODE INIT ");

     // @ts-ignore @deprecated 
     window.g_fn = GFN; GFN.AS = AS;
    
     // DEV MODE
 
     // @ts-ignore
     window.GFN = GFN; window.AS = AS;

    // @ts-ignore
    window.BROKENGLOBAL = G;

}

const DEV_MODE = {
    init,
    USER: DEV_MODE_USER
}

// @ts-ignore
window.DEV_MODE = DEV_MODE;

export default DEV_MODE;



// use the relay to interact with the app through DEV_MODE