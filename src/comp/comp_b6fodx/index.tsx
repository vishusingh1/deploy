
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
const INFO: T_INFO  = { mid: "vjnou", cid: "comp_b6fodx", idx: idx, cidx: idx, model_name: "user", prop_name: props.pm_pn, op: "create_one"};



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
const MAPPED_DATA = {};
	// b@mapped-data





	// USER CODE - Extra code written by user
	// b@user-code

	// b@user-code-end


	
	// USER ACCESS - Wheather USER has access to this component - put this at last because we might want to (return null) here
	// b@user-access

	return (
		<ErrorBoundary fallbackRender={fallbackRender} onReset={(d) => { console.error(d) }}>

            <div b-type="model" b-parent="b685zn" b-id="b6fodx" b-findex="a0" mid="vjnou" name="user" op="create_one" className="w-full flex flex-col bg-white p-2 rounded shadow" comp-temp="create_one"  >
                
            <div b-type="div" b-parent="b6fodx" b-id="b6jwr4" b-findex="a0" name="title" className="text-2xl font-medium text-gray-600 text-left"  >
                CREATE ONE OF user
            </div>
        

            <div b-type="div" b-parent="b6fodx" b-id="b4tasp" b-findex="a1" name="user-data" className="flex flex-col gap-4 p-4"  >
                
            <div b-type="cont" b-parent="b4tasp" b-id="byh3xm" b-findex="a0" name="CONT-email" className="flex flex-col gap-1.5"  >
                
            <label b-type="label" b-parent="byh3xm" b-id="bmk3du" b-findex="a0" className="text-sm font-medium text-gray-800" htmlFor="email"  >
                email
            </label>
        

            <div b-type="prop" b-parent="byh3xm" b-id="byywmw" b-findex="a1" ref-id="email--co" name="email" className="w-full"  >
                <input b-type="input" b-parent="byywmw" b-id="b0echb" b-findex="a0" name="email" type="email" id="email" placeholder="email" action="oninput-update-m" className="w-full rounded-md border border-[#CBD5E1] bg-white px-3 py-2 leading-6 transition-all selection:bg-violet-400 selection:text-white placeholder:text-base placeholder:font-normal placeholder:text-gray-400 hover:border-gray-400 focus:border-gray-200 focus:outline-2 focus:outline-offset-2 focus:outline-violet-600" mid="vjnou" onInput={async (e) => {
				
				
				
				e = {...e} // fix: e.currentTarget
				await GFN.bro_on_input(e, M, INFO, props, idx);
			}} />
            </div>
        
            </div>
        

            <div b-type="cont" b-parent="b4tasp" b-id="b3s401" b-findex="a1" name="CONT-name" className="flex flex-col gap-1.5"  >
                
            <label b-type="label" b-parent="b3s401" b-id="b9k02p" b-findex="a0" className="text-sm font-medium text-gray-800" htmlFor="name"  >
                name
            </label>
        

            <div b-type="prop" b-parent="b3s401" b-id="b468gf" b-findex="a1" ref-id="text--co" name="name" className="w-full"  >
                <input b-type="input" b-parent="b468gf" b-id="b5im57" b-findex="a0" name="name" id="name" type="text" placeholder="name" action="oninput-update-m" className="w-full rounded-md border border-[#CBD5E1] bg-white px-3 py-2 leading-6 transition-all selection:bg-violet-400 selection:text-white placeholder:text-base placeholder:font-normal placeholder:text-gray-400 hover:border-gray-400 focus:border-gray-200 focus:outline-2 focus:outline-offset-2 focus:outline-violet-600" mid="vjnou" onInput={async (e) => {
				
				
				
				e = {...e} // fix: e.currentTarget
				await GFN.bro_on_input(e, M, INFO, props, idx);
			}} />
            </div>
        
            </div>
        

            <div b-type="cont" b-parent="b4tasp" b-id="bad8ds" b-findex="a2" name="CONT-images" className="w-full flex flex-col gap-2"  >
                
            <div b-type="div" b-parent="bad8ds" b-id="bpbcqa" b-findex="a0" className="block text-gray-700 text-sm font-medium mb-2 capitalize"  >
                images
            </div>
        

				{(()=>{
					const D = GFN.GET_ARRAY(M, ["images"]);
					return D.map(
						(V, idx)=> (
							
            <div b-type="prop" b-parent="bad8ds" b-id="bez5ea" b-findex="a1" ref-id="image--cm--dnd" name="images" className="flex w-full items-center justify-between pr-10" key={V.id} >
                
            <div b-type="div" b-parent="bez5ea" b-id="b8xaph" b-findex="a0" name="cont" className="w-full flex flex-col md:flex-row  items-center justify-center gap-4"  >
                
            <div b-type="div" b-parent="b8xaph" b-id="b1ibiu" b-findex="a0" className="flex flex-col gap-1.5"  >
                
            <p b-type="p" b-parent="b1ibiu" b-id="bqy97y" b-findex="a0" className="label"  >
                Select an image
            </p>
        
{ M.__meta?.props?.images && Array.isArray(M.__meta?.props?.images) && !M.__meta?.props?.images[idx]?.progress && (<label b-type="label" b-parent="b1ibiu" b-id="b3bfvn" b-findex="a1" htmlFor={'vjnou-images-dropzone-image-create' + idx} className="flex w-full min-h-32  cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-gray-400 bg-gray-100 hover:bg-gray-200"  >
                
            <div b-type="div" b-parent="b3bfvn" b-id="bi2ex3" b-findex="a0" className="flex flex-col items-center justify-center px-6 py-5"  >
                
            <svg b-type="svg" b-parent="bi2ex3" b-id="bbm90e" b-findex="a0" className="mb-4 h-8 w-8 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16"  >
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"></path>
            </svg>
        

            <p b-type="p" b-parent="bi2ex3" b-id="bffy8k" b-findex="a1" className="pb-1"  >
                
            <span b-type="span" b-parent="bffy8k" b-id="b4bjea" b-findex="a0" className="font-semibold"  >
                Click to upload
            </span>
        
            </p>
        

            <p b-type="p" b-parent="bi2ex3" b-id="bxjh1f" b-findex="a2" className="helper-text"  >
                SVG, PNG, JPG or GIF (MAX. 800x400px)
            </p>
        
            </div>
        
<input b-type="input" b-parent="b3bfvn" b-id="b8c09b" b-findex="a1" id={'vjnou-images-dropzone-image-create' + idx} name="images" b-idx={idx} type="file" action="oninput-update-m-file-idx" className="hidden" mid="vjnou" onInput={async (e) => {
				
				
				
				e = {...e} // fix: e.currentTarget
				await GFN.bro_on_input_file_idx(e, M, INFO, props, idx);
			}} />
            </label>) }
{ M.__meta?.props?.images && Array.isArray(M.__meta?.props?.images) && M.__meta?.props?.images[idx]?.progress === 'uploading' && (<div b-type="div" b-parent="b1ibiu" b-id="b2ltca" b-findex="a2" className="flex  w-full min-h-32  cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-gray-400 bg-gray-100 hover:bg-gray-200"  >
                
            <div b-type="div" b-parent="b2ltca" b-id="bssdjo" b-findex="a0" className="flex flex-col items-center justify-center px-6 py-5 gap-[10px]"  >
                
            <iconify-icon b-type="iconify-icon" b-parent="bssdjo" b-id="bw1tzo" b-findex="a0" icon="line-md:loading-twotone-loop" width="24" height="24"  >
                
            </iconify-icon>
        

            <p b-type="p" b-parent="bssdjo" b-id="b3b9lq" b-findex="a1" className="pb-1"  >
                Uploading
            </p>
        
            </div>
        
            </div>) }
{ M.__meta?.props?.images && Array.isArray(M.__meta?.props?.images) && M.__meta?.props?.images[idx]?.progress === 'done' && (<div b-type="div" b-parent="b1ibiu" b-id="bi5abk" b-findex="a3" className="flex cursor-pointer w-full min-h-32  flex-col items-center justify-center rounded-md border border-dashed border-gray-400 bg-gray-100 hover:bg-gray-200"  >
                
            <div b-type="div" b-parent="bi5abk" b-id="bsbubv" b-findex="a0" className="flex items-center justify-center px-6 py-5 gap-[10px]"  >
                { V?.v?.url && (<div b-type="div" b-parent="bsbubv" b-id="bdku5s" b-findex="a0" name="image" style={{backgroundImage:`url(${V?.v?.url})`}} className="w-32 h-32 flex flex-shrink-0 bg-no-repeat bg-gray-200 bg-center bg-cover rounded-md"  >
                
            </div>) }

            <div b-type="div" b-parent="bsbubv" b-id="batbh8" b-findex="a1" className="text-[#363636] truncate"  >
                {V?.v?.name}
            </div>
        

            <label b-type="label" b-parent="bsbubv" b-id="bt4txd" b-findex="a2" htmlFor={'vjnou-images-dropzone-image-create' + idx}  >
                
            <div b-type="div" b-parent="bt4txd" b-id="bcwkpj" b-findex="a0" className="rounded p-2 bg-[#FFCAC9]"  >
                Change File
            </div>
        
<input b-type="input" b-parent="bt4txd" b-id="bmwdwh" b-findex="a1" id={'vjnou-images-dropzone-image-create' + idx} name="images" b-idx={idx} type="file" action="oninput-update-m-file-idx" className="hidden" mid="vjnou" onInput={async (e) => {
				
				
				
				e = {...e} // fix: e.currentTarget
				await GFN.bro_on_input_file_idx(e, M, INFO, props, idx);
			}} />
            </label>
        
            </div>
        
            </div>) }
            </div>
        

            <div b-type="div" b-parent="b8xaph" b-id="bfwtvy" b-findex="a1" className="font-bold text-lg"  >
                Or
            </div>
        

            <div b-type="div" b-parent="b8xaph" b-id="bj9cuh" b-findex="a2" className="flex flex-col gap-1.5"  >
                
            <p b-type="p" b-parent="bj9cuh" b-id="b5bv1d" b-findex="a0" className="label"  >
                Paste an image URL
            </p>
        
{ V?.v?.url && (<div b-type="div" b-parent="bj9cuh" b-id="bf5nfs" b-findex="a1" name="image" style={{backgroundImage:`url(${V?.v?.url})`}} className="w-32 h-32 flex flex-shrink-0 bg-no-repeat bg-gray-200 bg-center bg-cover rounded-md"  >
                
            </div>) }
<input b-type="input" b-parent="bj9cuh" b-id="b4yp8z" b-findex="a2" name="images" value={V?.v?.url} type="text" b-idx={idx} action="oninput-update-m-file-idx" className="w-full rounded-md border border-[#CBD5E1] bg-white px-3 py-2 leading-6 transition-all selection:bg-violet-400 selection:text-white placeholder:text-base placeholder:font-normal placeholder:text-gray-400 hover:border-gray-400 focus:border-gray-200 focus:outline-2 focus:outline-offset-2 focus:outline-violet-600" mid="vjnou" onInput={async (e) => {
				
				
				
				e = {...e} // fix: e.currentTarget
				await GFN.bro_on_input_file_idx(e, M, INFO, props, idx);
			}} />
            </div>
        
            </div>
        

            <button b-type="button" b-parent="bez5ea" b-id="bz6scr" b-findex="a1" name="images" b-idx={idx} action="delete-prop-item" className="bg-none text-rose-300 p-2 w-fit h-fit rounded-md hover:bg-rose-400 hover:text-white transition-all ease-in-out duration-150" mid="vjnou" onClick={async (e) => {
				
				
				
				e = {...e} // fix: e.currentTarget
				await GFN.bro_delete_prop_item(e, M, INFO, props, idx);
			}}  >
                
            <svg b-type="svg" b-parent="bz6scr" b-id="bvcvpi" b-findex="a0" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"  >
                <path d="M18 6 6 18"></path><path d="m6 6 12 12"></path>
            </svg>
        
            </button>
        
            </div>
        
						)
					)
				})()}
			

            <button b-type="button" b-parent="bad8ds" b-id="b2qrji" b-findex="a2" type="image" action="add-prop-item" name="images" is-rel="false" className="w-10 h-10 flex justify-center items-center mx-auto border border-gray-100 bg-gray-200 hover:border-gray-200 text-gray-700 text-3xl rounded-lg" mid="vjnou" onClick={async (e) => {
				
				
				
				e = {...e} // fix: e.currentTarget
				await GFN.bro_add_prop_item(e, M, INFO, props, idx);
			}}  >
                
            <svg b-type="svg" b-parent="b2qrji" b-id="b9lpt2" b-findex="a0" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"  >
                <path d="M5 12h14"></path><path d="M12 5v14"></path>
            </svg>
        
            </button>
        
            </div>
        
            </div>
        

            <div b-type="div" b-parent="b6fodx" b-id="bnhfor" b-findex="a2" className="flex-row flex justify-end items-end pt-5 gap-4"  >
                { CS?.status !== 'validate-failed' && (<button b-type="button" b-parent="bnhfor" b-id="b9fwnk" b-findex="a0" op="create_one" className="bg-[var(--primary-500)] hover:bg-[var(--primary-600)] text-white font-medium py-2 px-6 rounded-xl focus:outline-none w-fit text-sm" onClick={async (e) => {
				
				
				
				e = {...e} // fix: e.currentTarget
				await GFN.bro_create_one(e, M, INFO, props, idx);
			}} mid="vjnou"  >
                CREATE
            </button>) }
            </div>
        
            </div>
        
		</ErrorBoundary>
	)
}

export default observer(COMP_NAME);