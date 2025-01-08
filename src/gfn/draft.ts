import { produce } from "structurajs"
import {generateNKeysBetween} from"fractional-indexing";

import AS from './AS';
import { get_valid_target_value } from "./inputs";
import { generate_draft_id } from "../utils/draft";


export const draft_on_input = (e: any, M: any, prop_name: string, comp_idx: number, INFO: any, props: any)=>{
    // comp_idx is props.idx || 0 => it is useful when this component is inside a for loop
    // !! it's not idx for the prop.is_many !!

    const v = get_valid_target_value(e);
    if (v === undefined) return;

    const mid = INFO.model_id;
    const cid = INFO.comp_id;
    const eid = M.id;

    const data = {
        [prop_name]: v,
    }

    const did = generate_draft_id(cid, comp_idx);
    AS.GSTORE.update_draft(mid, did, data);
}

export const draft_on_input_idx = (e: any, M: any, prop_name: string, idx: number, comp_idx: number, INFO: any, props: any)=>{
    // here idx is for the prop.is_many
    const value = get_valid_target_value(e);
    if (value === undefined) return;


    const mid = INFO.model_id;
    const cid = INFO.comp_id;
    const eid = M.id;

    const pstate = M[prop_name];
    if(!pstate || !Array.isArray(pstate)) return console.warn("draft_on_input_idx: pstate is not an array", pstate);

    // all array item has to be of the form {id: string, v: any}

    if(!pstate[idx] || !pstate[idx].id) return console.warn("draft_on_input_idx: pstate[idx] is not an object with id", pstate[idx]);

    const npstate = produce(pstate, (draft)=>{
        draft[idx].v = value;
    });

    const data = {
        [prop_name]: npstate,
    }

    const did = generate_draft_id(cid, comp_idx);
    AS.GSTORE.update_draft(mid, did, data);
}




export const draft_on_key_up = (e: any, M: any, prop_name: string, comp_idx: number, INFO: any, props: any)=>{
    const v = get_valid_target_value(e);
    if(v === undefined) return;

    const mid = INFO.model_id;
    const cid = INFO.comp_id;
    const eid = M.id;
    
    const data = {
        [prop_name]: v,
    }

    const did = generate_draft_id(cid, comp_idx);
    AS.GSTORE.update_draft(mid, did, data);
}

export const draft_on_key_up_idx = (e: any, M: any, prop_name: string, idx: number, comp_idx: number, INFO: any, props: any)=>{
    const value = get_valid_target_value(e);
    if(value === undefined) return;

    const mid = INFO.model_id;
    const cid = INFO.comp_id;
    const eid = M.id;

    // const did = generate_draft_id(cid, comp_idx);
    // const D = AS.GSTORE.get_draft(mid, did);
    // if(!D) return console.warn("draft_on_key_up_idx: D is not found", D);

    // we can get the draft and make changes 
    // or
    // we can directly use M as draft and make changes 



    const pstate = M[prop_name];
    if(!pstate || !Array.isArray(pstate)) return console.warn("draft_on_key_up_idx: pstate is not an array", pstate);

    // all array item has to be of the form {id: string, v: any}

    if(!pstate[idx] || !pstate[idx].id) return console.warn("draft_on_key_up_idx: pstate[idx] is not an object with id", pstate[idx]);

    const npstate = produce(pstate, (draft)=>{
        draft[idx].v = value;
    });

    const data = {
        [prop_name]: npstate,
    }

    const did = generate_draft_id(cid, comp_idx);
    AS.GSTORE.update_draft(mid, did, data);
}



// select many
export const draft_on_select_many = (e: any, M: any, prop_name: string, comp_idx: any, INFO: any, props: any)=>{
    alert(" @todo: draft_on_select_many");
    console.warn(" @todo: draft_on_select_many");
}

// select any
export const draft_on_select_any = (e: any, M: any, prop_name: string, comp_idx: any, INFO: any, props: any)=>{
    alert(" @todo: draft_on_select_any");
    console.warn(" @todo: draft_on_select_any");
}



// File
export const draft_on_file_change = async (e: any, M: any, prop_name: string, comp_idx: any, INFO: any, props: any)=>{
    if (!e.target) {
        console.warn(`target is empty`, e.target);
        return;
    }

    const files = e.target.files as FileList|null;
    if (!files) {
        console.warn(`files is empty`, files);
        return;
    }

    if (files.length === 0) {
        console.warn(`files is empty`, files);
        return;
    }

    const value = files[0];

    if (value === undefined) {
        console.warn(`file value is undefined`, value);
        return;
    }


    (value as File&{url: string}).url = URL.createObjectURL(value); // name, type, size already exits

    const mid = INFO.model_id;
    const cid = INFO.comp_id;
    const eid = M.id;

    const data = {
        [prop_name]: value,
    }

    const did = generate_draft_id(cid, comp_idx);
    AS.GSTORE.update_draft(mid, did, data);
}

export const draft_on_file_change_idx = async (e: any, M: any, prop_name: string, idx: number, comp_idx: any, INFO: any, props: any)=>{
    if (!e.target) {
        console.warn(`target is empty`, e.target);
        return;
    }

    const files = e.target.files as FileList|null;
    if (!files) {
        console.warn(`files is empty`, files);
        return;
    }

    if (Array.from(files).length === 0) {
        console.warn(`files is empty`, files);
        return;
    }

    Array.from(files).forEach((f) => {
        (f as File & {url: string}).url = URL.createObjectURL(f); // name, type, size already exits
    });
    const values = files;

    if (values === undefined) {
        console.warn(`value is undefined`, values);
        return;
    }


    const mid = INFO.model_id;
    const cid = INFO.comp_id;
    const eid = M.id;

    const pstate = M[prop_name];
    if(!pstate || !Array.isArray(pstate)) return console.warn("draft_on_file_change_idx: pstate is not an array", pstate);

    // all array item has to be of the form {id: string, v: any}

    if(!pstate[idx] || !pstate[idx].id) return console.warn("draft_on_file_change_idx: pstate[idx] is not an object with id", pstate[idx]);



    // convert to ObjectURL
    Array.from(values).forEach((f) => {
        (f as File & {url: string}).url = URL.createObjectURL(f);
    });




    // more than one file can be inserted
    const l = pstate.length;
    const prev_key = idx > 0 ? pstate[idx-1]?.id : null;
    const next_key = idx < l-1 ?  pstate[idx+1].id : null;
    const ids = generateNKeysBetween(prev_key, next_key, values.length);
    const vs:{id: string, v: File}[] = [];
    Array.from(values).map((f, i) => {
        vs.push({id: ids[i], v: f});
    });


    const npstate = produce(pstate, (draft)=>{
        draft.splice(idx, 1, ...vs);
    });

    const data = {
        [prop_name]: npstate,
    }

    const did = generate_draft_id(cid, comp_idx);
    AS.GSTORE.update_draft(mid, did, data);
}



// Filter

// 