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



import GFN from '../../GFN';
import AS from "../../gfn/AS";
import UTILS from "@/utils/index";
import UTILITY_COMPS from "@/lib/comp/utility";


import {OBJ_WITH_ID, T_INFO, T_QUERY_PARAMS} from "../types";
import { subscribe_selected_one } from "../../utils/selected-one";
import fallbackRender from "../../utils/ErrorBoundaryFallback";
import { validate } from "@/gfn/create";




// INJECT IMPORTS HERE
// b@imports









const EN_BROKEN_COMP_LOGS = window.EN_BROKEN_COMP_LOGS || {};




// local code - e.g sub components
// b@locals

const BROKEN_JSX = () => <div className="flex items-center justify-center text-gray-500 font-semibold bg-gray-100">DEFAULT CREATE_ONE </div>






// b@comp-name
const COMP_NAME = (props: any) => {


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

	// STATES
	const [M,  SET_M ] 					= useState(props.M  || {})	// model data
	const [SM, SET_SM] 					= useState(UTILS.GET_SM_MIDATA ({INFO	, props}));			// selected model data
	
	const CS = UTILS.GET_STATE(INFO, "COMP")		// local state 	- only for this comp
	const GS = AS.GSTORE.GLOBAL_STATE				// global state - shared  but only with this client in this frontend
	const SS = AS.GSTORE.SERVER_STATES				// server state - shared with evryone using this app


	
	const[show_relation_selector, set_show_relation_selector] = useState(false);
	
	


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





	// EFFECTS FOR CREATE_ONE
	useEffect(()=>{
		init();

		return () => {
			if(INITIALIZING.value) return; // don't unsubscribe if initializing. There is a strange react unmount bug happeing
			subs.current.forEach(sub=>sub.unsubscribe());
		}
	},[]);


	useEffect(() => {
		//when the draft changes checking the validation of the data provided
		const is_valid = validate(INFO, INFO.mid);
		if(!is_valid.success) {
			console.error('validation failed',is_valid.errors.join(' '));
			CS.setStatus("validate-failed");
			return;
		}
		CS.setStatus("validated");
	},[M])
	

	

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
	const INITIALIZING = CS.get("INITIALIZING");

	const init = async () => {
		// DEFAULT GET_ONE INIT
		 if(INITIALIZING.value) return; INITIALIZING.set(true); // initialize only once

		CS.setStatus("loading");
		const destroy = await STATE_SUBSCRIBE.co_init({INFO, subs, VARS, M, SET_M, set_pre, set_post, props, SET_SM});
		CS.setStatus("none");

		INITIALIZING.set(false);

		// IF you want to modify the init function: simply copy the code inside co_init() and paste it here and modify however you want
		// DON'T modify the code inside co_init() directly. It's shared by many other create_one comps
		// Instead, copy it to here and modify


		// --- PASTE HERE -- your custom init code

		return destroy;
	
	}


	const on_relation_created = (prop_name:string, data:OBJ_WITH_ID, idx?:number) => {

		STATE_SUBSCRIBE.co_on_relation_created({VARS, prop_name, data, idx, INFO, set_show_relation_selector});
	
		// IF you want to modify this fn copy the code inside on_relation_created() and paste it here and modify however you want
	}

	const on_relation_selected = (prop_name:string, data:OBJ_WITH_ID, idx?:number) => {
		STATE_SUBSCRIBE.co_on_relation_selected({VARS, prop_name, data, idx, INFO, set_show_relation_selector});

		// IF you want to modify this fn copy the code inside on_relation_selected() and paste it here and modify however you want
	}

    // USER DEFINED FUNCTIONS
    // b@functions



	// STATEMENTS
	INFO.SET_M          = SET_M;

	// data from parent component. will be passed to child component after appending current component data
	INFO.COMP_DATAS 	= STATE_SUBSCRIBE.gen_comp_datas({INFO, props, idx});
	
	INFO.query		  	= VARS.query
	INFO.on_created     = on_relation_created || props.on_created || props.INFO?.on_created;
	INFO.on_selected    = on_relation_selected || props.on_selected || props.INFO?.on_selected;
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
		<ErrorBoundary fallbackRender={fallbackRender} onReset={(d) => { console.error(d) }}>
            <BROKEN_JSX />
		</ErrorBoundary>
	)
}

export default observer(COMP_NAME);