import { observer } from "mobx-react-lite"

import fallbackRender from "@/utils/ErrorBoundaryFallback";
import { ErrorBoundary } from "react-error-boundary";
import GFN from "@/GFN";



const BROKEN_JSX = () => <div></div>


const NUMBER_CREATE_ONE = (PROPS: any) => {
    const M = PROPS.M;
    const props = PROPS.props;
    const idx = PROPS.idx;
    const INFO = PROPS.INFO;
 
    

    return (
        <ErrorBoundary fallbackRender={fallbackRender} onReset={(d) => { console.error(d) }}>
                <input b-type="input" b-parent="elements" b-id="number--create-one" b-findex="a0" name="number--create-one" type="number" id="bro:prop-name" placeholder="bro:prop-name" action="oninput-update-m" className="w-full rounded-md border-[1.4px] border-gray-200 bg-white px-3 py-2 leading-6 transition-all selection:bg-violet-400 selection:text-white placeholder:text-base placeholder:font-normal placeholder:text-gray-400 hover:border-gray-400 focus:border-gray-200 focus:outline-2 focus:outline-offset-2 focus:outline-violet-600" onInput={async (e) => {
				
				
				
				await GFN.bro_on_input(e, M, INFO, props, idx);
			}} />
		</ErrorBoundary>
    )
}

export default observer(NUMBER_CREATE_ONE);