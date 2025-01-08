import authz from "../user/auth";
import { get_user_token_api } from "./user";
import { feedback } from "./utils";
import {GC} from "../global_state";



import { inc_tx } from "./db";
import AS from './AS';
import { DEFAULT_RES_SINGLE_P } from "../broken-types/default_res";
import { T_INFO } from "../broken-types/comp";
import toast from "react-hot-toast";
import UTILS from "@/utils";

export const delete_one = async (mid: string, id: string):DEFAULT_RES_SINGLE_P<any> => {
  
    const m = get_user_token_api(true); // alert = true;
    if(!m.success){
        return {success: false, errors: m.errors};
    }
    const {user, token, api} = m.data;
    
    //Doing auth based on roles in the frontend 
    const authr = authz.delete(mid, user);
    if(!authr.success) {
        return {success: false, errors: ["NO_PERMISSION", String(authr.errors)]};
    }



    const app_id = GC.APP_ID;
    const branch  = GC.BRANCH;
    const r = await api.entity.delete_one({app_id, model_id: mid,branch, token, delete_entity: {
        entity: {data: {id: id, with: "id"}}
    }});
    if (!r || !r.success) {
        
        console.warn(
            `Failed to delete one entity with id :  ${id}`,
            r.errors,
            app_id,
            mid,
            id
        );
    
        return {success: false, errors: r.errors};
    }


    return { success: true, data: {} };
}

export const bro_delete_one = async function (e:any, M:any, INFO: T_INFO, props: any, idx?:number): DEFAULT_RES_SINGLE_P<any> {
    toast.loading("Deleting...");

    const CS = UTILS.GET_STATE(INFO, "COMP");

    const mid = INFO.mid;

    CS.setStatus("deleting");

    const r = await AS.GSTORE.delete_one(mid, M.id);
    toast.dismiss();

    if(!r.success){
        CS.setStatus("delete-failed");
        toast.error("DELETION UNSUCCESSFULL");
    } 
    else {
        CS.setStatus("deleted");
        toast.success("DELETED");
    }

    return r;
}