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
import { observer } from "mobx-react-lite"

// EVERY IMPORT HAS TO BE ../module/file-name
import { subscribe_selected_one } from "@/utils/selected-one";
import { generate_draft_id, generate_query_id } from "@/utils/draft";
import { expose_state } from "@/utils/expose-state";
import fallbackRender from "@/utils/ErrorBoundaryFallback";


import GFN from '../../GFN';
import AS from "../../gfn/AS";
import UTILS from "@/utils/index";

// import {OBJ_WITH_ID, T_INFO, T_QUERY_PARAMS} from "../types";
import { OBJ_WITH_ID, T_INFO, T_QUERY_PARAMS } from "@/comp/types";
import data from "../data/data";
console.dir(data);




// import { T_INFO } from "../../types/comp";
// import { T_QUERY_PARAMS } from "../../types/query";
// import { OBJ_WITH_ID } from "../../types/g-type";



// INJECT IMPORTS HERE
// b@imports









const EN_BROKEN_COMP_LOGS = window.EN_BROKEN_COMP_LOGS || {};




// local code - e.g sub components
// b@locals

const BROKEN_JSX = () => <div className="flex items-center justify-center text-gray-500 font-semibold bg-gray-100">DEFAULT GET_MANY </div>






// b@comp-name
const COMP_NAME = (props: any) => {

	// RxJs Subscriptions - to be destroyed on unmount
	const subs = useRef<Subscription[]>([]);



	// FOR IS_MANY
	let idx = props.idx;   // also for protection from error when we might think is many but it's not
	let V = props.V || {}; // for protection from error



	// STATES
	const [M, SET_M] = useState(props.M || [])	// model data
	const [SM, SET_SM] = useState(null);			// selected model data

	const [errors, set_errors] = useState([]);
	const [warnings, set_warnings] = useState([]);


	// REPLACE INFO HERE - NEXT LINE after b@
	// b@info
	const INFO: T_INFO = { mid: "", model_name: "", prop_name: "", op: "", cid: "comp_manyid", cidx: idx, SET_M };


	// DYNAMIC VARIABLES & FUNCTIONS
	const B: any = {}; // contains actions and common functions
	const VARS: any = {}; // contains variables
	const FNS: any = {}; // contains functions

	// USER DEFINED STATES
	// b@states




	// REFS
	// USER DEFINED REFS
	// b@refs




	// QUERY
	// b@query
	const query: T_QUERY_PARAMS | null = null;


	// FILTERS - for get_many


	// RELATION
	// b@relation
	let relation: { model_id: string, comp_id: string, prop_name: string } | null = null;




	// EFFECTS FOR GET_MANY
	useEffect(() => {
		init();
		initSwiper();

		return () => {
			subs.current.forEach(s => s.unsubscribe());
		}
	}, []);



	// FROM PARENT
	// useEffect(()=>{
	// 	GFN.bro_get_one(INFO, set_M, props);
	// }, [props]);



	// SUBS TO SELECTED ONE
	useEffect(() => subscribe_selected_one(INFO.mid, subs.current, SET_SM), []);



	// LOGS
	useEffect(() => {
		if (EN_BROKEN_COMP_LOGS.MODEL_EFFECT) {
			const MI = INFO.model_name.toUpperCase() + " : " + INFO.op.toUpperCase();
			console.log("MODEL CHANGED : " + MI + "   => ", "model", M, " props", props);
		}
	}, [M]);


	// USER DEFINED EFFECTS
	// b@effects





	// FUNCTIONS

	const set_pre = (M: OBJ_WITH_ID[]): OBJ_WITH_ID[] => {
		return M;
	}

	const set_post = (M: OBJ_WITH_ID[]): OBJ_WITH_ID[] => {
		return M;
	}


	const init = async () => {
		const mid = INFO.mid;
		const cid = INFO.cid;
		if (!mid || !cid) return console.warn("NO MODEL ID OR COMP ID FOUND");


		// remove all previous subs
		subs.current.forEach(s => s.unsubscribe()); subs.current = [];


		//STORE QUERY IN GSTORE	
		if (query) AS.GSTORE.set_query(mid, cid, query, ["SWIPER COMP"]);



		// default query id
		const qid = INFO.query?.qid || generate_query_id(cid, idx);
		if (INFO.query) INFO.query.qid = qid;
		// query id provided by user || default query id
		subs.current.push(AS.GSTORE.subscribe_many(mid, qid, (e) => {
			const data = e.data.data || [];
			SET_M(set_pre(data));
		}));

		// @question: what about url qid 





		// on create, delete, update
		subs.current.push(AS.GSTORE.subscribe((e) => {
			if (e.mid !== mid) return;


			// on delete query again // @todo: this can be optimised further by checking if the deleted entity is in the list of this data
			if (e.type === "ONE_ENTITY_EVENT" && e.name === "delete") {
				GFN.bro_get_many({}, M, INFO, props, idx);
				return;
			}


			// on update // this can be optimised further by checking if the updated entity is in the list of this data
			if (e.type === "ONE_ENTITY_EVENT" && e.name === "update") {
				GFN.bro_get_many({}, M, INFO, props, idx);
				return;
			}

			if (e.type === "ONE_ENTITY_EVENT" && e.name === "create") {
				// remove models cached list // this will remove for all components
				AS.GSTORE.remove_cached_list(mid);
				GFN.bro_get_many({}, M, INFO, props, idx);
				return;
			}
		}));


		// on filter change => subs
		subs.current.push(AS.GSTORE.subscribe((e) => {

			if (e.type !== "QUERY_PARAMS_EVENT") return;
			if (e.mid !== mid || e.qid !== qid) return;
			// QP changed => again query
			// e.data has the new query!
			INFO.query = e.data;
			GFN.bro_get_many({}, M, INFO, props, idx);
		}));


		// query first time
		const GMR = await GFN.bro_get_many({}, M, INFO, props, idx);
		if (GMR && GMR.data && Array.isArray(GMR.data)) {
			SET_M(set_pre(GMR.data));
		}


		// subscribe to selected entity
		subscribe_selected_one(INFO.mid, subs.current, SET_SM);


		return () => {
			subs.current.forEach(s => s.unsubscribe());
		}
	}



	// SWIPER FNS
	// SWIPER FNS
	const ref = useRef<HTMLDivElement>(null);

	const createSwiper = async (Swiper: any) => {
		console.log("Creating Swiper");

		const el = ref.current;
		if (!el) return console.log("No swiper element");

		const direction = props.direction || 'horizontal';
		const slides_per_view = props.slides_per_view || 1;
		const swiper = new Swiper(el, {
			// Optional parameters
			direction: direction,
			loop: props.loop || false,
			slidesPerView: slides_per_view,
			spaceBetween: 10,



			// If we need pagination
			pagination: {
				el: '.swiper-pagination',
				clickable: true,
			},

			// Navigation arrows
			navigation: direction === 'horizontal' ? {
				nextEl: '.swiper-button-next',
				prevEl: '.swiper-button-prev',
			}: undefined,

			// And if we need scrollbar
			scrollbar: {
				el: '.swiper-scrollbar',
			},
		});
	}
	const initSwiper = async () => {
		console.log("Loading Swiper");

		const onload = async () => {
			console.log("SWIPER JS LOADED");
		}

		const keeptrying = () => {
			// @ts-ignore
			const Swiper = window.Swiper;
			if (!Swiper) return console.warn("SWIPER LIB NOT FOUND");
			createSwiper(Swiper);
			return true;
		}
		let tid = setInterval(() => {
			const success = keeptrying();
			if (success) clearInterval(tid);
		}, 1000);

		GFN.add_script("swiper-js", "https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js", onload)
		GFN.add_style("swiper-css", "https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css", () => { })
	}


	// USER DEFINED FUNCTIONS
	// b@functions





	// STATEMENTS
	INFO.SET_M = SET_M;
	INFO.query = query || undefined;
	INFO.on_created = props.on_created || props.INFO?.on_created;
	INFO.on_selected = props.on_selected || props.INFO?.on_selected;
	INFO.prop_name = props.prop_name || props.PM_PN || props.INFO?.prop_name; // inheritance

	// USER DEFINED STATEMENTS
	// b@statements




	// CONDITIONALS ATTRS
	const COND_ATTRS = {};
	//b@cond-attrs







	// DYNAMIC REACT STATES
	const REACT_STATES: { [name: string]: { state: any, set_state: any, defaultValue?: any } } = {};
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
		<ErrorBoundary fallbackRender={fallbackRender} onReset={(d) => { console.error(d) }}>
			<BROKEN_JSX />
		</ErrorBoundary>
	)
}

export default observer(COMP_NAME);