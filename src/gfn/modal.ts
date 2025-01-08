import { T_INFO } from "@/broken-types/comp";
import AS from "./AS";

export const bro_open_modal = (e:any,M:any,INFO:T_INFO,props:any,idx:number) => {
    AS.GSTORE.showmodal = true;
}

export const bro_close_modal = (e:any,M:any,INFO:T_INFO,props:any,idx:number) => {
    AS.GSTORE.showmodal = false;
}