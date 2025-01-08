import { co_init, co_on_relation_created, co_on_relation_selected, gen_comp_datas } from "./create";
import { gm_init, go_init } from "./get";
import { so_init } from "./select";
import { guo_init, show_prop_update, uo_init, uo_on_relation_created, uo_on_relation_selected, update_prop } from "./update";

const STATE_SUBSCRIBE = {
    gm_init,
    go_init,

    co_init,
    co_on_relation_created,
    co_on_relation_selected,
    gen_comp_datas,



    uo_init,
    uo_on_relation_created,
    uo_on_relation_selected,

    guo_init,
    show_prop_update,
    update_prop,


    so_init,

}

export default STATE_SUBSCRIBE;