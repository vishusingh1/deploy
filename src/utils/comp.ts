import { T_INFO } from "@/broken-types/comp";
import GFN from "@/GFN";

// get initial model data for get_many
export const GET_MANY_MIDATA = (p: {VARS: any, props: any}) => {
    const FREEZE = p.VARS?.FREEZE;
    const MIDATA = FREEZE 
        ? GFN.GET_ARRAY(FREEZE) 
        : GFN.GET_ARRAY(p.props.M);
    return MIDATA;
}

// get initial selected model data 
export const GET_SM_MIDATA = (p: {INFO: T_INFO, props: any}) => {
    // @todo: implement - get selected data
}


export const GET_ONE_MIDATA = (p: {VARS: any, props: any}) => {
    // const MIDATA 						= FREEZE || props.M  || {}	// model initial data
    const FREEZE = p.VARS?.FREEZE;
    const MIDATA = FREEZE || p.props.M || {};
    return MIDATA;
}

// When true: we will not call the init() function
export const DISABLE_INIT = (p:{VARS: any, props: any}, op: "gm" | "go" | "cm" | "co") => {
    const FREEZE = p.VARS?.FREEZE;
	if(FREEZE) return true;


    // get_many
    if(op === "gm"){
        const MIDATA: any = GET_MANY_MIDATA(p);
        if(MIDATA?.__freeze) return true;
        return false;
    }

    // get_one
    if(op === "go"){
		// if(MIDATA) SET_M(MIDATA); // we don't need to set it // @deprecated

		// if FREEZE is set then we will not query db
        const FREEZE = p.VARS?.FREEZE;
		if(FREEZE) return true;

        // freeze data might come from parent component  
        const MIDATA = GET_ONE_MIDATA(p);
		if(MIDATA?.__freeze) return true;

        return false;
    }
}

