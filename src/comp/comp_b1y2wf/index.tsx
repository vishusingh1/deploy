
/**
 * THIS IS GENERATED CODE. Do not edit it. It will be overwritten when you generate the component again.
 * 
 * 
 * MIT License
 * Copyright (c) 2024 Broken Atom
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 * 
 */

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
import UTILITY_COMPS from "@/lib/comp/utility";
const Modal = UTILITY_COMPS.Modal;



import GFN from '../../GFN';
import AS from "../../gfn/AS";
import UTILS from "@/utils/index";

import {OBJ_WITH_ID, T_INFO, T_QUERY_PARAMS} from "../types";


// INJECT IMPORTS HERE
// b@imports








const EN_BROKEN_COMP_LOGS = window.EN_BROKEN_COMP_LOGS || {};




// local code - e.g sub components
// b@locals

const BROKEN_JSX = () => <div className="flex items-center justify-center text-gray-500 font-semibold bg-gray-100">DEFAULT GET_ONE </div>






// b@comp-name
const COMP_NAME = (props: any) => {

	// Only in main component. Keep a reference to navigate
	const navigate = useNavigate();
	AS.routernavigate = navigate;

	
	// RxJs Subscriptions - to be destroyed on unmount
	const subs = useRef<Subscription[]>([]);



	// FOR IS_MANY
	let idx = props.idx;   // also for protection from error when we might think is many but it's not
	let V = props.V || {}; // for protection from error

	
	// REPLACE INFO HERE - NEXT LINE after b@
	// b@info
const INFO: T_INFO  = { mid: "", cid: "comp_b1y2wf", idx: idx, cidx: idx, model_name: "", prop_name: props.pm_pn, op: ""};

	

	// DYNAMIC VARIABLES & FUNCTIONS
	const B		: any = {}; // contains actions and common functions
	const VARS	: any = {}; // contains variables
	const FNS	: any = {}; // contains functions

	
	// b@freeze



	// STATES
	const [M,  SET_M ] 	= useState(UTILS.GET_ONE_MIDATA ({VARS	, props}));		// model initial data
	const [SM, SET_SM]	= useState(UTILS.GET_SM_MIDATA  ({INFO	, props}));		// selected model data

	const CS = UTILS.GET_STATE(INFO, "COMP")		// local state 	- only for this comp
	const GS = AS.GSTORE.GLOBAL_STATE				// global state - shared  but only with this client in this frontend
	const SS = AS.GSTORE.SERVER_STATES				// server state - shared with evryone using this app



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



	// EFFECTS FOR GET_ONE
	useEffect(()=>{
		if(UTILS.DISABLE_INIT({VARS, props}, "go")) return;

		init();

		return () => {
			// if(INITIALIZING.value) return; // don't unsubscribe if initializing. There is a strange react unmount bug happeing
			subs.current.forEach(s=>s.unsubscribe());
		}
	}, []);



	// FROM PARENT
	// useEffect(()=>{
	// 	GFN.bro_get_one(INFO, set_M, props);
	// }, [props]);



	// SUBS TO SELECTED ONE
	useEffect(()=>subscribe_selected_one(INFO.mid, subs.current, SET_SM), []);

	

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



	const init = async ()=>{
		const mid = INFO.mid;
		const cid = INFO.cid;
		if(!mid || !cid) return console.warn("NO MODEL ID OR COMP ID FOUND");

		// remove all previous subscriptions
		subs.current.forEach(s=>s.unsubscribe()); subs.current = [];

		
		// subscribe to selected entity
		subscribe_selected_one(INFO.mid, subs.current, SET_SM);


		return () => {
			// if(INITIALIZING.value) return; // don't unsubscribe if initializing. There is a strange react unmount bug happeing
			subs.current.forEach(s=>s.unsubscribe());
		}
	}

    // USER DEFINED FUNCTIONS
    // b@functions



	// STATEMENTS
	INFO.SET_M          = SET_M;
	INFO.query		  	= VARS.query
	INFO.on_created     = props.on_created || props.INFO?.on_created;
	INFO.on_selected    = props.on_selected || props.INFO?.on_selected;

    // USER DEFINED STATEMENTS
    // b@statements




	// CONDITIONALS ATTRS
	const COND_ATTRS = {};
	//b@cond-attrs




	// MAPPED DATA
const MAPPED_DATA = {};
	// b@mapped-data


	// USER CODE - Extra code written by user
	// b@user-code

	// b@user-code-end


	// USER ACCESS - Wheather USER has access to this component - put this at last because we might want to (return null) here
	// b@user-access

	return (
		<ErrorBoundary fallbackRender={FallbackRender} onReset={(d) => { console.error(d) }}>

            <div b-type="main" b-parent="bfqg2m" b-id="b1y2wf" b-findex="a1" className="flex-1 p-6"  >
                
            <div b-type="div" b-parent="b1y2wf" b-id="b6nzgq" b-findex="a0" className="grid grid-cols-3 gap-6 mb-6"  >
                
            <div b-type="div" b-parent="b6nzgq" b-id="b9a1hl" b-findex="a0" className="p-4 bg-white rounded-lg shadow"  >
                
            <h3 b-type="h3" b-parent="b9a1hl" b-id="be1vsw" b-findex="a0" className="text-sm text-gray-500"  >
                Total Users
            </h3>
        

            <p b-type="p" b-parent="b9a1hl" b-id="bpbpm6" b-findex="a1" className="text-2xl font-semibold"  >
                1,230
            </p>
        
            </div>
        

            <div b-type="div" b-parent="b6nzgq" b-id="bijf56" b-findex="a1" className="p-4 bg-white rounded-lg shadow"  >
                
            <h3 b-type="h3" b-parent="bijf56" b-id="b3bl33" b-findex="a0" className="text-sm text-gray-500"  >
                Revenue
            </h3>
        

            <p b-type="p" b-parent="bijf56" b-id="bll57u" b-findex="a1" className="text-2xl font-semibold"  >
                $9,876
            </p>
        
            </div>
        

            <div b-type="div" b-parent="b6nzgq" b-id="b2wx5u" b-findex="a2" className="p-4 bg-white rounded-lg shadow"  >
                
            <h3 b-type="h3" b-parent="b2wx5u" b-id="bgw9fs" b-findex="a0" className="text-sm text-gray-500"  >
                Active Sessions
            </h3>
        

            <p b-type="p" b-parent="b2wx5u" b-id="bv4x9o" b-findex="a1" className="text-2xl font-semibold"  >
                56
            </p>
        
            </div>
        
            </div>
        

            <div b-type="div" b-parent="b1y2wf" b-id="b29yv6" b-findex="a1" className="grid grid-cols-3 gap-6"  >
                
            <div b-type="div" b-parent="b29yv6" b-id="bznksw" b-findex="a0" className="bg-white rounded-lg shadow p-6"  >
                
            <h3 b-type="h3" b-parent="bznksw" b-id="bpv3l2" b-findex="a0" className="text-lg font-bold mb-2"  >
                Recent Activities
            </h3>
        

            <ul b-type="ul" b-parent="bznksw" b-id="b0hc13" b-findex="a1" className="space-y-2"  >
                
            <li b-type="li" b-parent="b0hc13" b-id="bfb0aw" b-findex="a0" className="flex justify-between text-sm"  >
                
            <span b-type="span" b-parent="bfb0aw" b-id="b3bkir" b-findex="a0"  >
                User Login
            </span>
        

            <span b-type="span" b-parent="bfb0aw" b-id="bdr4ty" b-findex="a1" className="text-gray-500"  >
                2 min ago
            </span>
        
            </li>
        

            <li b-type="li" b-parent="b0hc13" b-id="bw4e8s" b-findex="a1" className="flex justify-between text-sm"  >
                
            <span b-type="span" b-parent="bw4e8s" b-id="bgglwn" b-findex="a0"  >
                New Order
            </span>
        

            <span b-type="span" b-parent="bw4e8s" b-id="b3jemc" b-findex="a1" className="text-gray-500"  >
                10 min ago
            </span>
        
            </li>
        

            <li b-type="li" b-parent="b0hc13" b-id="bq98f7" b-findex="a2" className="flex justify-between text-sm"  >
                
            <span b-type="span" b-parent="bq98f7" b-id="bjhi3y" b-findex="a0"  >
                System Update
            </span>
        

            <span b-type="span" b-parent="bq98f7" b-id="bc7pk7" b-findex="a1" className="text-gray-500"  >
                1 hour ago
            </span>
        
            </li>
        
            </ul>
        
            </div>
        

            <div b-type="div" b-parent="b29yv6" b-id="bnxxed" b-findex="a1" className="bg-white rounded-lg shadow p-6"  >
                
            <h3 b-type="h3" b-parent="bnxxed" b-id="bcsu4f" b-findex="a0" className="text-lg font-bold mb-2"  >
                Notifications
            </h3>
        

            <ul b-type="ul" b-parent="bnxxed" b-id="bdaiyc" b-findex="a1" className="space-y-2"  >
                
            <li b-type="li" b-parent="bdaiyc" b-id="bcha4t" b-findex="a0" className="flex items-center"  >
                
            <div b-type="div" b-parent="bcha4t" b-id="b0toxu" b-findex="a0" className="bg-blue-500 w-2 h-2 rounded-full mr-2"  >
                
            </div>
        

            <span b-type="span" b-parent="bcha4t" b-id="bsvwvr" b-findex="a1" className="text-sm"  >
                Server maintenance scheduled
            </span>
        
            </li>
        

            <li b-type="li" b-parent="bdaiyc" b-id="bbuwwi" b-findex="a1" className="flex items-center"  >
                
            <div b-type="div" b-parent="bbuwwi" b-id="bez72n" b-findex="a0" className="bg-green-500 w-2 h-2 rounded-full mr-2"  >
                
            </div>
        

            <span b-type="span" b-parent="bbuwwi" b-id="b485yx" b-findex="a1" className="text-sm"  >
                New user registered
            </span>
        
            </li>
        

            <li b-type="li" b-parent="bdaiyc" b-id="bsmwnl" b-findex="a2" className="flex items-center"  >
                
            <div b-type="div" b-parent="bsmwnl" b-id="bx0lbx" b-findex="a0" className="bg-red-500 w-2 h-2 rounded-full mr-2"  >
                
            </div>
        

            <span b-type="span" b-parent="bsmwnl" b-id="bhgy64" b-findex="a1" className="text-sm"  >
                Critical error detected
            </span>
        
            </li>
        
            </ul>
        
            </div>
        

            <div b-type="div" b-parent="b29yv6" b-id="bz2axr" b-findex="a2" className="bg-white rounded-lg p-6"  >
                
            <h3 b-type="h3" b-parent="bz2axr" b-id="btu4c0" b-findex="a0" className="text-lg font-bold mb-2"  >
                Messages
            </h3>
        

            <ul b-type="ul" b-parent="bz2axr" b-id="bvcvg9" b-findex="a1" className="space-y-2"  >
                
            <li b-type="li" b-parent="bvcvg9" b-id="btm8m9" b-findex="a0" className="flex justify-between text-sm"  >
                
            <span b-type="span" b-parent="btm8m9" b-id="b3p58f" b-findex="a0"  >
                John Doe
            </span>
        

            <span b-type="span" b-parent="btm8m9" b-id="bad007" b-findex="a1" className="text-gray-500"  >
                Hey, how's it going?
            </span>
        
            </li>
        

            <li b-type="li" b-parent="bvcvg9" b-id="bw7opm" b-findex="a1" className="flex justify-between text-sm"  >
                
            <span b-type="span" b-parent="bw7opm" b-id="bqnhf4" b-findex="a0"  >
                Jane Smith
            </span>
        

            <span b-type="span" b-parent="bw7opm" b-id="bkilov" b-findex="a1" className="text-gray-500"  >
                Meeting at 3 PM
            </span>
        
            </li>
        

            <li b-type="li" b-parent="bvcvg9" b-id="b9ez7n" b-findex="a2" className="flex justify-between text-sm"  >
                
            <span b-type="span" b-parent="b9ez7n" b-id="b1xwpn" b-findex="a0"  >
                Support
            </span>
        

            <span b-type="span" b-parent="b9ez7n" b-id="b0r60m" b-findex="a1" className="text-gray-500"  >
                Your ticket has been resolved
            </span>
        
            </li>
        
            </ul>
        
            </div>
        
            </div>
        
            </div>
        
		</ErrorBoundary>
	)
}

export default observer(COMP_NAME);