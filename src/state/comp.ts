import { T_INFO } from "@/broken-types/comp";
import {makeObservable, observable, reaction} from "mobx"
import { Validation } from "./validation";
import { STATE_STATE_TYPE } from "./types";
import { BASE_STATE } from "./base";

export class COMP_STATE extends BASE_STATE {

    info: T_INFO


    selected_entities: any[] = []; // selected entity 
    constructor(info: T_INFO) {
        super();

        this.type = "COMP";
        this.info = info;

    }

}