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
import { subscribe_selected_one } from "../../utils/selected-one";
import { generate_draft_id } from "../../utils/draft";
import { expose_state } from "../../utils/expose-state";
import fallbackRender from "../../utils/ErrorBoundaryFallback";




import GFN from '../../GFN';
import AS from "../../gfn/AS";
import UTILS from "@/utils/index";
import UTILITY_COMPS from "@/lib/comp/utility";


import {OBJ_WITH_ID, T_INFO, T_QUERY_PARAMS} from "../types";
import { T_UPDATES } from "../../broken-types/update";
import { T_RELATION_OBJ } from "@/broken-types/comp";



// INJECT IMPORTS HERE
// b@imports







const EN_BROKEN_COMP_LOGS = window.EN_BROKEN_COMP_LOGS || {};




// local code - e.g sub components
// b@locals

const BROKEN_JSX = () => <div className="flex items-center justify-center text-gray-500 font-semibold bg-gray-100">DEFAULT UPDATE_ONE </div>






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
	const [M,  SET_M ] 		= useState(props.M  || {})	// model data
	const [SM, SET_SM]		= useState(UTILS.GET_SM_MIDATA ({INFO	, props}));		// selected model data
	
	const CS = UTILS.GET_STATE(INFO, "COMP")		// local state 	- only for this comp
	const GS = AS.GSTORE.GLOBAL_STATE				// global state - shared  but only with this client in this frontend
	const SS = AS.GSTORE.SERVER_STATES				// server state - shared with evryone using this app



	//State to toggle relation selector
	const [show_relation_selector, set_show_relation_selector] = useState(false);
	
	
	

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






	// EFFECTS FOR UPDATE_ONE
	useEffect(()=>{
		// @todo: do freeze for update_one
		init();

		return () => {
			if(INITIALIZING.value) return; // don't unsubscribe if initializing. There is a strange react unmount bug happeing
			subs.current.forEach(sub=>sub.unsubscribe());
		}
	}, []);


	// FROM PARENT - useEffect(... [props])

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
	const INITIALIZING = CS.get("INITIALIZING");

	const init = async () => {
		if(INITIALIZING.value) return; INITIALIZING.set(true); // initialize only once

		CS.setStatus("loading");
		const destroy = await STATE_SUBSCRIBE.uo_init({INFO, subs, VARS, idx, M, SET_M, SET_SM, props, set_pre, set_post});
		CS.setStatus("none");
		
		INITIALIZING.set(false);

		return destroy;
	}


	//adding meta info to draft for update
	const add_meta_info_to_draft = (D: OBJ_WITH_ID) => {
		if(!D || !D.id) return D;
		const neglected_props = ["id", "created_at", "created_by", "updated_at", "updated_by"];
		for(let [k, v] of Object.entries(D)){
			if(neglected_props.includes(k)) continue;
			if(typeof(v) === "object" && V.url){
				const meta = D.__meta || {};
				meta.props = meta.props || {};
				meta.props[k] = meta.props[k] || {};
				meta.props[k].progress = 'done';
				D.__meta = meta;
			} else if (Array.isArray(v)){
				for(let e of v){
					if(typeof(e.v) === "object" && e.v.url){
						const meta = D.__meta || {};
						meta.props = meta.props || {};
						meta.props[k] = meta.props[k] || [];
						meta.props[k].push({progress: 'done'});
						D.__meta = meta;
					}
					
				}

			}
		}
		
		return D;
	}
	// @question: where are we using this????

	

    // USER DEFINED FUNCTIONS
    // b@functions

	const on_relation_created = (prop_name:string, data:OBJ_WITH_ID, idx?:number) => {
		STATE_SUBSCRIBE.uo_on_relation_created({VARS, prop_name, data, idx, INFO, set_show_relation_selector});
	}

	const on_relation_selected = (prop_name:string, data:OBJ_WITH_ID, idx?:number) => {
		STATE_SUBSCRIBE.uo_on_relation_selected({VARS, prop_name, data, idx, INFO, set_show_relation_selector});
	}


	// STATEMENTS
	INFO.SET_M          = SET_M;
	INFO.query		  	= VARS.query;
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