import AS from "@/gfn/AS";
import { observer } from "mobx-react-lite";


// This component is only for showing suggestion during development 
// It has no other purpose or effect on the app other than during the dev time 
// on press of S we will show and hide dev mode


const BROKEN_JSX        = () => <div className="flex items-center justify-center text-gray-500 font-semibold bg-gray-100 p-8 rounded-md"> DEV PREVIEW </div>


const DevPreview = () => {

    const devpreview = AS.GSTORE.devpreview;
    if(!devpreview) return null;

    return (
        <div className="z-50 fixed top-0 left-0 w-full h-full bg-slate-400 bg-opacity-50">
            <div className="flex flex-col items-center justify-center h-full">
                <div className="text-white text-2xl">
                    <BROKEN_JSX />
                </div>
            </div>
        </div>
    )
}

export default observer(DevPreview);