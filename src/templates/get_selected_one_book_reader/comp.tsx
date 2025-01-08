import { useEffect, useRef, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
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

import { Subscription } from "rxjs";
import {observer} from "mobx-react-lite"


// EVERY IMPORT HAS TO BE ../module/file-name
import FallbackRender from "../../utils/ErrorBoundaryFallback";
import { expose_state } from "../../utils/expose-state"; 
import { subscribe_selected_one } from "../../utils/selected-one";

import GFN from '../../GFN';
import AS from "../../gfn/AS";
import UTILS from "@/utils/index";

import {OBJ_WITH_ID, T_INFO, T_QUERY_PARAMS} from "../types";
import { ReactReader } from 'react-reader'


// INJECT IMPORTS HERE
// b@imports









const EN_BROKEN_COMP_LOGS = window.EN_BROKEN_COMP_LOGS || {};




// local code - e.g sub components
// b@locals

const BROKEN_JSX = () => <div className="flex items-center justify-center text-gray-500 font-semibold bg-gray-100">DEFAULT SEL_ONE </div>






// b@comp-name
const COMP_NAME = (props: any) => {


	// RxJs Subscriptions - to be destroyed on unmount
	const subs = useRef<Subscription[]>([]);



	

	// FOR IS_MANY
	let idx = props.idx;   // also for protection from error when we might think is many but it's not
	let V = props.V || {}; // for protection from error

	// b@freeze
	const FREEZE = props.freeze;	// frozen data - so that we don't query db




	// STATES
	const MIDATA 						= FREEZE || props.M  || {}	// model initial data
	const [M,  SET_M ] 					= useState(MIDATA)			// model data
	const [SM, SET_SM] 					= useState(null);			// selected model data
	
	const [errors,		set_errors]		= useState([]);
	const [warnings,	set_warnings]	= useState([]);

	const [location, setLocation] = useState(null);
	
	// REPLACE INFO HERE - NEXT LINE after b@
	// b@info
	const INFO:T_INFO = { mid: "", model_name: "", prop_name: "", op: "get_many", cid: "comp_manyid", cidx:idx, SET_M, query: {type: "QP_ID", id: "", qid: ""}};

	
	
	// USER DEFINED STATES
    // b@states



	


    // REFS
    // USER DEFINED REFS
    // b@refs





	// QUERY
	// b@query
	const query:T_QUERY_PARAMS|null = null;


	// RELATION
	// b@relation
	let relation:{model_id: string, comp_id: string, prop_name: string}|null = null;






	// EFFECTS FOR GET_ONE
	useEffect(()=>{
		init();
		// initReactReader()
		return () => {
			subs.current.forEach(s=>s.unsubscribe());
		}
	}, []);


	// // FROM PARENT
	// useEffect(()=>{
	// 	GFN.bro_get_one(INFO, set_M, props);
	// }, [props]);



	

	// LOGS
	useEffect(()=>{
		if(EN_BROKEN_COMP_LOGS.MODEL_EFFECT){
			const MI = INFO.model_name.toUpperCase() + " : " + INFO.op.toUpperCase();
			console.log("MODEL CHANGED : " + MI + "   => ", "model", M, " props", props);
		}
	}, [M]);






	

    // USER DEFINED EFFECTS
    // b@effects



	// FUNCTIONS

	const set_pre = (M: OBJ_WITH_ID): OBJ_WITH_ID => {
		return M;
	}

	const set_post = (M: OBJ_WITH_ID): OBJ_WITH_ID => {
		return M;
	}

	const init = async () => {
		const mid = INFO.mid;
		const cid = INFO.cid;
		if(!mid || !cid) return console.warn("NO MODEL ID OR COMP ID FOUND");

		// remove all previous subscriptions
		subs.current.forEach(s=>s.unsubscribe()); subs.current = [];

		// selected item exits
		const SE = await AS.GSTORE.get_selected_first(mid); // this will not query the db
		if(SE){
			if(SE.id) SET_M(set_pre(SE))
		}
		else{
			// first time - just get one - This many not be selected one
			const E = await GFN.bro_get_one({}, M, INFO, props, idx);
			if(E && E.id) SET_M(set_pre(E));
		}



		// subscription - subscribe to selected entity
		subs.current.push(AS.GSTORE.subscribe_selected_entities(mid, async (e)=>{
			if(!e || !e.eids || !e.eids.length) return;
			const id = e.eids[0];
			if(!id) return;

			const data = await AS.GSTORE.get_one_by_id(mid, id); // even if there is no data we will receive an OBJ_WITH_ID
			SET_M(set_pre(data));
		}));



		// subscribe to selected entity
		subscribe_selected_one(INFO.mid, subs.current, SET_SM);
	}

	const onLocationChanged = (epubLocation) => {
		setLocation(epubLocation);
	};

	// const initReactReader = () => {
	// 	if(reactReaderRef.current) return;

	// 	const onload = () => {
	// 		// @ts-ignore
	// 		const ReactReader = window.ReactReader;
	// 		if (!ReactReader) return console.warn("ReactReader not found");
	// 		createReactReader(ReactReader);
	// 	}

	// 	GFN.add_script("react-reader-js", "https://unpkg.com/react-reader/umd/react-reader.min.js", onload);
	// 	GFN.add_style("react-reader-css", "https://unpkg.com/react-reader/dist/ReactReader.css", () => { })
	// }
	
    // // USER DEFINED FUNCTIONS
    // b@functions



	// STATEMENTS
	INFO.SET_M          = SET_M;
	INFO.query		  	= query || undefined;
	INFO.on_created     = props.on_created || props.INFO?.on_created;
	INFO.on_selected    = props.on_selected || props.INFO?.on_selected;
	INFO.prop_name      = props.prop_name || props.PM_PN || props.INFO?.prop_name; // inheritance

    // USER DEFINED STATEMENTS
    // b@statements




	// CONDITIONALS ATTRS
	const COND_ATTRS = {};
	//b@cond-attrs







	// DYNAMIC REACT STATES
	const REACT_STATES: {[name: string]: {state: any, set_state: any, defaultValue?: any}} = {};
    // b@dynamic-states
    // we are also using REACT_STATES to generate some dynamic state from html <state> tag, or from state attr

	expose_state(REACT_STATES, AS, INFO, "M", M, SET_M);
    // exposing this will help us in getting this data for debuging purpose



	// MAPPED DATA
	// b@mapped-data



	// USER CODE - Extra code written by user
	// b@user-code

	// b@user-code-end



	return (
		<ErrorBoundary fallbackRender={FallbackRender} onReset={(d) => { console.error(d) }}>
            <BROKEN_JSX />
		</ErrorBoundary>
	)
}

export default observer(COMP_NAME);