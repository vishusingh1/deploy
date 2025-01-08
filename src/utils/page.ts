import { T_INFO } from "@/broken-types/comp";
import BG from "@/BROKENGLOBAL";
import GFN from "@/GFN";
import AS from "@/gfn/AS";
import { Subscription } from "rxjs";

export const select_page_on_init = (INFO: T_INFO) => {
    // select page
    AS.PAGES.forEach(p=>{

        // we are adding comp_ to the comp id in compiler
        if(INFO.cid.replace("comp_", "") === p.bid){
            AS.setPage(p);
            return;
        }
    });
}

export const setup_page_change_on_p = (subs: Subscription[]) => {
    subs.forEach(s => s.unsubscribe());

    const on_key_up = (e: KeyboardEvent) => {
        if (e.key === "p" || e.key === "P") {
            if (GFN.is_event_in_editing_mode(e)) return;
            GFN.runtime_select_next_page(e.key === "P");
        }
    };

    window.addEventListener("keyup", on_key_up);


    return () => {
        window.removeEventListener("keyup", on_key_up);
        subs.forEach((s) => s.unsubscribe());
    };
}

const UTILS_PAGE = {
    select_page_on_init,
    setup_page_change_on_p
}

export default UTILS_PAGE;
