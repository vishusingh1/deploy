import { observer } from "mobx-react-lite"

import fallbackRender from "@/utils/ErrorBoundaryFallback";
import { ErrorBoundary } from "react-error-boundary";

import GFN from "@/GFN";
import UTILS from "@/utils";

import { useEffect } from "react";



const BROKEN_JSX = () => <div></div>

const country_list = [
    {name: "Afghanistan", code: "AF"},
    {name: "Åland Islands", code: "AX"},
    {name: "Albania", code: "AL"},
    {name: "Algeria", code: "DZ"},
    {name: "American Samoa", code: "AS"},
    {name: "AndorrA", code: "AD"},
    {name: "Angola", code: "AO"},
    {name: "Anguilla", code: "AI"},
    {name: "Antarctica", code: "AQ"},       
]


const NUMBER_CREATE_ONE = (PROPS: any) => {
    const M = PROPS.M;
    const props = PROPS.props;
    const idx = PROPS.idx;
    const INFO = PROPS.INFO;
    const name = PROPS.name || "";

    useEffect(()=>{}, [PROPS])

    return (
        <ErrorBoundary fallbackRender={fallbackRender} onReset={(d) => { console.error(d) }}>
            <BROKEN_JSX />
		</ErrorBoundary>
    )
}

export default observer(NUMBER_CREATE_ONE);