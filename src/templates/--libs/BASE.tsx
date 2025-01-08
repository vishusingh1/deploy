import { useEffect, useRef, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import {observer} from "mobx-react-lite"

// @BRO:META:SECTION-IMPORT-COMMON:START
import {
	Routes,
	Route,
	Link,
	useNavigate,
} from "react-router-dom";

import { 
    motion, 
    AnimatePresence 
} from "framer-motion";
// @BRO:META:SECTION-IMPORT-COMMON:START



import { Subscription } from "rxjs";
import STATE_SUBSCRIBE from "@/state/subscribe";



// EVERY IMPORT HAS TO BE ../module/file-name
import FallbackRender from "../../utils/ErrorBoundaryFallback";
import { expose_state } from "../../utils/expose-state"; 
import { subscribe_selected_one } from "../../utils/selected-one";


import GFN from '../../GFN';
import AS from "../../gfn/AS";
import UTILS from "@/utils/index";
import UTILITY_COMPS from "@/lib/comp/utility";
const Modal = UTILITY_COMPS.Modal;


import {OBJ_WITH_ID, T_INFO, T_QUERY_PARAMS} from "../types";



// INJECT IMPORTS HERE
// b@imports



// local code - e.g sub components
// b@locals

const BROKEN_JSX = () => <div className="flex items-center justify-center text-gray-500 font-semibold bg-gray-100">DEFAULT GET_ONE </div>






// b@comp-name
const COMP_NAME = (props: any) => {

    // @BRO:LIBS:BASE--IDX-INFO-VARS:START 
        // FOR IS_MANY
        let idx = props.idx;   // also for protection from error when we might think is many but it's not
        let V = props.V || {}; // for protection from error

        
        // REPLACE INFO HERE - NEXT LINE after b@
        // b@info
        const INFO:T_INFO = { mid: "", model_name: "", prop_name: "", op: "", cid: "", cidx:idx};


        // DYNAMIC VARIABLES & FUNCTIONS
        const B		: any = {}; // contains actions and common functions
        const VARS	: any = {}; // contains variables
        const FNS	: any = {}; // contains functions
    // @BRO:LIBS:BASE--IDX-INFO-VARS:END
	

	
    
    
    
    // @BRO:LIBS:BASE--STATE:START 
        // b@freeze

        // STATES
        const [M,  SET_M ] 	= useState(UTILS.GET_ONE_MIDATA({VARS	, props}));		// model initial data
        const [SM, SET_SM]	= useState(UTILS.GET_SM_MIDATA ({INFO	, props}));		// selected model data

        
        const CS = UTILS.GET_STATE(INFO, "COMP")		// local state 	- only for this comp
        const GS = AS.GSTORE.GLOBAL_STATE				// global state - shared  but only with this client in this frontend
        const SS = AS.GSTORE.SERVER_STATES				// server state - shared with evryone using this app
    // @BRO:LIBS:BASE--STATE:END 

	
	
	
	
    // @BRO:LIBS:BASE--COMPILER-FILL:START
        // USER DEFINED STATES
        // b@states


        // REFS
        // USER DEFINED REFS
        // b@refs


        // BRO DATA - with jsoncode - after states, INFO and before query
        // b@bro-data


        // QUERY
        // b@query


        // RELATION
        // b@relation
    // @BRO:LIBS:BASE--COMPILER-FILL:END 




	// EFFECTS FOR GET_ONE
	useEffect(()=>{
		if(UTILS.DISABLE_INIT({VARS, props}, "go")) return;
		
		init();

		return () => {
			// if(INITIALIZING.value) return; // don't unsubscribe if initializing. There is a strange react unmount bug happeing
			subs.current.forEach(s=>s.unsubscribe());
		}
	}, []);




	// @BRO:LIBS:LOGGER--PROP-CHANGED

	// @BRO:LIBS:LOGGER



    // USER DEFINED EFFECTS
    // b@effects



	// FUNCTIONS
	const set_pre = (M: OBJ_WITH_ID): OBJ_WITH_ID => {
		return M;
	}

	const set_post = (M: OBJ_WITH_ID): OBJ_WITH_ID => {
		return M;
	}


	// RxJs Subscriptions - to be destroyed on unmount
	const subs = useRef<Subscription[]>([]);


	const init = async ()=>{};


    // USER DEFINED FUNCTIONS
    // b@functions



	// STATEMENTS
	// @todo: @BRO:LIBS:<======>STATEMENTS--INFO     We could use the LIBS  
	INFO.SET_M          = SET_M;
	INFO.query		  	= VARS.query
	INFO.on_created     = props.on_created || props.INFO?.on_created;
	INFO.on_selected    = props.on_selected || props.INFO?.on_selected;
	INFO.prop_name      = props.prop_name || props.PM_PN || props.INFO?.prop_name; // inheritance

    // USER DEFINED STATEMENTS
    // b@statements




	// CONDITIONALS ATTRS
	const COND_ATTRS = {};
	//b@cond-attrs





	// MAPPED DATA
	// b@mapped-data


	// USER CODE - Extra code written by user
	// b@user-code

	// b@user-code-end


	// USER ACCESS - Wheather USER has access to this component - put this at last because we might want to (return null) here
	// b@user-access


	return (
		<ErrorBoundary fallbackRender={FallbackRender} onReset={(d) => { console.error(d) }}>
            <BROKEN_JSX />
		</ErrorBoundary>
	)
}

export default observer(COMP_NAME);