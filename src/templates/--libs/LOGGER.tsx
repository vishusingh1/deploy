import { useEffect, useRef, useState } from "react";
import {OBJ_WITH_ID, T_INFO, T_QUERY_PARAMS} from "../types";

const EN_BROKEN_COMP_LOGS = window.EN_BROKEN_COMP_LOGS || {};


// THIS IS A META UTILITY TEMPLATE FOR LOGGER
// We have LOGGER code that can be inserted into any component
// Only import lib here so that there is no syntax error.
// This component has no other use than just copying some section of it to the comp.tsx while compilation

// see: @BRO:LIBS:LOGGER--BASIC:START ~~ {code} ~~ @BRO:LIBS:LOGGER-BASIC:END
// the code in between will be taken and inserted whereever we find @BRO:LIBS:LOGGER-BASIC in comp.tsx


// The file name should match @BRO:LIBS:{FILE-NAME}--variation
// ex: LOGGER.tsx => @BRO:LIBS:LOGGER--BASIC, LOGGER--PROP-CHANGED


const COMP_LOGGER = (props: any) => {

	const [M,  SET_M ] 					= useState({});
	const INFO:T_INFO = { mid: "", model_name: "", prop_name: "", op: "", cid: "", cidx:0, SET_M };


	

	

	// @BRO:LIBS:LOGGER--BASIC:START
	// LOGS
	useEffect(()=>{
		const LOGOPT = window.EN_BROKEN_COMP_LOGS
		if(LOGOPT.MODEL_EFFECT){
			const MI = INFO.model_name.toUpperCase() + " : " + INFO.op.toUpperCase();
			console.log("MODEL CHANGED : " + MI + "   => ", "model", M, " props", props);
		}
	}, [M]);
	// @BRO:LIBS:LOGGER--BASIC:END






	// @BRO:LIBS:LOGGER--PROP-CHANGED:START
	// LOGS - PROP CHANGED 
	useEffect(()=>{
		const LOGOPT = window.EN_BROKEN_COMP_LOGS
		if(LOGOPT.MODEL_EFFECT){
			const MI = INFO.model_name.toUpperCase() + " : " + INFO.op.toUpperCase();
			console.log("PROPS CHANGED : " + MI + "   => ", "model", M, " props", props);
		}
	}, [props]);
	// @BRO:LIBS:LOGGER--PROP-CHANGED:END



	return (
		<div></div>
	)
}