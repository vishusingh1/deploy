import { ACTION, BRO_ACTION_T } from "./action"
import { T_FILTERS, T_FILTER_ATOM } from "./fe-query/filter"
import { T_QUERY_PARAMS } from "./fe-query/query"
import { FUNCTIONS } from "./function"

export interface G_TYPE {
    actions: BRO_ACTION_T[] // functions specific to some events
    fns: {[name: string]: FUNCTIONS} // general functions
    // g_fn: typeof GFN
    // api: api
}

export type OBJ_WITH_ID = {
    id: string|number,
    [k:string]: any
}

export type GET_MANY_RESULT = {
    params: T_QUERY_PARAMS, // qid is mostly hash or this so we keep a copy for debugging
    queried_at: number,
    data: OBJ_WITH_ID[],
    errors?: string[],
    warnings?: string[],
}


export type PROP_EVENT_NAME             = "set_prop" | "update_prop" | "delete_prop" 
export type ONE_ENTITY_EVENT_NAME       = "create" | "set" | "update" | "delete" | "select"
export type MANY_ENTITY_EVENT_NAME      = "set" | "update" | "delete"
export type SELECT_ENTITY_EVENT_NAME    = "select" | "deselect"
export type DRAFT_EVENT_NAME            = "set" | "update" | "delete" | "relation_set" | "relation_update" | "relation_delete" | "commited"
//draft event commited is when the data is commited to the server
 // set is when we are setting the data for the first time
 // update is change in the data


// @todo: add another event name saying nothing has changed,
// this is to let the component querying know that query params has not changed 
// this helps in setting a state to some values (setLoading (false) ), 
// given that we are not queying  directly from  component

export type QUERY_PARAMS_EVENT_NAME     = "changed" | "filter_changed" | "limit_changed" | "sort_changed" 



// export type ENTITY_EVENT_NAME = 'set' | 'set_prop' | 'delete' | 'delete_prop' | 'select';
// export type COLLECTION_EVENT_NAME = 'set';

export type ONE_ENTITY_EVENT_TYPE = {
    type: "ONE_ENTITY_EVENT",
    name: ONE_ENTITY_EVENT_NAME | PROP_EVENT_NAME,
    mid: string,                        // model id
    eid: string|number,                 // entity id
    cid?: string,                       // component id
    data: OBJ_WITH_ID

    props? : string[],                  // when props are changed
    source?: string[]
}

export type SELECT_EVENT_TYPE = {
    type : "SELECT_EVENT",
    name: SELECT_ENTITY_EVENT_NAME,
    mid: string,
    cid?: string,                       // component id is not required to select or deselect
    eids : (string|number)[]
}

export type MANY_ENTITY_EVENT_TYPE = {
    type: "MANY_ENTITY_EVENT",
    name: MANY_ENTITY_EVENT_NAME,
    mid: string,                        // model id
    cid?: string,                       // component id
    idx?: number,                       // component index when inside a map

    qid?: string,                       // query id

    // params: we will not send qparams -> it's already included in data: GET_MANY_RESULT
    data: GET_MANY_RESULT

    // which entities are changed
    eids? : (string|number)[],  
    source: string[]
}

export type QUERY_PARAMS_EVENT_TYPE = {
    type: "QUERY_PARAMS_EVENT",
    name: QUERY_PARAMS_EVENT_NAME,
    mid: string
    qid: string,
    data: T_QUERY_PARAMS
    source: string[]
}

// export type FILTER_EVENT_TYPE = {
//     type: 'filter',
//     model_id: string,
//     comp_id: string,
//     params: T_QUERY_PARAMS_LEVEL_1,
// }

export type MESSAGE_EVENT_TYPE = {
    type: "MESSAGE_EVENT",
    level: "error"|"warning"|"debug"|"log"|"verbose",
    mid: string,
    cid?:string,
    eid?: string|number,
    message : "CREATED" | "CREATING" | "CREATE_FAILED" | "UPDATED" | "UPDATING" | "UPDATE_FAILED" | "DELETED" | "DELETING" | "DELETE_FAILED" | "FETCHED" | "FETCHING" | "FETCH_FAILED"
    data : any
}

export type DRAFT_EVENT_TYPE = {
    type : "DRAFT_EVENT",
    name : DRAFT_EVENT_NAME,
    mid : string,
    did : string,
    data : OBJ_WITH_ID,

    props? : string[], // what props are changed
}


export type FILTER_EVENT_TYPE = {
    cid         : string,
    type        :   'FILTER_EVENT',
    mid         :   string,
    data        :   T_FILTERS|T_FILTER_ATOM,
    source      :   string[],
    idx?        :   number,
    op          :   string,
}







export type UPDATE_BODY = {
    id : string,
    add : {
        [key : string] : any
    },
    delete : {
        [key : string] : any
    }
}

export type OBJECT_TYPE = {
    [key : string] : any
}