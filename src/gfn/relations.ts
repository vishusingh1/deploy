import { OBJ_WITH_ID } from "@/broken-types/g_type";
import AS from "./AS";
import { get_user_token_api } from "./user";
import { DEFAULT_RES_SINGLE_P } from "@/broken-types/default_res";


const set = async(params: {mid1: string, prop: string, eid1: string|number, eid2: string|number, data: any}) =>{
    const uat = get_user_token_api(true); // alert = true;
    if(!uat.success){
        return {success: false, errors: uat.errors};
    }

    const {user, api, token} = uat.data;
    const r =  await  api.relations.set(params);
    if(!r.success) return r;

    

    return r;
}


const set_with_user = async(params: {mid1: string, prop: string, eid1: string,  data: any,}) =>{
    const eid2 = AS.USER.profile.id;
    return await set({...params, eid2})
}

const get = async(params: {mid1: string, prop: string, eid1: number|string|(string|number)[], eid2?: number|string|(string|number)[]}):DEFAULT_RES_SINGLE_P<any> =>{
    const uat = get_user_token_api(true); // alert = true;
    if(!uat.success){
        return {success: false, errors: uat.errors};
    }
    const {user, api, token} = uat.data;
    const r = await  api.relations.get(params);

    if(!r.success) return r;

    // emit an event, if listener is added in the component, component sets M again
    // AS.GSTORE.emit_many({
    //     type: "MANY_ENTITY_EVENT",
    //     name: "set",
    //     mid: params.mid1,
    //     data: r.data,
    //     source:["RELFN.GET"]
    // })

    return r;


}

const get_user = async(params: {mid1: string, prop: string, eid1: number|string|(string|number)[]}) =>{

    const eid2 = AS.USER.profile?.id;
    return await get({...params, eid2});

}


const remove = async(params:{mid1: string, prop: string, eid1: string|number, eid2: string|number}) => {

    const uat = get_user_token_api(true); // alert = true;
    if(!uat.success){
        return {success: false, errors: uat.errors};
    }
    const {user, api, token} = uat.data;
    const r = await  api.relations.remove(params);
    if(!r.success) return r;
   

    return r
}

const toggle = async(params:{M: OBJ_WITH_ID, mid1: string, prop: string, eid2:number|string, data?:any}) => {

    // if M does not contain eid2 in prop, then set else remove

    const {M, prop, eid2, data, mid1} = params;
    const eid1 = M.id;

    if(!M[prop] || !Array.isArray(M[prop]) || !M[prop].includes(eid2)){
        const r =  await set({prop, eid1, eid2, data, mid1 })
        if(!r.success) return r;
        if(!M[prop]) M[prop] = [];
        M[prop].push(eid2);
        AS.GSTORE.emit_one({
            type:"ONE_ENTITY_EVENT",
            name:"update_prop",
            mid: params.mid1,
            data : {...M},
            eid : M.id,
            source:["RELFN.SET"]
        })
    }
    else{
        const r =  await remove({mid1, prop, eid1, eid2});
        if(!r.success) return r;
        const idx  = M[prop].findIndex(p => p === eid2);
        M[prop].splice(idx, 1);
        AS.GSTORE.emit_one({
            type:"ONE_ENTITY_EVENT",
            name:"update_prop",
            mid: params.mid1,
            data : {...M},
            eid : M.id,
            source:["RELFN.REMOVE"]
        })
    }
    


}



const RELFN = {
    set,
    get,
    set_with_user,
    get_user, 
    toggle
}




export default RELFN;