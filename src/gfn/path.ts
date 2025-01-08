import { T_QUERY_PARAMS } from "@/comp/types";
import AS from "./AS"
import { json5_parse, json_parse } from "./utils";

export const push_state_to_history = (state: any) => {
    const url = new URL(window.location.href);
    const prev_state = url.searchParams.get('state');
    if (prev_state === state) return;

    url.searchParams.set('state', state);
    history.pushState({}, state, url);
};
export const runtime_get_url_state = function () {
    const url = new URL(window.location.href);
    const state_str = url.searchParams.get('state');

    let state:any = {};
    if (state_str && state_str !== 'undefined') {
        const state_obj = json5_parse(state_str);
        if (state_obj) {
            state = state_obj;
        }
    }

    return state;
}; 
export const runtime_set_url_state = function () {
    const url = new URL(window.location.href);
    const state_str = url.searchParams.get('state');

    // @todo: re-write this

    // let state = {};
    // if (state_str && state_str !== 'undefined') {
    //     try {
    //         const state_obj = JSON.parse(state_str);
    //         state = state_obj;
    //     } catch (error) {
    //         console.warn('gencode: error parsing state from url, state => ', state_str);
    //     }
    // }

    // const url_state = AS.rx_url_state.getValue();

    // if(!state_str && url_state) {
    //     state = url_state;
    // }

    // AS.rx_url_state.next(state);
};



// GET QUERY FROM PATH
export const get_query_from_path = function (path?: string): {mid: string, q: T_QUERY_PARAMS, op: "go" | "gm" | "uo"}|undefined {
    if(!path) path = window.location.pathname; // always start with /
    const terms = path.split("/").map(t=>t.trim()).filter(t=>t);

    // DEFEULT PATH PROVIDED BY BROKENATOM
	// ----------------------------------
	// 1. /m/:mid/:bid   => go
    if(terms.length === 3 && terms[0] === "m"){
        const _mid = terms[1]; // model id or model name
        const _bid = terms[2];

        const r:{mid: string, q: T_QUERY_PARAMS, op: "go" | "gm"} = {
            mid: _mid,
            q: {
                type: "QP_ID",
                id: _bid,
                qid: _bid,
            },
            op: "go"
        }

        const ms = AS.APP.models;
        const model = ms.find(m=>m.id === _mid) || ms.find(m=>m.name === _mid);
        if(!model) return r;

        // Because _mid could be model id or model name. We have to find the actual model id
        r.mid = model.id;


        // _bid => could be entity id or filter. e.x: status:active
        if(_bid.includes(":")){
            const terms = _bid.split(":");
            if(terms.length !== 2) return r;
            const f_id = terms[0];

            const q:T_QUERY_PARAMS = {
                type: "QP_LEVEL2",
                qid: _bid,
                filters: {
                    id: "fg-"+f_id,
                    group_by:"and",
                    type: "group",
                    filters: {
                        [f_id] : {
                            id: f_id,
                            attr: terms[0],
                            op: "eq",
                            val: terms[1],
                        }
                    },
                },
                limit: 1,
            }
            r.q = q;
        }

        return r;
    }


    // 2. /m/:mid       => gm
    if(terms.length === 2 && terms[0] === "m"){
        const _mid = terms[0]; // model id or model name
        const r:{mid: string, q: T_QUERY_PARAMS, op: "gm"} = {
            mid: _mid,
            q: {
                type: "QP_LEVEL2",
                qid: "default",
                filters: undefined,    // @todo: get from url.query
                limit: 16,
            },
            op: "gm"
        }

        const ms = AS.APP.models;
        const model = ms.find(m=>m.id === _mid) || ms.find(m=>m.name === _mid);
        if(!model) return r;

        // Because _mid could be model id or model name. We have to find the actual model id
        r.mid = model.id;

        return r;
    }

	


	// ==================================
}