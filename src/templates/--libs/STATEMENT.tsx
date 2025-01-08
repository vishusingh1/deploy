
import { useEffect, useRef, useState } from "react";
import {OBJ_WITH_ID, T_INFO, T_QUERY_PARAMS} from "../types";



// THIS IS A META UTILITY TEMPLATE FOR STATEMENTS
// @see: readme.md


const COMP_STATEMENTS = (props: any) => {

	const [M,  SET_M ] 					= useState({});
	const INFO:T_INFO = { mid: "", model_name: "", prop_name: "", op: "", cid: "", cidx:0, SET_M };


    // DYNAMIC VARIABLES & FUNCTIONS
	const B		: any = {}; // contains actions and common functions
	const VARS	: any = {}; // contains variables
	const FNS	: any = {}; // contains functions
	

	

	// @BRO:LIBS:STATEMENTS--INFO:START
	// STATEMENTS
    INFO.SET_M          = SET_M;
    INFO.query		  	= VARS.query
    INFO.on_created     = props.on_created 	|| props.INFO?.on_created;
    INFO.on_selected    = props.on_selected || props.INFO?.on_selected;
    INFO.prop_name      = props.prop_name || props.PM_PN || props.INFO?.prop_name; // inheritance
	
    // @BRO:LIBS:STATEMENTS--INFO:END




	return (
		<div></div>
	)
}