import { T_INFO } from "@/broken-types/comp";
import {makeObservable, observable, reaction} from "mobx"
import { Validation } from "./validation";
import { STATE_STATE_TYPE } from "./types";
import { BASE_STATE, OBS_VALUE } from "./base";
import SSTATE_API from "@/stdlib/api/server-state";
import AS from "@/gfn/AS";

// Server state
export class SERVER_STATE  extends BASE_STATE {


    constructor() {
        super();

        this.type = "SERVER";
    }

    async sset(key: string, value: any, params?: any){
        const token = AS.USER.token;
        if(!token) return console.warn("NO TOKEN FOUND");

        const r = await SSTATE_API.set({
            token,
            req: {
                level: "app",
                state: value
            }
        });

        // varify r

        // set

        return r;
    }

    // @todo: once we do a get. Keep a listner and update the observable so that wheneven the server state changes. All variable also changes

    set(name: string, value: any, params?: any):OBS_VALUE{
        this.status = "updating";

        this.sset(name, value, params).then((r)=>{
            this.status = "updated";
            super.set(name, value, params);
        });
        
        return super.set(name, value, params);
    }
    
    get(name: string, params?: any): OBS_VALUE {
        this.status = "fetching";
    
        // fetch 
        // @todo: implement fetch
    
        this.status = "fetched";
        return super.get(name, params);
    }

}