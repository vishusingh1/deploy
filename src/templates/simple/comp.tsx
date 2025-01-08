import { useEffect, useRef, useState } from "react";
import {observer} from "mobx-react-lite"


const BROKEN_JSX = () => <div className="flex items-center justify-center text-gray-500 font-semibold bg-gray-100">DEFAULT GET_ONE </div>


const COMP_NAME = (props: any) => {

	useEffect(() => {
		console.log("Simple comp mounted");
	}, []);

	return (
        <BROKEN_JSX />
	)
}

export default observer(COMP_NAME);