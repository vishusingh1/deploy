
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

import UTILITY_COMPS from "@/lib/comp/utility";
const Modal = UTILITY_COMPS.Modal;


import GFN from '../../GFN';
import AS from "../../gfn/AS";
import UTILS from "@/utils/index";

import {OBJ_WITH_ID, T_INFO, T_QUERY_PARAMS} from "../types";



// INJECT IMPORTS HERE
import BRO_comp_b6fodx from '../comp_b6fodx'; // b@gen:b6fodx // type: model, name: user, by: b6fodx
import BRO_comp_b8m30p from '../comp_b8m30p'; // b@gen:b8m30p // type: model, name: user, by: b8m30p
import BRO_comp_bdz0dd from '../comp_bdz0dd'; // b@gen:bdz0dd // type: model, name: user, by: bdz0dd
import BRO_comp_bce9q4 from '../comp_bce9q4'; // b@gen:bce9q4 // type: model, name: user, by: bce9q4
import BRO_comp_b1y2wf from '../comp_b1y2wf'; // b@gen:b1y2wf // type: main, name: , by: b1y2wf
import data from './data.ts';
// b@imports





// local code - e.g sub components
// b@locals

const BROKEN_JSX = () => <div className="flex items-center justify-center text-gray-500 font-semibold bg-gray-100">DEFAULT GET_ONE </div>






// b@comp-name
const COMP_NAME = (props: any) => {

	// FOR IS_MANY
	let idx = props.idx;   // also for protection from error when we might think is many but it's not
	let V = props.V || {}; // for protection from error
	
	



	// STATES
	const [M,  SET_M ] 					= useState(props.M  || {})	// model data
	const [SM, SET_SM] 					= useState(null);			// selected model data
	
	const [errors,		set_errors]		= useState([]);
	const [warnings,	set_warnings]	= useState([]);

	
	// REPLACE INFO HERE - NEXT LINE after b@
	// b@info
const INFO: T_INFO  = { mid: "", cid: "comp_start", idx: idx, cidx: idx, model_name: "", prop_name: props.pm_pn, op: ""};


	// DYNAMIC VARIABLES & FUNCTIONS
	const B		: any = {}; // contains actions and common functions
	const VARS	: any = {}; // contains variables
	const FNS	: any = {}; // contains functions


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
		// select page
		UTILS.select_page_on_init(INFO);


		init();

		return () => {
			// if(INITIALIZING.value) return; // don't unsubscribe if initializing. There is a strange react unmount bug happeing
			subs.current.forEach(s=>s.unsubscribe());
		}
	}, []);




	// SUBS TO SELECTED ONE
	useEffect(()=>subscribe_selected_one(INFO.mid, subs.current, SET_SM), []);

	


	

    // USER DEFINED EFFECTS
const GalleryApp = () => {
        const [modalImage, setModalImage] = useState<string | null>(null);
  
        const openImage = (imageSrc: string) => {
          setModalImage(imageSrc);
          document.getElementById("imageModal")?.classList.remove("hidden");
        };
  
        const closeImage = () => {
          setModalImage(null);
          document.getElementById("imageModal")?.classList.add("hidden");
        };
  
        document.querySelectorAll("[data-image-src]").forEach((element) => {
          element.querySelector("button")?.addEventListener("click", () => {
            const src = element.getAttribute("data-image-src");
            if (src) openImage(src);
          });
        });
  
        document.getElementById("closeModal")?.addEventListener("click", closeImage);
  
        if (modalImage) {
          const modalImg = document.getElementById("modalImage");
          if (modalImg) modalImg.setAttribute("src", modalImage);
        }
      };
  
      GalleryApp();
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

	const init = async ()=>{

		// remove all previous subscriptions
		subs.current.forEach(s=>s.unsubscribe()); subs.current = [];

		
		// NOTHING TO DOWNLOAD IN page.tsx


	}

    // USER DEFINED FUNCTIONS
    // b@functions



	// STATEMENTS
	INFO.SET_M          = SET_M;
	INFO.query		  	= query || undefined;
	INFO.on_created     = props.on_created || props.INFO?.on_created;
	INFO.on_selected    = props.on_selected || props.INFO?.on_selected;

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
const MAPPED_DATA = {};
	// b@mapped-data


	// USER CODE - Extra code written by user
	// b@user-code

	// b@user-code-end




	return (
		<ErrorBoundary fallbackRender={FallbackRender} onReset={(d) => { console.error(d) }}>

            <div b-type="page" b-parent="pages" b-id="start" b-findex="a0" name="START" findex="a0"  >
                
            <div b-type="div" b-parent="start" b-id="bue98l" b-findex="a0" className="new-div w-screen flex items-center justify-center"  >
                <img b-type="img" b-parent="bue98l" b-id="boh48w" b-findex="a0" src="https://fal.media/files/koala/4hOfdrEH-A7owbNGWj_61.jpeg" alt="Gallery Item" className="w-full object-cover" />
            </div>
        

            <div b-type="div" b-parent="start" b-id="benfok" b-findex="a1" className="new-div w-full flex items-center justify-center"  >
                
            <div b-type="div" b-parent="benfok" b-id="bgxtih" b-findex="a0" id="gallery-app"  >
                
            <div b-type="div" b-parent="bgxtih" b-id="bt19s4" b-findex="a0" className="container mx-auto"  >
                
            <h1 b-type="h1" b-parent="bt19s4" b-id="bbin21" b-findex="a0" className="text-4xl font-bold text-blue-700 mb-4"  >
                Gallery
            </h1>
        

            <div b-type="div" b-parent="bt19s4" b-id="bhtwm0" b-findex="a1" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" id="gallery-content"  >
                
            <div b-type="div" b-parent="bhtwm0" b-id="bh8j5x" b-findex="a0" className="relative group bg-white shadow-md rounded-md overflow-hidden" data-image-src="https://www.zicaindore.com/Uploads/PhotoGallery/90fa8866-5454-4205-a28f-6c2825424ecc/_large.jpg"  >
                <img b-type="img" b-parent="bh8j5x" b-id="b2aslx" b-findex="a0" src="https://www.zicaindore.com/Uploads/PhotoGallery/90fa8866-5454-4205-a28f-6c2825424ecc/_default.jpg" alt="Gallery Item" className="w-full h-40 object-cover" />

            <div b-type="div" b-parent="bh8j5x" b-id="bs67g4" b-findex="a1" className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity"  >
                
            <button b-type="button" b-parent="bs67g4" b-id="bm8733" b-findex="a0" onClick="openImage(event, 'https://www.zicaindore.com/Uploads/PhotoGallery/90fa8866-5454-4205-a28f-6c2825424ecc/_large.jpg')" className="text-white text-2xl"  >
                ⤢
            </button>
        
            </div>
        
            </div>
        

            <div b-type="div" b-parent="bhtwm0" b-id="bm7uv0" b-findex="a1" className="relative group bg-white shadow-md rounded-md overflow-hidden" data-image-src="https://www.zicaindore.com/Uploads/PhotoGallery/5bdf5b04-064a-42f9-b8d2-ef6a8f5deae5/_large.jpg"  >
                <img b-type="img" b-parent="bm7uv0" b-id="b00ewx" b-findex="a0" src="https://www.zicaindore.com/Uploads/PhotoGallery/5bdf5b04-064a-42f9-b8d2-ef6a8f5deae5/_default.jpg" alt="Gallery Item" className="w-full h-40 object-cover" />

            <div b-type="div" b-parent="bm7uv0" b-id="bmgiiz" b-findex="a1" className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity"  >
                
            <button b-type="button" b-parent="bmgiiz" b-id="b21koi" b-findex="a0" onClick="openImage(event, 'https://www.zicaindore.com/Uploads/PhotoGallery/6edd3a83-8cc8-4481-9d3c-1882c3010cc2/_large.jpg')" className="text-white text-2xl"  >
                ⤢
            </button>
        
            </div>
        
            </div>
        

            <div b-type="div" b-parent="bhtwm0" b-id="bqp3bo" b-findex="a2" className="relative group bg-white shadow-md rounded-md overflow-hidden" data-image-src="https://www.zicaindore.com/Uploads/PhotoGallery/cc8389b3-567b-4832-ad21-f985b8aa7ced/_large.jpg"  >
                <img b-type="img" b-parent="bqp3bo" b-id="bykn7s" b-findex="a0" src="https://www.zicaindore.com/Uploads/PhotoGallery/cc8389b3-567b-4832-ad21-f985b8aa7ced/_default.jpg" alt="Gallery Item" className="w-full h-40 object-cover" />

            <div b-type="div" b-parent="bqp3bo" b-id="bciuct" b-findex="a1" className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity"  >
                
            <button b-type="button" b-parent="bciuct" b-id="bxj13u" b-findex="a0" onClick="openImage(event, 'https://www.zicaindore.com/Uploads/PhotoGallery/52d71127-8c81-4c8d-86ee-3cb09c78ac82/_large.jpg')" className="text-white text-2xl"  >
                ⤢
            </button>
        
            </div>
        
            </div>
        

            <div b-type="div" b-parent="bhtwm0" b-id="bvsspx" b-findex="a3" className="relative group bg-white shadow-md rounded-md overflow-hidden" data-image-src="https://www.zicaindore.com/Uploads/PhotoGallery/33b10941-fecc-4b61-92ac-545d9c319634/_large.jpg"  >
                <img b-type="img" b-parent="bvsspx" b-id="bx29bd" b-findex="a0" src="https://www.zicaindore.com/Uploads/PhotoGallery/33b10941-fecc-4b61-92ac-545d9c319634/_default.jpg" alt="Gallery Item" className="w-full h-40 object-cover" />

            <div b-type="div" b-parent="bvsspx" b-id="b98b7m" b-findex="a1" className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity"  >
                
            <button b-type="button" b-parent="b98b7m" b-id="b7ndul" b-findex="a0" onClick="openImage(event, 'https://www.zicaindore.com/Uploads/PhotoGallery/52d71127-8c81-4c8d-86ee-3cb09c78ac82/_large.jpg')" className="text-white text-2xl"  >
                ⤢
            </button>
        
            </div>
        
            </div>
        

            <div b-type="div" b-parent="bhtwm0" b-id="b09jce" b-findex="a4" className="relative group bg-white shadow-md rounded-md overflow-hidden" data-image-src="https://www.zicaindore.com/Uploads/PhotoGallery/528a65e9-9ded-4d04-870f-e06e1f793503/_large.jpg"  >
                <img b-type="img" b-parent="b09jce" b-id="bi7app" b-findex="a0" src="https://www.zicaindore.com/Uploads/PhotoGallery/528a65e9-9ded-4d04-870f-e06e1f793503/_default.jpg" alt="Gallery Item" className="w-full h-40 object-cover" />

            <div b-type="div" b-parent="b09jce" b-id="bjrxh1" b-findex="a1" className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity"  >
                
            <button b-type="button" b-parent="bjrxh1" b-id="b1jgwy" b-findex="a0" onClick="openImage(event, 'https://www.zicaindore.com/Uploads/PhotoGallery/52d71127-8c81-4c8d-86ee-3cb09c78ac82/_large.jpg')" className="text-white text-2xl"  >
                ⤢
            </button>
        
            </div>
        
            </div>
        
            </div>
        
            </div>
        

            <div b-type="div" b-parent="bgxtih" b-id="bvbttj" b-findex="a1" id="imageModal" className="hidden fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center"  >
                
            <div b-type="div" b-parent="bvbttj" b-id="bnihuu" b-findex="a0" className="relative"  >
                
            <button b-type="button" b-parent="bnihuu" b-id="b1gy67" b-findex="a0" id="closeModal" className="absolute top-2 right-2 bg-white text-black rounded-full px-2 py-1 text-lg"  >
                ✕
            </button>
        
<img b-type="img" b-parent="bnihuu" b-id="bs0qr7" b-findex="a1" id="modalImage" alt="Expanded Image" className="max-w-full max-h-screen" />
            </div>
        
            </div>
        

            <script b-type="script" b-parent="bgxtih" b-id="bjethc" b-findex="a2" type="text/tsx" effect-id="gallery"  >
                
            </script>
        
            </div>
        
            </div>
        

            <div b-type="div" b-parent="start" b-id="b685zn" b-findex="a2" className="new-div w-full flex items-center justify-center"  >
                
			{/* user: create_one  bid:b6fodx */}
			<BRO_comp_b6fodx COMP_DATAS={INFO.COMP_DATAS||[]} idx={idx} INFO={INFO}  />
		

			{/* user: get_many  bid:b8m30p */}
			<BRO_comp_b8m30p COMP_DATAS={INFO.COMP_DATAS||[]} idx={idx} INFO={INFO}  />
		
            </div>
        

            <div b-type="div" b-parent="start" b-id="bhedg2" b-findex="a3" className="new-div w-full flex items-center justify-center"  >
                <img b-type="img" b-parent="bhedg2" b-id="b9oig3" b-findex="a0" src="https://fal.media/files/koala/4hOfdrEH-A7owbNGWj_61.jpeg" />
            </div>
        

            <div b-type="div" b-parent="start" b-id="bx4pnu" b-findex="a4" className="new-div w-full flex items-center justify-center"  >
                
            <div b-type="div" b-parent="bx4pnu" b-id="bqckp0" b-findex="a0" className="w-full max-w-4xl mx-auto p-4"  >
                
            <div b-type="div" b-parent="bqckp0" b-id="bbk3sb" b-findex="a0" className="flex border-b border-gray-200 mb-4"  >
                
            <button b-type="button" b-parent="bbk3sb" b-id="bzzebq" b-findex="a0" data-tab="tab1" className="tab-button px-4 py-2 text-gray-500 hover:text-gray-900 border-b-2 border-transparent focus:outline-none"  >
                Tab 1
            </button>
        

            <button b-type="button" b-parent="bbk3sb" b-id="bq5afv" b-findex="a1" data-tab="tab2" className="tab-button px-4 py-2 text-gray-500 hover:text-gray-900 border-b-2 border-transparent focus:outline-none"  >
                Tab 2
            </button>
        

            <button b-type="button" b-parent="bbk3sb" b-id="blgpww" b-findex="a2" data-tab="tab3" className="tab-button px-4 py-2 text-gray-500 hover:text-gray-900 border-b-2 border-transparent focus:outline-none"  >
                Tab 3
            </button>
        
            </div>
        

            <div b-type="div" b-parent="bqckp0" b-id="bac2zf" b-findex="a1" className="tab-content hidden" id="tab1"  >
                This is the content of Tab 1.
            </div>
        

            <div b-type="div" b-parent="bqckp0" b-id="b781l0" b-findex="a2" className="tab-content hidden" id="tab2"  >
                This is the content of Tab 2.
            </div>
        

            <div b-type="div" b-parent="bqckp0" b-id="bwdrib" b-findex="a3" className="tab-content hidden" id="tab3"  >
                This is the content of Tab 3.
            </div>
        
            </div>
        
            </div>
        

            <div b-type="div" b-parent="start" b-id="bo4b9p" b-findex="a5" className="new-div w-full flex items-center justify-center"  >
                
			{/* user: get_many  bid:bdz0dd */}
			<BRO_comp_bdz0dd COMP_DATAS={INFO.COMP_DATAS||[]} idx={idx} INFO={INFO}  />
		
            </div>
        

            <div b-type="div" b-parent="start" b-id="b8eblb" b-findex="a6" className="new-div w-full flex items-center justify-center"  >
                
			{/* user: get_many  bid:bce9q4 */}
			<BRO_comp_bce9q4 COMP_DATAS={INFO.COMP_DATAS||[]} idx={idx} INFO={INFO}  />
		
            </div>
        

            <div b-type="div" b-parent="start" b-id="bvuf4c" b-findex="a7" className="new-div w-full flex items-center justify-center"  >
                
            <div b-type="div" b-parent="bvuf4c" b-id="bg5gzu" b-findex="a0" className="max-w-4xl mx-auto p-4"  >
                
            <div b-type="div" b-parent="bg5gzu" b-id="bfy1ur" b-findex="a0" className="accordion-item border-b border-gray-200"  >
                
            <button b-type="button" b-parent="bfy1ur" b-id="bx56am" b-findex="a0" className="accordion-header w-full flex justify-between px-4 py-2 text-gray-700 hover:text-gray-900 focus:outline-none"  >
                
            <span b-type="span" b-parent="bx56am" b-id="bkc9mv" b-findex="a0" className="accordion-icon"  >
                +
            </span>
        
            </button>
        

            <div b-type="div" b-parent="bfy1ur" b-id="btfzqp" b-findex="a1" className="accordion-content hidden px-4 py-2 text-gray-600"  >
                Content for Section 1.
            </div>
        
            </div>
        

            <div b-type="div" b-parent="bg5gzu" b-id="biwv3w" b-findex="a1" className="accordion-item border-b border-gray-200"  >
                
            <button b-type="button" b-parent="biwv3w" b-id="b2383s" b-findex="a0" className="accordion-header w-full flex justify-between px-4 py-2 text-gray-700 hover:text-gray-900 focus:outline-none"  >
                
            <span b-type="span" b-parent="b2383s" b-id="bv7qwf" b-findex="a0" className="accordion-icon"  >
                +
            </span>
        
            </button>
        

            <div b-type="div" b-parent="biwv3w" b-id="bog59m" b-findex="a1" className="accordion-content hidden px-4 py-2 text-gray-600"  >
                Content for Section 2.
            </div>
        
            </div>
        

            <div b-type="div" b-parent="bg5gzu" b-id="bnpmp5" b-findex="a2" className="accordion-item border-b border-gray-200"  >
                
            <button b-type="button" b-parent="bnpmp5" b-id="bvixyu" b-findex="a0" className="accordion-header w-full flex justify-between px-4 py-2 text-gray-700 hover:text-gray-900 focus:outline-none"  >
                
            <span b-type="span" b-parent="bvixyu" b-id="bok1lb" b-findex="a0" className="accordion-icon"  >
                +
            </span>
        
            </button>
        

            <div b-type="div" b-parent="bnpmp5" b-id="bgqfvk" b-findex="a1" className="accordion-content hidden px-4 py-2 text-gray-600"  >
                Content for Section 3.
            </div>
        
            </div>
        
            </div>
        
            </div>
        

            <div b-type="div" b-parent="start" b-id="b1ztzv" b-findex="a8" className="w-full max-w-lg mx-auto p-4"  >
                
            <div b-type="div" b-parent="b1ztzv" b-id="bcws27" b-findex="a0" id="step1" className="step-content"  >
                
            <h2 b-type="h2" b-parent="bcws27" b-id="b2f50s" b-findex="a0" className="text-xl font-semibold mb-2"  >
                Step 1
            </h2>
        
<input b-type="input" b-parent="bcws27" b-id="brbv16" b-findex="a1" type="text" placeholder="Enter your name" className="w-full p-2 border border-gray-300 rounded mb-4" />

            <button b-type="button" b-parent="bcws27" b-id="b6al1m" b-findex="a2" id="nextToStep2" className="bg-blue-500 text-white px-4 py-2 rounded"  >
                Next
            </button>
        
            </div>
        

            <div b-type="div" b-parent="b1ztzv" b-id="bqldxl" b-findex="a1" id="step2" className="step-content hidden"  >
                
            <h2 b-type="h2" b-parent="bqldxl" b-id="bwrrs9" b-findex="a0" className="text-xl font-semibold mb-2"  >
                Step 2
            </h2>
        
<input b-type="input" b-parent="bqldxl" b-id="bxmh4h" b-findex="a1" type="email" placeholder="Enter your email" className="w-full p-2 border border-gray-300 rounded mb-4" />

            <button b-type="button" b-parent="bqldxl" b-id="bxcy8u" b-findex="a2" id="prevToStep1" className="bg-gray-500 text-white px-4 py-2 rounded mr-2"  >
                Previous
            </button>
        

            <button b-type="button" b-parent="bqldxl" b-id="bxtndg" b-findex="a3" id="nextToStep3" className="bg-blue-500 text-white px-4 py-2 rounded"  >
                Next
            </button>
        
            </div>
        

            <div b-type="div" b-parent="b1ztzv" b-id="bug6zt" b-findex="a2" id="step3" className="step-content hidden"  >
                
            <h2 b-type="h2" b-parent="bug6zt" b-id="bx79l5" b-findex="a0" className="text-xl font-semibold mb-2"  >
                Step 3
            </h2>
        
<input b-type="input" b-parent="bug6zt" b-id="bjsgci" b-findex="a1" type="password" placeholder="Enter your password" className="w-full p-2 border border-gray-300 rounded mb-4" />

            <button b-type="button" b-parent="bug6zt" b-id="bwpga5" b-findex="a2" id="prevToStep2" className="bg-gray-500 text-white px-4 py-2 rounded mr-2"  >
                Previous
            </button>
        

            <button b-type="button" b-parent="bug6zt" b-id="bigpsq" b-findex="a3" className="bg-green-500 text-white px-4 py-2 rounded"  >
                Submit
            </button>
        
            </div>
        
            </div>
        

            <div b-type="div" b-parent="start" b-id="b0wd3j" b-findex="a9" className="flex flex-wrap justify-center gap-6 p-6"  >
                
            <div b-type="div" b-parent="b0wd3j" b-id="b2rdvg" b-findex="a0" className="max-w-sm bg-white border border-gray-200 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"  >
                
            <div b-type="div" b-parent="b2rdvg" b-id="brb1ow" b-findex="a0" className="p-6"  >
                
            <h3 b-type="h3" b-parent="brb1ow" b-id="bh5t1l" b-findex="a0" className="text-xl font-semibold text-gray-800"  >
                Basic Plan
            </h3>
        

            <p b-type="p" b-parent="brb1ow" b-id="bhnefr" b-findex="a1" className="mt-2 text-gray-600"  >
                $9.99/month
            </p>
        

            <ul b-type="ul" b-parent="brb1ow" b-id="bcr1y0" b-findex="a2" className="mt-4 space-y-2"  >
                
            <li b-type="li" b-parent="bcr1y0" b-id="btmb7u" b-findex="a0" className="flex items-center"  >
                
            <span b-type="span" b-parent="btmb7u" b-id="bzgj8v" b-findex="a0" className="text-green-500 mr-2"  >
                ✔
            </span>
        
            </li>
        

            <li b-type="li" b-parent="bcr1y0" b-id="bz9a87" b-findex="a1" className="flex items-center"  >
                
            <span b-type="span" b-parent="bz9a87" b-id="bhox3w" b-findex="a0" className="text-green-500 mr-2"  >
                ✔
            </span>
        
            </li>
        

            <li b-type="li" b-parent="bcr1y0" b-id="bgeo97" b-findex="a2" className="flex items-center"  >
                
            <span b-type="span" b-parent="bgeo97" b-id="bqu2tw" b-findex="a0" className="text-red-500 mr-2"  >
                ✘
            </span>
        
            </li>
        
            </ul>
        

            <button b-type="button" b-parent="brb1ow" b-id="bqtwfd" b-findex="a3" className="mt-6 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors"  >
                Get Started
            </button>
        
            </div>
        
            </div>
        

            <div b-type="div" b-parent="b0wd3j" b-id="b1w5rm" b-findex="a1" className="max-w-sm bg-white border border-gray-200 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"  >
                
            <div b-type="div" b-parent="b1w5rm" b-id="btx6dt" b-findex="a0" className="p-6"  >
                
            <h3 b-type="h3" b-parent="btx6dt" b-id="bpan8o" b-findex="a0" className="text-xl font-semibold text-gray-800"  >
                Pro Plan
            </h3>
        

            <p b-type="p" b-parent="btx6dt" b-id="b4z1or" b-findex="a1" className="mt-2 text-gray-600"  >
                $19.99/month
            </p>
        

            <ul b-type="ul" b-parent="btx6dt" b-id="bbxjvl" b-findex="a2" className="mt-4 space-y-2"  >
                
            <li b-type="li" b-parent="bbxjvl" b-id="b4m1al" b-findex="a0" className="flex items-center"  >
                
            <span b-type="span" b-parent="b4m1al" b-id="bbdsik" b-findex="a0" className="text-green-500 mr-2"  >
                ✔
            </span>
        
            </li>
        

            <li b-type="li" b-parent="bbxjvl" b-id="bdm317" b-findex="a1" className="flex items-center"  >
                
            <span b-type="span" b-parent="bdm317" b-id="bdy849" b-findex="a0" className="text-green-500 mr-2"  >
                ✔
            </span>
        
            </li>
        

            <li b-type="li" b-parent="bbxjvl" b-id="bswy4k" b-findex="a2" className="flex items-center"  >
                
            <span b-type="span" b-parent="bswy4k" b-id="bq0l4e" b-findex="a0" className="text-green-500 mr-2"  >
                ✔
            </span>
        
            </li>
        
            </ul>
        

            <button b-type="button" b-parent="btx6dt" b-id="bxd3bf" b-findex="a3" className="mt-6 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors"  >
                Get Started
            </button>
        
            </div>
        
            </div>
        

            <div b-type="div" b-parent="b0wd3j" b-id="by4vuc" b-findex="a2" className="max-w-sm bg-white border border-gray-200 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"  >
                
            <div b-type="div" b-parent="by4vuc" b-id="bmbwk3" b-findex="a0" className="p-6"  >
                
            <h3 b-type="h3" b-parent="bmbwk3" b-id="bk1ol6" b-findex="a0" className="text-xl font-semibold text-gray-800"  >
                Enterprise Plan
            </h3>
        

            <p b-type="p" b-parent="bmbwk3" b-id="bfl8a0" b-findex="a1" className="mt-2 text-gray-600"  >
                $49.99/month
            </p>
        

            <ul b-type="ul" b-parent="bmbwk3" b-id="b1mty7" b-findex="a2" className="mt-4 space-y-2"  >
                
            <li b-type="li" b-parent="b1mty7" b-id="b3mncy" b-findex="a0" className="flex items-center"  >
                
            <span b-type="span" b-parent="b3mncy" b-id="bk03d9" b-findex="a0" className="text-green-500 mr-2"  >
                ✔
            </span>
        
            </li>
        

            <li b-type="li" b-parent="b1mty7" b-id="bwplav" b-findex="a1" className="flex items-center"  >
                
            <span b-type="span" b-parent="bwplav" b-id="b6ybgf" b-findex="a0" className="text-green-500 mr-2"  >
                ✔
            </span>
        
            </li>
        

            <li b-type="li" b-parent="b1mty7" b-id="brnvkq" b-findex="a2" className="flex items-center"  >
                
            <span b-type="span" b-parent="brnvkq" b-id="b7lakk" b-findex="a0" className="text-green-500 mr-2"  >
                ✔
            </span>
        
            </li>
        
            </ul>
        

            <button b-type="button" b-parent="bmbwk3" b-id="bxaq07" b-findex="a3" className="mt-6 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors"  >
                Get Started
            </button>
        
            </div>
        
            </div>
        
            </div>
        

            <div b-type="div" b-parent="start" b-id="b5q6du" b-findex="aA" className="grid grid-cols-3 gap-4 p-6"  >
                
            <div b-type="div" b-parent="b5q6du" b-id="b2bm4f" b-findex="a0" className="relative group"  >
                <img b-type="img" b-parent="b2bm4f" b-id="bvvu9n" b-findex="a0" src="https://via.placeholder.com/300" alt="Gallery Image 1" className="w-full h-full object-cover rounded-lg" />

            <div b-type="div" b-parent="b2bm4f" b-id="bepgxc" b-findex="a1" className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"  >
                
            <p b-type="p" b-parent="bepgxc" b-id="bedd9c" b-findex="a0" className="text-white font-semibold text-lg"  >
                Gallery Image 1
            </p>
        
            </div>
        
            </div>
        

            <div b-type="div" b-parent="b5q6du" b-id="b36xyu" b-findex="a1" className="relative group"  >
                <img b-type="img" b-parent="b36xyu" b-id="b7fezv" b-findex="a0" src="https://via.placeholder.com/300" alt="Gallery Image 2" className="w-full h-full object-cover rounded-lg" />

            <div b-type="div" b-parent="b36xyu" b-id="b7s7xv" b-findex="a1" className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"  >
                
            <p b-type="p" b-parent="b7s7xv" b-id="bvqeoy" b-findex="a0" className="text-white font-semibold text-lg"  >
                Gallery Image 2
            </p>
        
            </div>
        
            </div>
        

            <div b-type="div" b-parent="b5q6du" b-id="bi6j2l" b-findex="a2" className="relative group"  >
                <img b-type="img" b-parent="bi6j2l" b-id="bb17gk" b-findex="a0" src="https://via.placeholder.com/300" alt="Gallery Image 3" className="w-full h-full object-cover rounded-lg" />

            <div b-type="div" b-parent="bi6j2l" b-id="bysj6g" b-findex="a1" className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"  >
                
            <p b-type="p" b-parent="bysj6g" b-id="b447tb" b-findex="a0" className="text-white font-semibold text-lg"  >
                Gallery Image 3
            </p>
        
            </div>
        
            </div>
        
            </div>
        

            <div b-type="div" b-parent="start" b-id="bfqg2m" b-findex="aB" className="flex h-screen bg-gray-100"  >
                
            <aside b-type="aside" b-parent="bfqg2m" b-id="bom75r" b-findex="a0" className="w-64 bg-gray-800 text-gray-200"  >
                
            <div b-type="div" b-parent="bom75r" b-id="biizj9" b-findex="a0" className="p-6"  >
                
            <h2 b-type="h2" b-parent="biizj9" b-id="bjhc9t" b-findex="a0" className="text-lg font-bold"  >
                Dashboard
            </h2>
        
            </div>
        

            <nav b-type="nav" b-parent="bom75r" b-id="bhknth" b-findex="a1"  >
                
            <ul b-type="ul" b-parent="bhknth" b-id="be4yks" b-findex="a0"  >
                
            <li b-type="li" b-parent="be4yks" b-id="bw1w2p" b-findex="a0" className="hover:bg-gray-700 p-4"  >
                
            <a b-type="a" b-parent="bw1w2p" b-id="b24zjy" b-findex="a0" href="#" className="block"  >
                Home
            </a>
        
            </li>
        

            <li b-type="li" b-parent="be4yks" b-id="bssw4p" b-findex="a1" className="hover:bg-gray-700 p-4"  >
                
            <a b-type="a" b-parent="bssw4p" b-id="beh4xk" b-findex="a0" href="#" className="block"  >
                Analytics
            </a>
        
            </li>
        

            <li b-type="li" b-parent="be4yks" b-id="bueb7n" b-findex="a2" className="hover:bg-gray-700 p-4"  >
                
            <a b-type="a" b-parent="bueb7n" b-id="b24q14" b-findex="a0" href="#" className="block"  >
                Settings
            </a>
        
            </li>
        

            <li b-type="li" b-parent="be4yks" b-id="b30h3m" b-findex="a3" className="hover:bg-gray-700 p-4"  >
                
            <a b-type="a" b-parent="b30h3m" b-id="bgcxze" b-findex="a0" href="#" className="block"  >
                Logout
            </a>
        
            </li>
        
            </ul>
        
            </nav>
        
            </aside>
        

			{/* :   bid:b1y2wf */}
			<BRO_comp_b1y2wf COMP_DATAS={INFO.COMP_DATAS||[]} idx={idx} INFO={INFO}  />
		
            </div>
        

            <div b-type="div" b-parent="start" b-id="b3t8dp" b-findex="aC" className="p-6"  >
                
            <h2 b-type="h2" b-parent="b3t8dp" b-id="bxo1zt" b-findex="a0" className="text-2xl font-bold mb-4"  >
                Featured Products
            </h2>
        

            <div b-type="div" b-parent="b3t8dp" b-id="byrydy" b-findex="a1" className="grid grid-cols-4 gap-6"  >
                
            <div b-type="div" b-parent="byrydy" b-id="bbqqrx" b-findex="a0" className="bg-white border border-gray-200 rounded-lg shadow-lg"  >
                <img b-type="img" b-parent="bbqqrx" b-id="bfo17c" b-findex="a0" src="https://via.placeholder.com/300" alt="Product 1" className="rounded-t-lg" />

            <div b-type="div" b-parent="bbqqrx" b-id="bdm5ik" b-findex="a1" className="p-4"  >
                
            <h3 b-type="h3" b-parent="bdm5ik" b-id="bo89ph" b-findex="a0" className="text-lg font-bold"  >
                Product 1
            </h3>
        

            <p b-type="p" b-parent="bdm5ik" b-id="b3u0ev" b-findex="a1" className="text-gray-500"  >
                $49.99
            </p>
        

            <button b-type="button" b-parent="bdm5ik" b-id="b75h7f" b-findex="a2" className="mt-4 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors"  >
                Add to Cart
            </button>
        
            </div>
        
            </div>
        

            <div b-type="div" b-parent="byrydy" b-id="br4zm8" b-findex="a1" className="bg-white border border-gray-200 rounded-lg shadow-lg"  >
                <img b-type="img" b-parent="br4zm8" b-id="bfsb6w" b-findex="a0" src="https://via.placeholder.com/300" alt="Product 2" className="rounded-t-lg" />

            <div b-type="div" b-parent="br4zm8" b-id="btth4g" b-findex="a1" className="p-4"  >
                
            <h3 b-type="h3" b-parent="btth4g" b-id="b5mo5e" b-findex="a0" className="text-lg font-bold"  >
                Product 2
            </h3>
        

            <p b-type="p" b-parent="btth4g" b-id="byx8mi" b-findex="a1" className="text-gray-500"  >
                $59.99
            </p>
        

            <button b-type="button" b-parent="btth4g" b-id="bihcnk" b-findex="a2" className="mt-4 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors"  >
                Add to Cart
            </button>
        
            </div>
        
            </div>
        

            <div b-type="div" b-parent="byrydy" b-id="btyqag" b-findex="a2" className="bg-white border border-gray-200 rounded-lg shadow-lg"  >
                <img b-type="img" b-parent="btyqag" b-id="brx7fk" b-findex="a0" src="https://via.placeholder.com/300" alt="Product 3" className="rounded-t-lg" />

            <div b-type="div" b-parent="btyqag" b-id="b0hhu3" b-findex="a1" className="p-4"  >
                
            <h3 b-type="h3" b-parent="b0hhu3" b-id="bpk1mw" b-findex="a0" className="text-lg font-bold"  >
                Product 3
            </h3>
        

            <p b-type="p" b-parent="b0hhu3" b-id="b4k7de" b-findex="a1" className="text-gray-500"  >
                $39.99
            </p>
        

            <button b-type="button" b-parent="b0hhu3" b-id="bsh2qb" b-findex="a2" className="mt-4 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors"  >
                Add to Cart
            </button>
        
            </div>
        
            </div>
        

            <div b-type="div" b-parent="byrydy" b-id="bxu76n" b-findex="a3" className="bg-white border border-gray-200 rounded-lg shadow-lg"  >
                <img b-type="img" b-parent="bxu76n" b-id="bqh5e7" b-findex="a0" src="https://via.placeholder.com/300" alt="Product 4" className="rounded-t-lg" />

            <div b-type="div" b-parent="bxu76n" b-id="ba3b5d" b-findex="a1" className="p-4"  >
                
            <h3 b-type="h3" b-parent="ba3b5d" b-id="b1uf85" b-findex="a0" className="text-lg font-bold"  >
                Product 4
            </h3>
        

            <p b-type="p" b-parent="ba3b5d" b-id="b62l8n" b-findex="a1" className="text-gray-500"  >
                $29.99
            </p>
        

            <button b-type="button" b-parent="ba3b5d" b-id="b22wne" b-findex="a2" className="mt-4 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors"  >
                Add to Cart
            </button>
        
            </div>
        
            </div>
        
            </div>
        
            </div>
        

            <div b-type="div" b-parent="start" b-id="bhz7o8" b-findex="aD" className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg"  >
                
            <h2 b-type="h2" b-parent="bhz7o8" b-id="bhhcmf" b-findex="a0" className="text-xl font-bold mb-4"  >
                Signup Form
            </h2>
        

            <form b-type="form" b-parent="bhz7o8" b-id="b12hmm" b-findex="a1"  >
                
            <div b-type="div" b-parent="b12hmm" b-id="bjmdh7" b-findex="a0" className="mb-6"  >
                
            <label b-type="label" b-parent="bjmdh7" b-id="b2sci7" b-findex="a0" className="block text-sm font-medium mb-2"  >
                Full Name
            </label>
        
<input b-type="input" b-parent="bjmdh7" b-id="busyx5" b-findex="a1" type="text" className="w-full border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-200" />
            </div>
        

            <div b-type="div" b-parent="b12hmm" b-id="bmyzre" b-findex="a1" className="mb-6"  >
                
            <label b-type="label" b-parent="bmyzre" b-id="b94ohm" b-findex="a0" className="block text-sm font-medium mb-2"  >
                Email Address
            </label>
        
<input b-type="input" b-parent="bmyzre" b-id="bvxxxv" b-findex="a1" type="email" className="w-full border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-200" />
            </div>
        

            <div b-type="div" b-parent="b12hmm" b-id="b8tjbs" b-findex="a2" className="mb-6"  >
                
            <label b-type="label" b-parent="b8tjbs" b-id="bsfus8" b-findex="a0" className="block text-sm font-medium mb-2"  >
                Password
            </label>
        
<input b-type="input" b-parent="b8tjbs" b-id="bxw8wn" b-findex="a1" type="password" className="w-full border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-200" />
            </div>
        

            <button b-type="button" b-parent="b12hmm" b-id="bf1xyw" b-findex="a3" type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors"  >
                Submit
            </button>
        
            </form>
        
            </div>
        

            <div b-type="div" b-parent="start" b-id="brwkds" b-findex="aE" className="p-6 bg-gray-100"  >
                
            <h1 b-type="h1" b-parent="brwkds" b-id="boz9iz" b-findex="a0" className="text-2xl font-bold mb-6"  >
                Analytics Dashboard
            </h1>
        

            <div b-type="div" b-parent="brwkds" b-id="bq1r5y" b-findex="a1" className="grid grid-cols-3 gap-6 mb-6"  >
                
            <div b-type="div" b-parent="bq1r5y" b-id="b72xt8" b-findex="a0" className="bg-white p-4 rounded-lg shadow"  >
                
            <h3 b-type="h3" b-parent="b72xt8" b-id="b8qd78" b-findex="a0" className="text-sm font-semibold text-gray-500"  >
                Monthly Users
            </h3>
        

            <p b-type="p" b-parent="b72xt8" b-id="bxnr7r" b-findex="a1" className="text-3xl font-bold mt-2"  >
                45,000
            </p>
        
            </div>
        

            <div b-type="div" b-parent="bq1r5y" b-id="bnctdl" b-findex="a1" className="bg-white p-4 rounded-lg shadow"  >
                
            <h3 b-type="h3" b-parent="bnctdl" b-id="boewql" b-findex="a0" className="text-sm font-semibold text-gray-500"  >
                New Subscriptions
            </h3>
        

            <p b-type="p" b-parent="bnctdl" b-id="bciuii" b-findex="a1" className="text-3xl font-bold mt-2"  >
                1,200
            </p>
        
            </div>
        

            <div b-type="div" b-parent="bq1r5y" b-id="bfz1cr" b-findex="a2" className="bg-white p-4 rounded-lg shadow"  >
                
            <h3 b-type="h3" b-parent="bfz1cr" b-id="bw0pv8" b-findex="a0" className="text-sm font-semibold text-gray-500"  >
                Revenue
            </h3>
        

            <p b-type="p" b-parent="bfz1cr" b-id="b6u1x9" b-findex="a1" className="text-3xl font-bold mt-2"  >
                $98,000
            </p>
        
            </div>
        
            </div>
        

            <div b-type="div" b-parent="brwkds" b-id="bzxqfu" b-findex="a2" className="bg-white p-6 rounded-lg shadow mb-6"  >
                
            <h3 b-type="h3" b-parent="bzxqfu" b-id="bzwcea" b-findex="a0" className="text-lg font-bold mb-4"  >
                User Growth (Last 6 Months)
            </h3>
        

            <div b-type="div" b-parent="bzxqfu" b-id="busd9t" b-findex="a1" className="flex space-x-2"  >
                
            <div b-type="div" b-parent="busd9t" b-id="bqdwb4" b-findex="a0" className="h-16 bg-blue-500 w-6 rounded"  >
                
            </div>
        

            <div b-type="div" b-parent="busd9t" b-id="b1n7f0" b-findex="a1" className="h-24 bg-blue-500 w-6 rounded"  >
                
            </div>
        

            <div b-type="div" b-parent="busd9t" b-id="bh7ibj" b-findex="a2" className="h-32 bg-blue-500 w-6 rounded"  >
                
            </div>
        

            <div b-type="div" b-parent="busd9t" b-id="b5dv4k" b-findex="a3" className="h-40 bg-blue-500 w-6 rounded"  >
                
            </div>
        

            <div b-type="div" b-parent="busd9t" b-id="bmet54" b-findex="a4" className="h-20 bg-blue-500 w-6 rounded"  >
                
            </div>
        

            <div b-type="div" b-parent="busd9t" b-id="b7weqx" b-findex="a5" className="h-36 bg-blue-500 w-6 rounded"  >
                
            </div>
        
            </div>
        
            </div>
        

            <div b-type="div" b-parent="brwkds" b-id="bhgwd4" b-findex="a3" className="bg-white p-6 rounded-lg shadow flex justify-center"  >
                
            <div b-type="div" b-parent="bhgwd4" b-id="b630a1" b-findex="a0" className="relative w-40 h-40"  >
                
            <div b-type="div" b-parent="b630a1" b-id="b77yzu" b-findex="a0" className="absolute inset-0 bg-blue-500 rounded-full" style={{clipPath:"circle(50% at 50% 50%)"}}  >
                
            </div>
        

            <div b-type="div" b-parent="b630a1" b-id="bkl2wv" b-findex="a1" className="absolute inset-0 bg-green-500 rounded-full" style={{clipPath:"polygon(50% 50%, 0% 50%, 50% 0%)"}}  >
                
            </div>
        

            <div b-type="div" b-parent="b630a1" b-id="bqok36" b-findex="a2" className="absolute inset-0 bg-yellow-500 rounded-full" style={{clipPath:"polygon(50% 50%, 50% 0%, 100% 50%)"}}  >
                
            </div>
        
            </div>
        
            </div>
        
            </div>
        

		{(()=>{
			const DATA = data.b4xgm3.items; const B = data.b4xgm3;
			return (
            <div b-type="div" b-parent="start" b-id="b4xgm3" b-findex="aF" className="p-2 border border-gray-300 rounded"  >
                
            <div b-type="div" b-parent="b4xgm3" b-id="bdlh2n" b-findex="a0" className="flex flex-col gap-2 items-center justify-center"  >
                
            <div b-type="div" b-parent="bdlh2n" b-id="bog05v" b-findex="a0" className="flex flex-row relative"  >
                
		{(()=>{
			const D = GFN.GET_ARRAY(DATA); ;
			return D.map(
				(V, idx)=>{
					return (
            <div b-type="div" b-parent="bog05v" b-id="b9cex0" b-findex="a0" className="w-[300px] overflow-x-hidden z-[2] p-2 bg-transparent" b-mapid={'b9cex0--' + (V.id || idx)} key={V.id || idx} >
                
            <div b-type="div" b-parent="b9cex0" b-id="brl5iy" b-findex="a0" action="select" className={UTILS.cn('w-full cursor-pointer py-2 px-4 rounded shadow-lg rounded-full flex items-center justify-center', {'bg-[--secondary-50]': B.query({V, idx, D, pre: 'b-sel'})})} onClick={async (e) => {
				
				
				
				e = {...e} // fix: e.currentTarget
				await B.select({V, idx, D});
			}} b-mapid={'b9cex0--' + (V.id || idx)}  >
                {V.name}
            </div>
        
            </div>
        )
				}
			)
		})()}
	

            <motion.div b-type="motion.div" b-parent="bog05v" b-id="bhv0u4" b-findex="a1" className="absolute left-0 top-0 bottom-0 rounded-full bg-[--info-300] w-[300px] z-[1]" initial={false} animate={{x: DATA.findIndex(tab => B.is_selected({V: tab})) * 300}} transition={{ type: 'spring', stiffness: 300, damping: 30 }}  >
                
            </motion.div>
        
            </div>
        

            <div b-type="div" b-parent="bdlh2n" b-id="b2qw55" b-findex="a1" className="border border-gray-300 rounded-xl p-4"  >
                
		{(()=>{
			const D = GFN.GET_ARRAY(DATA); ;
			return D.map(
				(V, idx)=>{
					return (
            <div b-type="div" b-parent="b2qw55" b-id="bpjsqv" b-findex="a0" b-mapid={'bpjsqv--' + (V.id || idx)} key={V.id || idx} >
                { B.is_selected({V, idx}) && (<div b-type="div" b-parent="bpjsqv" b-id="bt8xn5" b-findex="a0" b-mapid={'bpjsqv--' + (V.id || idx)}  >
                { V?.id === 1 && (<div b-type="div" b-parent="bt8xn5" b-id="bf3bc5" b-findex="a0" name="TAB-CONT1" b-mapid={'bpjsqv--' + (V.id || idx)}  >
                
            <div b-type="div" b-parent="bf3bc5" b-id="b7977h" b-findex="a0" b-mapid={'bpjsqv--' + (V.id || idx)}  >
                ONE: {V.name}
            </div>
        
            </div>) }
{ V?.id === 2 && (<div b-type="div" b-parent="bt8xn5" b-id="b9ych8" b-findex="a1" name="TAB-CONT2" b-mapid={'bpjsqv--' + (V.id || idx)}  >
                
            <div b-type="div" b-parent="b9ych8" b-id="bykirw" b-findex="a0" b-mapid={'bpjsqv--' + (V.id || idx)}  >
                TWO : {V.name}
            </div>
        
            </div>) }
{ V?.id === 3 && (<div b-type="div" b-parent="bt8xn5" b-id="bgnv42" b-findex="a2" name="TAB-CONT3" b-mapid={'bpjsqv--' + (V.id || idx)}  >
                
            <div b-type="div" b-parent="bgnv42" b-id="by0s7y" b-findex="a0" b-mapid={'bpjsqv--' + (V.id || idx)}  >
                THREE: {V.name}
            </div>
        
            </div>) }
            </div>) }
            </div>
        )
				}
			)
		})()}
	
            </div>
        
            </div>
        
            </div>
        )
		})()}
	

            <div b-type="div" b-parent="start" b-id="bmcriz" b-findex="aG" name="dropdown-menu" className="p-8 text-[--primary-500]"  >
                
            <style b-type="style" b-parent="bmcriz" b-id="bfm621" b-findex="a0"  >
                {`details[open] .arrow {
            transform: rotate(180deg);
        }`}
            </style>
        

            <details b-type="details" b-parent="bmcriz" b-id="bm03fi" b-findex="a1" className="flex items-center gap-2 relative"  >
                
            <summary b-type="summary" b-parent="bm03fi" b-id="beo9hb" b-findex="a0" className="flex items-center gap-2 border border-[--primary-500] rounded-lg px-2"  >
                
            <span b-type="span" b-parent="beo9hb" b-id="bmpsu1" b-findex="a0"  >
                Sort By
            </span>
        

            <iconify-icon b-type="iconify-icon" b-parent="beo9hb" b-id="baxcx6" b-findex="a1" class="arrow" icon="lineicons:chevron-down"  >
                
            </iconify-icon>
        
            </summary>
        

            <div b-type="div" b-parent="bm03fi" b-id="bw17yz" b-findex="a1" name="dropdown-menu-content" className="absolute z-[10] right-0 flex flex-col gap-1 border border-[--primary-500] rounded-lg p-2 mt-2 text-nowrap bg-white/95"  >
                
            <div b-type="div" b-parent="bw17yz" b-id="byetsm" b-findex="a0" className="text-lg"  >
                New Arrivals
            </div>
        

            <div b-type="div" b-parent="bw17yz" b-id="b0rost" b-findex="a1" name="dropdown-menu-item" className="hover:underline cursor-pointer"  >
                Item 1
            </div>
        

            <div b-type="div" b-parent="bw17yz" b-id="bw088g" b-findex="a2" name="dropdown-menu-item" className="hover:underline cursor-pointer"  >
                Item 2
            </div>
        

            <div b-type="div" b-parent="bw17yz" b-id="bkxurf" b-findex="a3" name="dropdown-menu-item" className="hover:underline cursor-pointer"  >
                Item 3
            </div>
        
            </div>
        
            </details>
        
            </div>
        

            <div b-type="div" b-parent="start" b-id="baaxsl" b-findex="aH" name="navbar" className="w-full flex items-center rounded-[16px] bg-white/90 shadow-2xl justify-between backdrop-blur-sm"  >
                
            <div b-type="div" b-parent="baaxsl" b-id="bixkst" b-findex="a0" className="w-full rounded-[16px] px-5 py-4 flex items-center justify-center hover:bg-[--tertiary-100] cursor-pointer gap-1 text-[#616161] flex-col"  >
                
            <iconify-icon b-type="iconify-icon" b-parent="bixkst" b-id="bchey9" b-findex="a0" icon="lucide:house" width="64" height="64"  >
                
            </iconify-icon>
        

            <div b-type="div" b-parent="bixkst" b-id="b150kz" b-findex="a1" className="w-full flex items-center justify-center display-font text-[12px]"  >
                Home
            </div>
        
            </div>
        

            <div b-type="div" b-parent="baaxsl" b-id="b42xrx" b-findex="a1" className="w-full rounded-[16px] px-5 py-4 flex items-center justify-center hover:bg-[--tertiary-100] cursor-pointer gap-1 text-[#616161] flex-col"  >
                
            <iconify-icon b-type="iconify-icon" b-parent="b42xrx" b-id="bs5nro" b-findex="a0" icon="lucide:heart" width="64" height="64"  >
                
            </iconify-icon>
        

            <div b-type="div" b-parent="b42xrx" b-id="bg5axh" b-findex="a1" className="w-full flex items-center justify-center display-font text-[12px]"  >
                Favorites
            </div>
        
            </div>
        

            <div b-type="div" b-parent="baaxsl" b-id="bsfmvc" b-findex="a2" className="w-full rounded-[16px] px-5 py-4 flex items-center justify-center hover:bg-[--tertiary-100] cursor-pointer gap-1 text-[#616161] flex-col"  >
                
            <iconify-icon b-type="iconify-icon" b-parent="bsfmvc" b-id="bgi8n5" b-findex="a0" icon="lucide:binoculars" width="64" height="64"  >
                
            </iconify-icon>
        

            <div b-type="div" b-parent="bsfmvc" b-id="b9lsvu" b-findex="a1" className="w-full flex items-center justify-center display-font text-[12px]"  >
                Explore
            </div>
        
            </div>
        

            <div b-type="div" b-parent="baaxsl" b-id="b1h424" b-findex="a3" className="w-full rounded-[16px] px-5 py-4 flex items-center justify-center hover:bg-[--tertiary-100] cursor-pointer gap-1 text-[#616161] flex-col"  >
                
            <iconify-icon b-type="iconify-icon" b-parent="b1h424" b-id="b4o1zu" b-findex="a0" icon="lucide:user" width="64" height="64"  >
                
            </iconify-icon>
        

            <div b-type="div" b-parent="b1h424" b-id="b85dmc" b-findex="a1" className="w-full flex items-center justify-center display-font text-[12px]"  >
                Profile
            </div>
        
            </div>
        
            </div>
        

            <section b-type="section" b-parent="start" b-id="by3lgm" b-findex="aI" className="text-[--neutral-900] text-[length:--text-body]"  >
                
            <div b-type="div" b-parent="by3lgm" b-id="b1hrod" b-findex="a0" className="container mx-auto flex px-5 py-24 items-center justify-center flex-col"  >
                <img b-type="img" b-parent="b1hrod" b-id="bqfg0z" b-findex="a0" className="lg:w-2/6 md:w-3/6 w-5/6 mb-10 object-cover object-center rounded" alt="hero" src="https://dummyimage.com/720x600" />

            <div b-type="div" b-parent="b1hrod" b-id="b7ol6d" b-findex="a1" className="text-center lg:w-2/3 w-full"  >
                
            <h1 b-type="h1" b-parent="b7ol6d" b-id="b9kgqt" b-findex="a0" className="text-[length:--h1] sm:text-[length:--h2] mb-4 text-[--neutral-900]"  >
                Microdosing synth tattooed vexillologist
            </h1>
        

            <p b-type="p" b-parent="b7ol6d" b-id="bpzmod" b-findex="a1" className="mb-8 leading-relaxed"  >
                Meggings kinfolk echo park stumptown DIY, kale chips beard jianbing tousled. Chambray dreamcatcher trust fund, kitsch vice godard disrupt ramps hexagon mustache umami snackwave tilde chillwave ugh. Pour-over meditation PBR&B pickled ennui celiac mlkshk freegan photo booth af fingerstache pitchfork.
            </p>
        

            <div b-type="div" b-parent="b7ol6d" b-id="bumjub" b-findex="a2" className="flex justify-center"  >
                
            <button b-type="button" b-parent="bumjub" b-id="bs57dv" b-findex="a0" className="inline-flex text-[--neutral-50] bg-[--primary-500] border-0 py-2 px-6 focus:outline-none hover:bg-[--primary-600] rounded text-[length:--text-button]"  >
                Request a Demo
            </button>
        

            <button b-type="button" b-parent="bumjub" b-id="bnsqtu" b-findex="a1" className="ml-4 inline-flex text-[--neutral-900] bg-[--neutral-400] border-0 py-2 px-6 focus:outline-none hover:bg-[--neutral-500] rounded text-[length:--text-button]"  >
                Signup
            </button>
        
            </div>
        
            </div>
        
            </div>
        
            </section>
        

            <div b-type="div" b-parent="start" b-id="bnl659" b-findex="aJ" name="hero.video" className="flex flex-col-reverse md:flex-row items-center justify-center mx-auto gap-8 p-12 h-full min-h-[700px]"  >
                
            <div b-type="div" b-parent="bnl659" b-id="b65ac6" b-findex="a0" className="flex flex-col items-center justify-center h-full gap-8"  >
                
            <h1 b-type="h1" b-parent="b65ac6" b-id="bbm8ur" b-findex="a0" className="text-7xl font-bold tracking-tighter leading-tight"  >
                We set the standard for shoppable videos
            </h1>
        

            <p b-type="p" b-parent="b65ac6" b-id="bict4v" b-findex="a1" className="font-medium text-lg"  >
                Tolstoy is the only video commerce platform that boosts sales and enables you to reach new customers.
            </p>
        

            <div b-type="div" b-parent="b65ac6" b-id="b34jtr" b-findex="a2" className="inline-flex w-full gap-4"  >
                
            <button b-type="button" b-parent="b34jtr" b-id="bdp1yk" b-findex="a0" className="px-10 py-4 bg-[--primary-600] hover:bg-[--primary-800] transition-all rounded-md text-white text-lg font-medium whitespace-nowrap"  >
                Primary btn for free
            </button>
        

            <button b-type="button" b-parent="b34jtr" b-id="bt2sle" b-findex="a1" className="px-10 py-4 border-2 border-[--primary-600] hover:bg-gray-100 bg-white transition-all rounded-md text-black text-lg font-medium whitespace-nowrap"  >
                Secondary btn Sales
            </button>
        
            </div>
        
            </div>
        

            <div b-type="div" b-parent="bnl659" b-id="brq9hr" b-findex="a1" className="w-full h-full"  >
                
            <video b-type="video" b-parent="brq9hr" b-id="b3iry8" b-findex="a0" className="object-cover h-96" autoPlay="true" muted="true" src="https://videos.pexels.com/video-files/4365142/4365142-uhd_2560_1440_25fps.mp4"  >
                
            </video>
        
            </div>
        
            </div>
        

            <section b-type="section" b-parent="start" b-id="b3tfd6" b-findex="aK" name="logos.grid" className="py-24"  >
                
            <div b-type="div" b-parent="b3tfd6" b-id="bhsrv1" b-findex="a0" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"  >
                
            <div b-type="div" b-parent="bhsrv1" b-id="b2z6tq" b-findex="a0" className="mb-20 text-center"  >
                
            <span b-type="span" b-parent="b2z6tq" b-id="bx1gaa" b-findex="a0" className="text-[--secondary-600] text-center font-medium mb-4 block"  >
                OUR PARTNERS
            </span>
        

            <h1 b-type="h1" b-parent="b2z6tq" b-id="blgbhj" b-findex="a1" className="text-4xl text-gray-700 text-center font-bold"  >
                We work with the best partners
            </h1>
        
            </div>
        

            <div b-type="div" b-parent="bhsrv1" b-id="bs2r61" b-findex="a1" className="grid grid-cols-1 gap-8 md:grid-cols-2  xl:grid-cols-4"  >
                
		{(()=>{
			const D = GFN.GET_ARRAY(data.bc3asr.items); const B = data.bc3asr;;
			return D.map(
				(V, idx)=>{
					return (
            <a b-type="a" b-parent="bs2r61" b-id="bc3asr" b-findex="a0" href="#" className="flex justify-center items-center border border-solid border-gray-200 shadow-sm h-24 rounded-2xl" b-mapid={'bc3asr--' + (V.id || idx)} key={V.id || idx} >
                
            <iconify-icon b-type="iconify-icon" b-parent="bc3asr" b-id="bbiul1" b-findex="a0" icon={V.icon} width="8rem" height="4rem" b-mapid={'bc3asr--' + (V.id || idx)}  >
                
            </iconify-icon>
        
            </a>
        )
				}
			)
		})()}
	
            </div>
        
            </div>
        
            </section>
        

            <footer b-type="footer" b-parent="start" b-id="bd75xp" b-findex="aL" className="text-[--neutral-600]body-font w-full"  >
                
            <div b-type="div" b-parent="bd75xp" b-id="bovlmv" b-findex="a0" className="container px-5 py-8 mx-auto flex items-center sm:flex-row flex-col"  >
                
            <div b-type="div" b-parent="bovlmv" b-id="bg0je8" b-findex="a0" className="flex flex-row title-font font-medium items-center text-[--neutral-900] mb-4 md:mb-0 w-fit" action="go-to-page" page-id={AS.PAGES[0].bid} onClick={async (e) => {
				
				
				
				e = {...e} // fix: e.currentTarget
				await GFN.bro_go_to_page(e, M, INFO, props, idx);
			}}  >
                <img b-type="img" b-parent="bg0je8" b-id="bv691h" b-findex="a0" src={AS.APP.logo_url} alt="logo" className="w-8 h-8 mr-4" />

            <span b-type="span" b-parent="bg0je8" b-id="b8be97" b-findex="a1" className="whitespace-nowrap"  >
                {AS.APP.name}
            </span>
        
            </div>
        

            <p b-type="p" b-parent="bovlmv" b-id="b5jc68" b-findex="a1" className="text-sm text-[--neutral-500] sm:ml-4 sm:pl-4 sm:border-l-2 sm:border-[--neutral-300] sm:py-2 sm:mt-0 mt-4"  >
                
            <a b-type="a" b-parent="b5jc68" b-id="bnmqfb" b-findex="a0" className="text-[--neutral-700] ml-1" rel="noopener noreferrer" target="_blank"  >
                @author
            </a>
        
            </p>
        

            <span b-type="span" b-parent="bovlmv" b-id="bhevot" b-findex="a2" className="inline-flex sm:ml-auto sm:mt-0 mt-4 justify-center sm:justify-start"  >
                
            <a b-type="a" b-parent="bhevot" b-id="buse58" b-findex="a0" className="text-[--neutral-500]"  >
                
            <svg b-type="svg" b-parent="buse58" b-id="b8n47h" b-findex="a0" fill="currentColor" strokelinecap="round" strokelinejoin="round" strokewidth="2" className="w-5 h-5" viewBox="0 0 24 24"  >
                <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
            </svg>
        
            </a>
        

            <a b-type="a" b-parent="bhevot" b-id="bodg3o" b-findex="a1" className="ml-3 text-[--neutral-500]"  >
                
            <svg b-type="svg" b-parent="bodg3o" b-id="bzwf16" b-findex="a0" fill="currentColor" strokelinecap="round" strokelinejoin="round" strokewidth="2" className="w-5 h-5" viewBox="0 0 24 24"  >
                <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
            </svg>
        
            </a>
        

            <a b-type="a" b-parent="bhevot" b-id="b6xw66" b-findex="a2" className="ml-3 text-[--neutral-500]"  >
                
            <svg b-type="svg" b-parent="b6xw66" b-id="bi4amb" b-findex="a0" fill="none" stroke="currentColor" strokelinecap="round" strokelinejoin="round" strokewidth="2" className="w-5 h-5" viewBox="0 0 24 24"  >
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01"></path>
            </svg>
        
            </a>
        

            <a b-type="a" b-parent="bhevot" b-id="b4eqj5" b-findex="a3" className="ml-3 text-[--neutral-500]"  >
                
            <svg b-type="svg" b-parent="b4eqj5" b-id="bf5u1t" b-findex="a0" fill="currentColor" stroke="currentColor" strokelinecap="round" strokelinejoin="round" strokewidth="0" className="w-5 h-5" viewBox="0 0 24 24"  >
                <path stroke="none" d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"></path><circle cx="4" cy="4" r="2" stroke="none"></circle>
            </svg>
        
            </a>
        
            </span>
        
            </div>
        
            </footer>
        
            </div>
        
		</ErrorBoundary>
	)
}

export default observer(COMP_NAME);