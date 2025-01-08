import { T_INFO } from "@/broken-types/comp";
import {action, makeObservable, observable, reaction} from "mobx"
import { Validation } from "./validation";
import { STATE_STATE_TYPE } from "./types";

export class OBS_VALUE {
    value: any;
    constructor(value: any){
        this.value = value;
        makeObservable(this, {
            value: observable,
            set: action,
        })
    }

    set(v: any){
        this.value = v;
    }
}

export class BASE_STATE {
    type: "COMP" | "GLOBAL" | "SERVER" | "" = "";

    state: {[name: string]: OBS_VALUE} = {};

    errors:     {code: string, messages: string[]}[]  = [];   
    warnings:   {code: string, messages: string[]}[]  = [];


    status: STATE_STATE_TYPE = "none";
    
    
    
    allow: boolean = true;  // whether any operation is allowed
    access: boolean = true; // whether the user has access to view this component, this will be set based on user login credentials
    validation: {[prop: string]: Validation} = {};


    constructor() {


        makeObservable(this, {
            errors  : observable,
            warnings: observable,
            status  : observable,
            allow   : observable,
            access  : observable,

        })


        reaction(() => this.status, (status) => {
            if(this.errors.length) this.allow = false;



            // <button disabled={!allow}>CREATE</button>
            // <button disabled={!CS.errors.length && !CS.warnings.length}>CREATE</button>
        });
    }


    setValidation(json: any){
        // this.validation = new Validation(json);
    }

    setStatus(status: STATE_STATE_TYPE){
        this.status = status;
    }

    validate(draft: any){
        if(!this.validation) return;
        for(let k in this.validation){
            const v = this.validation[k];
            const value = draft[k];
            const r = v.validate(value);
            // push r.errors and r.warnings to errors and warnings
            // if(r){
            //     errors.push(...r.errors);
            //     warnings.push(...r.warnings);
            // }
        }
    }


    get selected(){
        return false;
    }

    set selected(v: boolean){
        this.selected = v;
    }


    set(name: string, value: any, params?: any):OBS_VALUE{
        const existing = this.state[name];
        if(existing){
            existing.set(value);
            return existing;
        }

        // first time
        const obs = new OBS_VALUE(value);
        this.state[name] = obs;

        return obs;
    }

    get(name: string, params?: any): OBS_VALUE{

        // if it isn't there create and send a default (false) value
        return (this.state[name] || this.set(name, false, params));
    }

}