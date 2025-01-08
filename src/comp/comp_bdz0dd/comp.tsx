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
import { generate_query_id } from "../../utils/draft";



// import { T_INFO } from "../../types/comp";
// import { T_QUERY_PARAMS } from "../../types/query";
// import { OBJ_WITH_ID } from "../../types/g-type";



// INJECT IMPORTS HERE
// b@imports









const EN_BROKEN_COMP_LOGS = window.EN_BROKEN_COMP_LOGS || {};




// local code - e.g sub components
// b@locals

const BROKEN_JSX = () => <div className="flex items-center justify-center text-gray-500 font-semibold bg-gray-100">DEFAULT GET_MANY </div>



const DEFAULT_OPTION =  {
	xAxis: {
	  type: 'category',
	  data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
	},
	tooltip: {
		trigger: 'axis'
	},
	yAxis: {
	  type: 'value'
	},
	series: [
	  {
		data: [120, 200, 150, 80, 70, 110, 130],
		name: "Value",
		type: 'line'
	  }
	]
};


// b@comp-name
const COMP_NAME = (props: any) => {

	// RxJs Subscriptions - to be destroyed on unmount
	const subs = useRef<Subscription[]>([]);
	const ChartRef = useRef<any>(null);
	const ECContRef = useRef<HTMLDivElement>(null);



	// FOR IS_MANY
	let idx = props.idx;   // also for protection from error when we might think is many but it's not
	let V = props.V || {}; // for protection from error


	// REPLACE INFO HERE - NEXT LINE after b@
	// b@info
	const INFO:T_INFO = { mid: "", model_name: "", prop_name: "", op: "", cid: "echarts", cidx:idx};


	// b@freeze
	const FREEZE = props.freeze;	// frozen data - so that we don't query db, This wi



	// STATES
	const MIDATA 						= FREEZE 
											? GFN.GET_ARRAY(FREEZE) 
											: GFN.GET_ARRAY(props.M);		// model initial data
	const [M,  SET_M ] 					= useState(MIDATA);					// model data
	const [SM, SET_SM] 					= useState(null);					// selected model data

	
	const CS = UTILS.GET_STATE(INFO, "COMP")		// local state 	- only for this comp
	const GS = AS.GSTORE.GLOBAL_STATE				// global state - shared  but only with this client in this frontend
	const SS = AS.GSTORE.SERVER_STATES				// server state - shared with evryone using this app



	const [option, set_option] = useState(DEFAULT_OPTION); // echarts option

	
	
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


	// FILTERS - for get_many


	// RELATION
	// b@relation

	


	// EFFECTS FOR GET_MANY
	useEffect(()=>{
		init();
		initEcharts();

		return () => {
			// if(INITIALIZING.value) return; // don't unsubscribe if initializing. There is a strange react unmount bug happeing
			subs.current.forEach(s=>s.unsubscribe());
		}
	}, []);


	// change chart option when M changes
	useEffect(()=>{
		if(!ChartRef.current) return;
		const option = generateOption(M);
		ChartRef.current.setOption(option);
	}, [M]);
	


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

	const set_pre = (M: OBJ_WITH_ID[]): OBJ_WITH_ID[] => {
		return M;
	}

	const set_post = (M: OBJ_WITH_ID[]): OBJ_WITH_ID[] => {
		return M;
	}


	const generateOption = (M: OBJ_WITH_ID[]) => {
		let xaxis = props.x;
		let yaxis = props.y;

		const xtype = props.xtype || "category";
		const ytype = props.ytype || "line";

		const mid = INFO.mid;
		const model = AS.APP.models.find(m=>m.id === mid);
	

		// what is yaxis
		if(!yaxis){
			const ignore = ["id", "created_at", "updated_at"];

			
			model?.props.forEach(p=>{
				if(ignore.includes(p.name)) return;
				if(typeof(p.type) !== "number") return;
				yaxis = p.name;
			});
		}
		if(!yaxis) yaxis = "value";


		// what is xaxis
		if(!xaxis){
			xaxis = "created_at";
		}


		const xprop = model?.props.find(p=>p.name === xaxis);
		const yprop = model?.props.find(p=>p.name === yaxis);


		const xy = M.map(e=>{
			let xv = e[xaxis];
			let yv = e[yaxis];

			if(xprop?.type === "datetime"){
				xv = new Date(xv);
			}

			return[xv, yv]
		});

		const option = DEFAULT_OPTION;

		const x = option.xAxis || {data: []};
		const y = option.series[0] || {data: []};

		y.type = ytype;

		x.data = xy.map(e=>e[0]);
		y.data = xy.map(e=>e[1]);

		return option;
	}

	const createEcharts = async (echarts: any) => {
		var chart = echarts.init(ECContRef.current);

		// use props
		const now = Date.now();
		const M = [{id: 1, created_at: now, value: 100}, {id: 2, created_at: now + 86400000, value: 200}, {id: 3,created_at: now + 86400000 * 2, value: 150}]

		const option = generateOption(M);
		chart.setOption(option);
		ChartRef.current = chart;
	}
	
	const initEcharts = async () => {
		if(ChartRef.current) return; // already loaded
		console.log("Loading ECharts");

	
		const onload = ()=>{
			// @ts-ignore
			const EC = window.echarts;
			if(!EC) return console.warn("ECharts not found");
			createEcharts(EC);
		}

		GFN.add_script("echarts", "https://cdn.jsdelivr.net/npm/echarts@5.5.1/dist/echarts.min.js", onload);
	}


	const init = async () => {
		const mid = INFO.mid;
		const cid = INFO.cid;
		if(!mid || !cid) return console.warn("NO MODEL ID OR COMP ID FOUND");


		// remove all previous subs
		subs.current.forEach(s=>s.unsubscribe()); subs.current = [];



		// default query id
		const qid = INFO.query?.qid || generate_query_id(cid, idx);
		// query id provided by user || default query id
		subs.current.push(AS.GSTORE.subscribe_many(mid, qid, (e)=>{
			const data = e.data.data || [];
			SET_M(set_pre(data));
		}));

		// @question: what about url qid 





		// on create, delete, update
		subs.current.push(AS.GSTORE.subscribe((e)=>{
			if(e.mid !== mid) return;

			
			// on delete query again // @todo: this can be optimised further by checking if the deleted entity is in the list of this data
			if(e.type === "ONE_ENTITY_EVENT" && e.name === "delete"){
				GFN.bro_get_many({}, M, INFO, props, idx);
				return;
			}


			// on update // this can be optimised further by checking if the updated entity is in the list of this data
			if(e.type === "ONE_ENTITY_EVENT" && e.name === "update"){
				GFN.bro_get_many({}, M, INFO, props, idx);
				return;
			}

			if(e.type === "ONE_ENTITY_EVENT" && e.name === "create"){
				// remove models cached list // this will remove for all components
				AS.GSTORE.remove_cached_list(mid);
				GFN.bro_get_many({}, M, INFO, props, idx);
				return;
			}
		}));


		// on filter change => subs
		subs.current.push(AS.GSTORE.subscribe((e)=>{
			if(e.type !== "QUERY_PARAMS_EVENT") return;
			if(e.mid !== mid || e.qid !== qid) return;

			// QP changed => again query
			GFN.bro_get_many({}, M, INFO, props, idx);
		}));


		// query first time
		GFN.bro_get_many({}, M, INFO, props, idx);



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
	INFO.query		  	= VARS.query;
	INFO.on_created     = props.on_created 	|| props.INFO?.on_created;
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
			<div className="w-full h-full min-h-10 " ref={ECContRef}></div>
		</ErrorBoundary>
	)
}

export default observer(COMP_NAME);