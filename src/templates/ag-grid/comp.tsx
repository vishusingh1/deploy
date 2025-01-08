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
import { json5_parse } from "@/gfn/utils";
import { SortComponent } from "./Sorts";
import { get_column_defs } from "./col_defs";



// import { T_INFO } from "../../types/comp";
// import { T_QUERY_PARAMS } from "../../types/query";
// import { OBJ_WITH_ID } from "../../types/g-type";



// INJECT IMPORTS HERE
// b@imports









const EN_BROKEN_COMP_LOGS = window.EN_BROKEN_COMP_LOGS || {};




// local code - e.g sub components
// b@locals

const BROKEN_JSX = () => <div className="flex items-center justify-center text-gray-500 font-semibold bg-gray-100">DEFAULT GET_MANY </div>



const DEFAULT_OPTION: any =  {
    columnDefs: [
        { headerName: "Make", field: "make" },
        { headerName: "Model", field: "model" },
        { headerName: "Price", field: "price" }
    ],
    rowData: [
        { make: "Toyota", model: "Celica", price: 35000 },
        { make: "Ford", model: "Mondeo", price: 32000 },
        { make: "Porsche", model: "Boxster", price: 72000 }
    ] as any[],
    onGridReady: function(params) {
        params.api.sizeColumnsToFit();
		const columnStateStored = localStorage.getItem('myColumnState');
		if (columnStateStored) {
			params.columnApi.applyColumnState({state:json5_parse(columnStateStored), applyOrder:true});
		}
		
    },
	onCellValueChanged: function(params) {
		console.log("onCellValueChanged", params);
		//Implemet update logic, without making an api call
	},
	onColumnMoved(params) {
		var columnState = JSON.stringify(params.columnApi.getColumnState());
		console.log("onColumnMoved", columnState);
		localStorage.setItem('myColumnState', columnState);
	}
}


// b@comp-name
const COMP_NAME = (props: any) => {

	// RxJs Subscriptions - to be destroyed on unmount
	const subs = useRef<Subscription[]>([]);
	const gridRef = useRef(null);
    const gridApiRef = useRef<any>(null);



	// FOR IS_MANY
	let idx = props.idx;   // also for protection from error when we might think is many but it's not
	let V = props.V || {}; // for protection from error



	// STATES
	const [M,  SET_M ] 					= useState(props.M  || [])	// model data
	const [SM, SET_SM] 					= useState(null);			// selected model data
	
	const [errors,		set_errors]		= useState([]);
	const [warnings,	set_warnings]	= useState([]);

	const [option, set_option] = useState(DEFAULT_OPTION); // echarts option
	const [open_sorts, set_open_sorts] = useState(false);



	
	// REPLACE INFO HERE - NEXT LINE after b@
	// b@info
	const INFO:T_INFO = { mid: "", model_name: "", prop_name: "", op: "", cid: "comp_manyid", cidx:idx, SET_M};

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


	// FILTERS - for get_many


	// RELATION
	// b@relation
	let relation:{model_id: string, comp_id: string, prop_name: string}|null = null;

	


	// EFFECTS FOR GET_MANY
	useEffect(()=>{
		init();
		initAGGrid();

		return () => {
			subs.current.forEach(s=>s.unsubscribe());
		}
	}, []);


	// change chart option when M changes
	useEffect(()=>{
		if(!gridApiRef.current) return;
		gridApiRef.current.setRowData(M);
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
			INFO.query = e.data;
			GFN.bro_get_many({}, M, INFO, props, idx);
		}));


		// query first time
		GFN.bro_get_many({}, M, INFO, props, idx);


		return () => {
			subs.current.forEach(s=>s.unsubscribe());
		}
	}




    // AG GRID FNS
    const generateOption = (M: OBJ_WITH_ID[]) => {
        const option = DEFAULT_OPTION;

		const mid = INFO.mid;
		const model = AS.APP.models.find(m=>m.id === mid);
        if(!model) return option;

        option.columnDefs = [];
        option.rowData = [];

        const ignore = ["id", "created_at", "updated_at"];
        model.props.forEach(p=>{
            if(ignore.includes(p.name)) return;
			const col_def = get_column_defs(p);
            option.columnDefs.push(col_def);
        });


        // data
        option.rowData = M;


		return option;
	}

	const createGrid = async (agGrid: any) => {
		const option = generateOption([]);

        const gridApi = agGrid.createGrid(gridRef.current, option);
        gridApiRef.current = gridApi;
	}
	
	const initAGGrid = async () => {


        if(gridApiRef.current) return
        console.log("Loading AG Grid");

        const onload = ()=>{
            // @ts-ignore
            const AG = window.agGrid;
            if(!AG) return console.warn("AG Grid not found");
            createGrid(AG);
        }

        GFN.add_script("ag-grid-community", "https://cdn.jsdelivr.net/npm/ag-grid-community@31.3.2/dist/ag-grid-community.min.js", onload)
        GFN.add_style("ag-theme-alpine", "https://cdn.jsdelivr.net/npm/ag-grid-community@31.3.2/styles/ag-grid.min.css", ()=>{})
	}
    // AG GRID FNS 




    // USER DEFINED FUNCTIONS
    // b@functions





	// STATEMENTS
	INFO.SET_M          = SET_M;
	INFO.query		  	= query || undefined;
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

			<div className="flex flex-row gap-4">

				<div className="bg-gray-100 px-2 py-1 rounded-md"  onClick={()=> {}}>
					filters
				</div>

				<div className="bg-gray-100 px-2 py-1 rounded-md" onClick={()=> {set_open_sorts(!open_sorts)}}>
					sorts
				</div>

			</div>

			{open_sorts && <SortComponent mid={INFO.mid} cid={INFO.cid} idx={idx} />}

			<div className="ag-theme-balham w-full h-full"  ref={gridRef}></div>
		</ErrorBoundary>
	)
}

export default observer(COMP_NAME);

