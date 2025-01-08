
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
import BRO_comp_start from '../comp_start'; // b@gen:start // type: page, name: START, by: start
import BRO_comp_page_69s1n from '../comp_page_69s1n'; // b@gen:page_69s1n // type: page, name: second, by: page_69s1n
import data from './data.ts';
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
const INFO: T_INFO  = { mid: "", cid: "comp_main", idx: idx, cidx: idx, model_name: "", prop_name: props.pm_pn, op: ""};

	

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

            <div b-type="main" b-parent="ui" b-id="main" b-findex="a1" className="bg-white body-font" b-login="true"  >
                
            <div b-type="div" b-parent="main" b-id="menu" b-findex="a0" name="menu" className="min-h-[64px] w-full h-fit overflow-visible flex gap-4 items-center justify-center bg-[#FFFFFF]"  >
                
            <header b-type="header" b-parent="menu" b-id="bjfqd6" b-findex="a3" className="text-[--neutral-800] body-font w-full cursor-default"  >
                
            <div b-type="div" b-parent="bjfqd6" b-id="bwi9mc" b-findex="a0" className="container mx-auto p-4 md:flex-row items-center flex"  >
                
            <a b-type="a" b-parent="bwi9mc" b-id="b7ytey" b-findex="a0" className="flex flex-row text-[length:--h3] items-center text-[--neutral-800] hover:text-[--neutral-900] mb-4 md:mb-0 w-fit cursor-pointer" href="/"  >
                <img b-type="img" b-parent="b7ytey" b-id="b7vwxz" b-findex="a0" src={AS.APP.logo_url} alt="logo" className="w-8 h-8 mr-4" />

            <span b-type="span" b-parent="b7ytey" b-id="bq7q7e" b-findex="a1" className="whitespace-nowrap"  >
                {AS.APP.name}
            </span>
        
            </a>
        

            <div b-type="div" b-parent="bwi9mc" b-id="bjg4fg" b-findex="a1" className="ml-auto text-[length:--text-body] justify-center"  >
                
            <div b-type="div" b-parent="bjg4fg" b-id="bzsqis" b-findex="a0" className="flex flex-row items-center gap-4"  >
                
		{(()=>{
			const D = GFN.GET_ARRAY(GFN.GET(AS, ["PAGES"])); ;
			return D.map(
				(V, idx)=>{
					return (
            <nav b-type="nav" b-parent="bzsqis" b-id="buufum" b-findex="a0" className="flex flex-wrap items-center cursor-pointer" b-mapid={'buufum--' + (V.id || idx)} key={V.id || idx} >
                
            <div b-type="div" b-parent="buufum" b-id="bkqupy" b-findex="a0" className={UTILS.cn('px-2 rounded cursor-pointer hover:underline', {'text-[--primary-500] underline': AS.PAGE === V})} action="go-to-page" page-id={V.bid} onClick={async (e) => {
				
				
				
				e = {...e} // fix: e.currentTarget
				await GFN.bro_go_to_page(e, M, INFO, props, idx);
			}} b-mapid={'buufum--' + (V.id || idx)}  >
                {V.name}
            </div>
        
            </nav>
        )
				}
			)
		})()}
	
{ GFN.GET(AS, ["USER","IS_LOGGED_IN"]) && (<div b-type="div" b-parent="bzsqis" b-id="biokxc" b-findex="a1" className="bg-[--neutral-400] w-8 h-8 rounded-full mr-5 flex items-center justify-center border border-[--neutral-500]"  >
                
            <span b-type="span" b-parent="biokxc" b-id="bfgo2h" b-findex="a0" className="capitalize"  >
                {AS.USER.profile?.name?.charAt(0) || AS.USER.ddbuser?.name?.charAt(0) || "A"}
            </span>
        
            </div>) }
{ GFN.GET(AS, ["USER","IS_LOGGED_IN"]) && (<div b-type="div" b-parent="bzsqis" b-id="bh8j4s" b-findex="a2" className="text-[--error-500] hover:text-[--error-700] cursor-pointer" action="logout" onClick={async (e) => {
				
				
				
				e = {...e} // fix: e.currentTarget
				await GFN.bro_logout(e, M, INFO, props, idx);
			}}  >
                Logout
            </div>) }
            </div>
        
{ !AS.USER.IS_LOGGED_IN && (<div b-type="div" b-parent="bjg4fg" b-id="bxnr89" b-findex="a1" className="hover:text-[--neutral-900]" action="login" onClick={async (e) => {
				
				
				
				e = {...e} // fix: e.currentTarget
				await GFN.bro_email_login(e, M, INFO, props, idx);
			}}  >
                Login
            </div>) }
            </div>
        
            </div>
        
            </header>
        
            </div>
        

		<Routes>
			<Route path="/" element={<BRO_comp_start />} />
			
			{/* path: start, name:  */}
			<Route b-type="page" b-parent="pages" b-id="start" b-findex="a0" element={<BRO_comp_start />} path="start" />
			<Route b-type="page" b-parent="pages" b-id="start" b-findex="a0" element={<BRO_comp_start />} path="start"  />
		

			{/* path: second, name:  */}
			<Route b-type="page" b-parent="pages" b-id="page_69s1n" b-findex="a1" element={<BRO_comp_page_69s1n />} path="second" />
			<Route b-type="page" b-parent="pages" b-id="page_69s1n" b-findex="a1" element={<BRO_comp_page_69s1n />} path="page_69s1n"  />
		
		</Routes>
	
            </div>
        
		</ErrorBoundary>
	)
}

export default observer(COMP_NAME);