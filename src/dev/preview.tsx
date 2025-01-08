import AS from "@/gfn/AS";
import { observer } from "mobx-react-lite";

const DevPreview = () => {

    const devpreview = AS.GSTORE.devpreview;
    if(!devpreview) return null;

    return (
        <div className="z-50 fixed top-0 left-0 w-full h-full bg-black bg-opacity-50">
            <h1>Dev Preview</h1>
            <p>This is a dev preview</p>
        </div>
    )
}

export default observer(DevPreview);