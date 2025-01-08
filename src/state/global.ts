import { T_INFO } from "@/broken-types/comp";
import {action, isObservable, makeAutoObservable, makeObservable, observable, reaction} from "mobx"
import { Validation } from "./validation";
import { STATE_STATE_TYPE } from "./types";
import { BASE_STATE } from "./base";



export class GLOBAL_STATE  extends BASE_STATE {


    constructor() {
        super();

        makeObservable(this, {
            state: observable,  // BASE_STATE is already observable. It will crash if we do makeAutoObservable(this);
        });
        this.type = "GLOBAL";
    }

    
}