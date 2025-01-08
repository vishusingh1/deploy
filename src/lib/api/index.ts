import { util } from "zod";
import { G_TYPE } from "../../broken-types/g_type";
import STDLIB from "../../stdlib";

export const init = (G: G_TYPE)=>{
    console.log("INIT MODULE LIB/API: ");

    // YOU CAN change gfn.get_one to gfn.your_get_one
}




// If you want a different api replace it here
// const api: T_API = STDLIB.api;





// If you want a different auth replace it here
const auth = STDLIB.auth;


export default {
    init,
    api: STDLIB.api,
    auth,
    utils: STDLIB.utils,
}
