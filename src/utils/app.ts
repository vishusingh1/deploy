import { GC } from "@/global_state";

export const GEN_DEPLOY_APP_ID = () => {
    const APPID = GC.APP_ID;

    // maybe branch is already in the appid 
    if(APPID.includes("--")) return APPID;
    const branch = GC.BRANCH;
    if(!branch) return APPID;

    return `${APPID}--${branch}`;
}