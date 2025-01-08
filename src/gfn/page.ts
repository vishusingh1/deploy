import GFN from "../GFN";
import { EN_BROKEN_G_FN_LOGS } from "./logs";
import AS from './AS';
import { T_INFO } from "../broken-types/comp";
import { PAGE_TYPE } from "@/broken-types/g_fn";
import { get_attr_from_event } from "./events";
import { T_BRO_EVENT, T_JS_EVENT } from "./types";
import { feedback, json5_parse } from "./utils";

export const runtime_select_next_page = function (is_reverse: boolean) {

    if (AS.is_dev) return; // page change will be done by the host app


    const pages = AS.PAGES;
    if (pages.length < 2) return;

    const sp = AS.PAGE;
    if (!sp) return AS.goto_page(pages[0]);

    const i = pages.findIndex((p) => p.bid === sp.bid);
    if (i === -1) return;

    let ni = (i + 1) % pages.length;
    if (is_reverse) {
        ni = (i - 1 + pages.length) % pages.length;
    }

    const next_page = pages[ni];
    AS.goto_page(next_page);
};


type T_PAGE_PARAMS = T_BRO_EVENT & {page?: PAGE_TYPE, state?: any} | T_JS_EVENT & {page?: PAGE_TYPE, state?: any, e: undefined};
export const bro_go_to_page = function ( params: T_PAGE_PARAMS, ...args: any) {

    if(params.page){
        AS.goto_page(params.page, params.state);
        return
    }

    const e = params.e || params; // @todo: migrate to params only

    const page_id = get_attr_from_event(e, ['page-id', 'page'], true);
    if (!page_id) return feedback("Can't go to page: page_id not found", "error");

    const states = get_attr_from_event(e, ['state', 'page-state']);
    const state = states ? json5_parse(states) : null;


    goto_page_byid(page_id, state);
}

// same as bro_goto_page
export const bro_navigate = bro_go_to_page
export const bro_goto_page = bro_go_to_page;

export const bro_go_to_page_by_name = function (name : string, state?: any) {
    const pages = AS.PAGES;
    const page = pages.find(p=>p.name === name);
    if(!page) return;
    AS.goto_page(page, state);
}

export const goto_page_byid = (id: string, state: any) => {
    const page = AS.PAGES.find(p=>p.bid === id);
    if(!page) return console.warn("Page not found: ", id);

    AS.goto_page(page, state);
}



export const find_path_from_page = (page: PAGE_TYPE) => {
    if(!page) return "";

    // In compiler we have
    // const path = (page.getAttribute('path')?.trim() || page.name?.trim() || '').toLowerCase().replaceAll(/[\s]+/g, '-');

    let path = page.path?.trim();
    if(path) {
        return path.toLowerCase().split(' ').join('-');
    }

    path = page.name?.trim();
    if(path) {
        return "/" + path.toLowerCase().split(' ').join('-');
    }
    
    return "/";
}
