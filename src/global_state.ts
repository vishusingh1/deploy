import { app_object_type } from "./broken-types/app"
import { PAGE_TYPE } from "./broken-types/g_fn"
import APP_JSON from "./model/app_json"
import PAGES  from "./model/pages"

export const GC:{
    APP_ID: string,
    UI_ID: string,
    PAGES: PAGE_TYPE[],
    PAGE: PAGE_TYPE|null,
    APP_JSON: app_object_type,
    SHOW_LOGIN: boolean,
    CREATOR_ID: string,
    BRANCH: string

} = {
    APP_ID: APP_JSON.id,
    BRANCH: "dev",

    // @todo: get it from ui.ts
    UI_ID: "main",

    // this will get replace during compilation. Make sure it is ONE LINE ONLY
    PAGES: PAGES, 

    PAGE: null,

    APP_JSON: APP_JSON,
    SHOW_LOGIN: true, // if true login page will be shown first
    CREATOR_ID: "REPLACE_WITH_CREATOR_ID" // Creator's user_id of the application [For displaying brokenatom tag dynamically. If the creator upgrades/downgrades the account, this should reflect automatically and show/hide "Built with BrokenAtom" tag."]
}