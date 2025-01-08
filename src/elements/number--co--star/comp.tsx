import { observer } from "mobx-react-lite"

import fallbackRender from "@/utils/ErrorBoundaryFallback";
import { ErrorBoundary } from "react-error-boundary";
import { useState } from "react";
import { cn } from "@/utils/cn";
import { generate_draft_id } from "@/utils/draft";
import { T_INFO } from "@/broken-types/comp";

import AS from "@/gfn/AS";
import UTILS from "@/utils";



const BROKEN_JSX = () => <div></div>


const NUMBER_CREATE_ONE = (props: any) => {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);

    const handleClick = (index) => {
        setRating(index);
        if (props.onChange) {
            props.onChange(index);
        }

        const INFO:T_INFO = props.INFO;
        const did = generate_draft_id(INFO.cid, INFO.cidx);
        const propname = props.name;
        if(!propname) return console.warn("NO PROP NAME FOUND IN PROPS");

        AS.GSTORE.update_draft(INFO.mid, did, {[propname]: index + 1});
    };

    const max = props.max || 5;

    return (
        <ErrorBoundary fallbackRender={fallbackRender} onReset={(d) => { console.error(d) }}>
            {[...Array(max)].map((V, idx)=>(
                <BROKEN_JSX />
            ))}
        </ErrorBoundary>
    )
}

export default observer(NUMBER_CREATE_ONE);