import {GC} from "../global_state";
import { get_token } from "./user";


const SSR_MODULE_URL = "https://datascript.brokenatom.io/api/v1/module";

export const call_server_side_comp = async function (INFO, props) {
    if(!INFO || INFO.set_M) return console.warn("INFO || INFO.set_M not found", INFO, props);

    const set_M = INFO.set_M;

    const APP_ID = GC.APP_ID;
    const MODEL_ID = INFO.model_id;
    const TOKEN = get_token();

    const COMP_ID = "hello";
    const FN_ID = "say_hello";


    const call = async (M)=>{
        const URL = `${SSR_MODULE_URL}?app_id=${APP_ID}&model_id=${MODEL_ID}&token=${TOKEN}`;

        const body = {
            module: COMP_ID,
            function: FN_ID,
            params : {
                M : {
                    data: {
                        id: M.id
                    },
                    model_id: MODEL_ID
                }
            }
        }

        const errors:string[] = [];

        const r = await fetch(URL, {
            method: "POST",
            body: JSON.stringify(body),
        }).catch(e=> {
            errors.push(String(e));
        });


        if(!r || errors.length) return console.warn("Unable to call server side component", errors, r);

        const json = await r.json().catch(e=> {
            errors.push(String(e));
        });

        if(!json || errors.length) return console.warn("Unable to call server side component", errors, json);

        if(!json.success) return console.warn("Unable to call server side component", json.errors);

        const data = json.data;

        console.log("data : ", data);
    }

    set_M(M=>{
        call(M);
        return M;
    })
}