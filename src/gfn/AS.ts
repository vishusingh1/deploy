import { BehaviorSubject, Subject } from "rxjs";
import GFN from "../GFN";
import {GC} from "../global_state";
import { GLOBAL_STORE } from "../state/global-store";
// import { PAGE_TYPE } from "../types/g-fn";
import { EN_BROKEN_G_FN_LOGS } from "./logs";
import { push_state_to_history, runtime_get_url_state } from "./path";
import { BROKEN_USER } from "../user/user";

import { computed, makeObservable, makeAutoObservable ,observable, autorun, action } from "mobx";
import { PAGE_TYPE } from "../broken-types/g_fn";
import { find_path_from_page } from "./page";
import { T_INFO } from "@/broken-types/comp";
import { generate_draft_id } from "@/utils/draft";

const AJ = GC.APP_JSON;
const UI = AJ.version === 2 ? AJ.uis.find(ui=>ui.id===GC.UI_ID) : null;
export class APPLICATION_STATE {
    is_dev: boolean = false;
    is_dev_edit_mode: boolean = false; // will be set by relay.js. Otherwize always false

    enable_login: boolean = UI?.login?.type !== 'none';
    show_login: boolean = GC.SHOW_LOGIN || false; // show login page if enable_login is true



    APP = GC.APP_JSON;
    GSTORE: GLOBAL_STORE = new GLOBAL_STORE();

    PAGES = GC.PAGES;
    PAGE = GC.PAGE;

    USER = new BROKEN_USER('');
    // AVAILABLE_USERS = AVAILABLE_USERS;



    // react router navigate
    routernavigate:((path:string, state?:any)=>void)|null = (path:string, state?: any) => {}; // replace this with react router navigate
    // all navigation should go through this
    navigate = (path:string, state?:any) => {
        // href navigation to path
        if(!path) return;

        // try router navigate
        if(this.routernavigate){
            this.routernavigate(path); // state.relative is necessary for react router so don't pass state here
            return;
        }

        const url = new URL(window.location.href);
        url.pathname = path;
        window.history.pushState(state||{}, '', url.toString());

        // @todo:
        // set the page to the current page
    }


    constructor(){
        makeObservable(this, {
            is_dev: observable,
            is_dev_edit_mode: observable,
            enable_login: observable,
            show_login: observable,

            // non changing
            // APP: observable,
            // GSTORE: observable,

            PAGES: observable, // pages will also not change. But only in dev mode
            PAGE: observable,
            USER: observable,
            // AVAILABLE_USERS: observable,

            // actions
            navigate:           action,
            setPage:            action,
            goto_page:          action,
            // routernavigate:     action, // if set to action then we will not be able to change it. It becomes readonly
        });

        if(this.APP.version === 1){
            this.enable_login = (this.APP.login.type !== 'none');
        }
        else if(this.APP.version === 2){
            this.enable_login = (this.APP.uis.find(ui=>ui.id===GC.UI_ID)?.login.type !== 'none');
        }
    }


    goto_page(page: PAGE_TYPE, state?: any){
        this.PAGE = page;

        const path = find_path_from_page(page);
        if(path){
            this.navigate(path, state);
        }
    }


    // Simply set the page. Don't navigate
    setPage(page: PAGE_TYPE){
        this.PAGE = page;
    }

    getDraft(INFO: T_INFO){
        const did = generate_draft_id(INFO.cid, INFO.idx);
        return this.GSTORE.get_draft(INFO.mid, did);
    }



    db: {
        count: number,                       // keep a count of all transaction
        tx: Subject<{
            type: string,               // create, update, delete
            model_id: string,           // for what model id this transaction is for
            entity_ids: string[],       // what entites are updated
            prop_names: string[],       // what props are updated, * for all
            data: any[],                // what data is updated
            count: number,
        }>,
    } = {
        count: 0,
        tx: new Subject(),
    };
}

const AS = new APPLICATION_STATE();
export default AS;

