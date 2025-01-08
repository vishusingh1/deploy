import { GC } from "../global_state";
import { cn } from "./cn";
import { DISABLE_INIT, GET_MANY_MIDATA, GET_ONE_MIDATA, GET_SM_MIDATA } from "./comp";
import { generate_draft_id, generate_query_id } from "./draft";
import { select_page_on_init } from "./page";
import { GET_STATE } from "./state";


const UTILS = {
    cn,

    select_page_on_init,
    GET_STATE,
    GET_MANY_MIDATA,
    GET_ONE_MIDATA,
    GET_SM_MIDATA,
    DISABLE_INIT,

    generate_query_id,
    generate_draft_id,

    // FallbackRender,
    // OnReset
}
export default UTILS;