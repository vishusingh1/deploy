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

            <button b-type="button" b-parent="elements" b-id="number--co--star" b-findex="a0" type="button" key={idx} className={cn("bg-transparent border-none outline-none cursor-pointer", {"text-yellow-400": idx <= (hover || rating), "text-gray-300": idx > (hover || rating)})} onClick={() => handleClick(idx)} onMouseEnter={() => setHover(idx)} onMouseLeave={() => setHover(rating)} name="number--co--star"  >
                
            <svg b-type="svg" b-parent="number--co--star" b-id="b6nt0s" b-findex="a0" fill={idx <= (hover || rating) ? 'currentColor' : 'none'} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-star" dangerouslySetInnerHTML={{ __html: `<svg fill="{idx <= (hover || rating) ? 'currentColor' : 'none'}" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-star" bid="b6nt0s"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>` }}  >
                
            </svg>
        
            </button>
        
            ))}
        </ErrorBoundary>
    )
}

export default observer(NUMBER_CREATE_ONE);