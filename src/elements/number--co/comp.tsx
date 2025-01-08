import { observer } from "mobx-react-lite"

import fallbackRender from "@/utils/ErrorBoundaryFallback";
import { ErrorBoundary } from "react-error-boundary";
import GFN from "@/GFN";
import UTILS from "@/utils";



const BROKEN_JSX = () => <div></div>


const NUMBER_CREATE_ONE = (PROPS: any) => {
    const M = PROPS.M;
    const props = PROPS.props;
    const idx = PROPS.idx;
    const INFO = PROPS.INFO;

    

    return (
        <ErrorBoundary fallbackRender={fallbackRender} onReset={(d) => { console.error(d) }}>
            <BROKEN_JSX />
		</ErrorBoundary>
    )
}

export default observer(NUMBER_CREATE_ONE);