// import { T_INFO } from "@/broken-types/comp";
// import {makeObservable, observable, reaction} from "mobx"
// import { Validation } from "./validation";
// import { STATE_STATE_TYPE } from "./types";


// export class BASE_STATE {
//     type: "COMP" | "GLOBAL" | "SERVER" | "" = "";

//     info: T_INFO

//     errors:     {code: string, messages: string[]}[]  = [];   
//     warnings:   {code: string, messages: string[]}[]  = [];


//     status: STATE_STATE_TYPE = "none";
    
    
    
//     allow: boolean = true;  // whether any operation is allowed
//     access: boolean = true; // whether the user has access to view this component, this will be set based on user login credentials
//     validation: {[prop: string]: Validation} = {};


//     constructor(info: T_INFO) {
//         this.info = info;


//         makeObservable(this, {
//             errors  : observable,
//             warnings: observable,
//             status  : observable,
//             allow   : observable,
//             access  : observable,
//         })


//         reaction(() => this.status, (status) => {
//             if(this.errors.length) this.allow = false;



//             // <button disabled={!allow}>CREATE</button>
//             // <button disabled={!CS.errors.length && !CS.warnings.length}>CREATE</button>
//         });
//     }


//     setValidation(json: any){
//         // this.validation = new Validation(json);
//     }

//     validate(draft: any){
//         if(!this.validation) return;
//         for(let k in this.validation){
//             const v = this.validation[k];
//             const value = draft[k];
//             const r = v.validate(value);
//             // push r.errors and r.warnings to errors and warnings
//             // if(r){
//             //     errors.push(...r.errors);
//             //     warnings.push(...r.warnings);
//             // }
//         }
//     }

// }