import { produce, Patch } from "structurajs"
import { generateNKeysBetween,  generateKeyBetween } from 'fractional-indexing';

import { get_attr_from_event } from "./events";
import { T_INFO } from "../broken-types/comp";
import AS from "./AS";
import { GC } from "../global_state";
import api from "@lib/api";
import { get_user_token_api } from "./user";
import { feedback, get_ulid } from "./utils";
import { DEFAULT_RES_SINGLE, DEFAULT_RES_SINGLE_P } from "../broken-types/default_res";
import { get_model } from "./models";
import { generate_draft_id } from "../utils/draft";

export const get_url = async (r: DEFAULT_RES_SINGLE<any>): Promise<string|undefined> => {
    if (!r || !r.success || !r.data) {
        feedback('Unable to upload ', "error");
        return;
    }

    const o = r.data;

    if (!o) {
        feedback('Invalid response for upload ', "error");
        return;
    }

    if (o.url && typeof(o.url) === "string"){
        // files
        // https://uploads.brokenatom.io/file/public
        if(o.url.startsWith("https://uploads.brokenatom.io/file/public")){
            const U = new URL(o.url);
            U.searchParams.delete("token");
            // https://uploads.brokenatom.io/file/public?app_id=zippycms&model_id=hnoqz&entity_id=01j1np8edh6htv0gvprfvz2cx5&prop_id=audio&uid=0
            const r = await fetch(U).catch(e=>{
                console.warn("CAN'T DOWNLOAD PUBLIC FILE", e);
            });

            // this should return 
            // {"success":true,"data":[{"url":"https://pub-40734399c7f94f69a897234644955410.r2.dev/zippycms/hnoqz/01j1np8edh6htv0gvprfvz2cx5/audio/0"}]}
            
            if(!r || !r.ok){
                console.warn("CAN'T DOWNLOAD PUBLIC FILE", r);
                return;
            }

            const data = await r.json().catch(e=>{
                console.warn("CAN'T DOWNLOAD PUBLIC FILE", e);
            });

            if(!data || !data.success) return;
            const finalurl = data.data[0]?.url;
            if(!finalurl) return;

            return finalurl;
        }

        return o.url;
    }
};

export const get_valid_target_value = (e: any, converter?: (v: any)=>any)=>{
    if (!e.target) {
        console.warn(`target is empty`, e.target);
        return;
    }

    const b_type = get_attr_from_event(e, ['type']);

    let value = e.target.value;

    // quill js
    if(b_type === 'rich-text'){
        const quill = e.target.__quill;
        if(quill){
            value = quill.root.innerHTML;
        }
        else {
            // get contenteditable='true' tag

            const ce = e.target.querySelector('[contenteditable="true"]');
            if(ce){
                value = ce.innerHTML;
            }
        }
    }


    // const text_types = ["text", "email", "url", "any_one_of", "description", "date"]

    if (!converter) {
        const type = e.target.type;

        // use all broken types
        if (type === 'number') {
            converter = (v)=>{
                const num = parseFloat(v);
                if(isNaN(num)) return undefined;
                return num;
            }
        } else if (type === 'checkbox') {
            if(b_type === "select-many") {} // select_many take exact value
            else {value = e.target.checked;} // boolean
        } else if (type === 'time') {
            // time is set same as html format
        } else if (type === 'datetime') {
            converter = (v) => new Date(v).getTime();
        } else if (type === 'date') {
            //
        } else if (type === 'datetime-local') {
            converter = (v) => new Date(v).getTime();
        }
        else if(type === 'rich-text'){
            value = e.target.innerHTML;
        }
        //if empty string, return undefined
        else if (['email', 'text', 'any_one_of', 'url', 'description', 'user_id', 'serial', 'password'].includes(type)){
            if(!value || !value.length){
                converter = () => undefined;
            }
        }

        // IMAGES
        // inpute text into text input box but keep b_type="image" then we will be able to display the image
        if (b_type === 'image' && type === 'text') {
            value = { name: '', url: value, size: 0, type: 'image' };
        }
    }

    if (value === undefined) {
        console.warn(`value is undefined`, value, e.target);
        return;
    }

    if (converter) value = converter(value); // e.g Number(value)

    if (value === undefined) {
        console.warn(`value is undefined`, value, e.target);
        return;
    }

    return value;
};

export const check_email_format = (email) => {
    const parts1 = email.split('@');
    if (parts1.length !== 2) return false;
    const parts2 = parts1[1].split('.');
    if (parts2.length !== 2) return false;
    if (parts2[1].length < 2) return false;
    return true;
}


export const on_key_up = function (e, set_m_state, prop_name, converter?: ()=>void) {
    const value = get_valid_target_value(e, converter);
    // if (value === undefined) return;
    //donot return on undefined, empty string is undefined and we will set the value to undefined and pass it
    if (!prop_name) return console.warn('prop_name is empty', e);
    set_m_state((s) => ({ ...s, [prop_name]: value })); // while setting no need to check
}

export const bro_on_key_up = function (e, set_m_state) {
    const name = get_attr_from_event(e, ['b_name', 'name']);
    if (!name) return; // error will be logged in prev fn
    on_key_up(e, set_m_state, name);
}

export const on_key_up_idx = (e, set_m_state, prop_name, idx, converter?: (v: any)=>any) => {
    const value = get_valid_target_value(e, converter);
    if (value === undefined) return;

    set_m_state((s) => {
        const prop_state = s[prop_name];
        if (!prop_state) return s;
        if (!Array.isArray(prop_state)) {
            console.warn(
                `prop state for : ${prop_name} is not an array`,
                prop_state,
                s
            );
            return s;
        }
        prop_state[idx] = value;
        return { ...s, [prop_name]: [...prop_state] };
    });

    // if(e.key === "Enter"){
    //     // @todo: fix state function

    // }
}
export const bro_on_key_up_idx = function (e, set_m_state) {
    const name = get_attr_from_event(e, ['b_name', 'name']);
    if (!name) return; // error will be logged in prev fn
    const idx_s = get_attr_from_event(e, ['b-idx', 'idx']);
    if (!idx_s) return; // error will be logged in prev fn
    const idx = parseInt(idx_s) || 0;
    on_key_up_idx(e, set_m_state, name, idx);
}

export const DEFAULT_FILE_URL = "https://image.lexica.art/full_jpg/1716b9b9-3bdc-4f9f-a933-ecac5b141cbd"

export const on_input = function (e: any, M: any, INFO: T_INFO, prop_name: string, converter?: (v: any)=>any) {
    const value = get_valid_target_value(e, converter);

    const errors: {code: string, message: string}[] = [];
    const mid = INFO.mid;
    const cid = INFO.cid;

    // if(value === undefined){
    //     errors.push({code: "INTERNAL", message: "value is undefined"});
    //     AS.GSTORE.set_error(cid, errors);
    //     return {success: false, errors};
    //     }
        
    const did = generate_draft_id(cid);
    AS.GSTORE.update_draft(mid, did, {[prop_name]: value});

    // @todo: prepare patch  
}

export const bro_on_input = function (e: any, M: any, INFO: T_INFO, props: any, idx?: number, prop_name?: string) {
    const errors: {code: string, message: string}[] = [];
    const mid = INFO.mid;
    const cid = INFO.cid;

    const name = get_attr_from_event(e, ['b-name', 'name']);
    if(!name){
        errors.push({code: "INTERNAL", message: "prop-name not found"});
        AS.GSTORE.set_error(cid, errors);
        return {success: false, errors};
    }
    on_input(e, M, INFO, name);
}

export const on_input_idx = (e:any, M:any, INFO:T_INFO,prop_name:string, idx:number, converter?: (v:any)=>any) => {
    // @todo: fix state function

    const value = get_valid_target_value(e, converter);

    const errors: {code: string, message: string}[] = [];
    const mid = INFO.mid;
    const cid = INFO.cid;

    if(value === undefined){
        errors.push({code: "INTERNAL", message: "value is undefined"});
        AS.GSTORE.set_error(cid, errors);
        return {success: false, errors};
    }


    const did = generate_draft_id(cid);

    const D = AS.GSTORE.get_draft(mid, did);
    if(!D || !D.id) return {success: false, errors: [{code: "INTERNAL", message: "Draft not found"}]};
    const prop_state = D[prop_name] || [];
    if (!prop_state) return {success: false, errors: [{code: "INTERNAL", message: "prop state not found"}]};
    if (!Array.isArray(prop_state)) {
        console.warn(
            `prop state for : ${prop_name} is not an array`,
            prop_state,
            D
        );
        return {success: false, errors: [{code: "INTERNAL", message: "prop state is not an array"}]};
    }

    prop_state[idx].v = value;

    AS.GSTORE.update_draft(mid, did, {[prop_name]: [...prop_state]});
    // set_m_state((s) => {
    //     const prop_state = s[prop_name];
    //     if (!prop_state) {
    //         console.warn(
    //             `prop state for : ${prop_name} doesn't exists: `,
    //             prop_state,
    //             s
    //         );
    //         return s;
    //     }
    //     if (!Array.isArray(prop_state)) {
    //         console.warn(
    //             `prop state for : ${prop_name} is not an array`,
    //             prop_state,
    //             s
    //         );
    //         return s;
    //     }
    //     prop_state[idx].v = value;
    //     return { ...s, [prop_name]: [...prop_state] };
    // });
}

export const bro_on_input_idx = function (e:any, M:any, INFO: T_INFO, props: any, idx?:number) {
    // const set_M = INFO.SET_M;
    const errors: {code: string, message: string}[] = [];
    const mid = INFO.mid;
    const cid = INFO.cid;

    const name = get_attr_from_event(e, ['b_name', 'name']);
    if (!name) {
        errors.push({code: "INTERNAL", message: "prop-name not found"});
        AS.GSTORE.set_error(cid, errors);
        return {success: false, errors};
    };
    const idx_s = get_attr_from_event(e, ['b-idx', 'idx']);
    if (!idx_s) {
        errors.push({code: "INTERNAL", message: "idx not found"});
        AS.GSTORE.set_error(cid, errors);
        return {success: false, errors};
    };
    const idx1 = parseInt(idx_s) || 0;
    on_input_idx(e, M, INFO, name, idx1);
}

// Comprehensive mapping of MIME types to file extensions
const mimeTypeToExtension: { [key: string]: string } = {
    'application/epub+zip': 'epub',
    'application/zip': 'zip',
    'application/x-tar': 'tar',
    'application/gzip': 'gz',
    'application/x-rar-compressed': 'rar',
    'application/x-7z-compressed': '7z',
    'application/x-bzip': 'bz',
    'application/x-bzip2': 'bz2',
    'application/x-lzma': 'lzma',
    'application/x-xz': 'xz',
    'application/x-msdownload': 'exe',
    'application/x-shockwave-flash': 'swf',
    'application/x-font-ttf': 'ttf',
    'application/x-font-otf': 'otf',
    'application/x-font-woff': 'woff',
    'application/x-font-woff2': 'woff2',
    'application/pdf': 'pdf',
    'application/json': 'json',
    'application/xml': 'xml',
    'application/xhtml+xml': 'xhtml',
    'application/atom+xml': 'atom',
    'application/rss+xml': 'rss',
    'application/javascript': 'js',
    'application/x-javascript': 'js',
    'application/x-httpd-php': 'php',
    'application/x-sql': 'sql',
    'application/vnd.ms-excel': 'xls',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
    'application/vnd.ms-powerpoint': 'ppt',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'pptx',
    'application/vnd.ms-word': 'doc',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
    'application/x-rtf': 'rtf',
    'application/x-mspublisher': 'pub',
    'application/x-mswrite': 'wri',
    'text/plain': 'txt',
    'text/html': 'html',
    'text/css': 'css',
    'text/javascript': 'js',
    'text/xml': 'xml',
    'text/csv': 'csv',
    'text/rtf': 'rtf',
    'text/markdown': 'md',
    'text/x-markdown': 'md',
    'text/tab-separated-values': 'tsv',
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/gif': 'gif',
    'image/svg+xml': 'svg',
    'image/webp': 'webp',
    'image/bmp': 'bmp',
    'image/tiff': 'tiff',
    'image/x-icon': 'ico',
    'audio/mpeg': 'mp3',
    'audio/wav': 'wav',
    'audio/ogg': 'ogg',
    'audio/aac': 'aac',
    'audio/flac': 'flac',
    'audio/midi': 'midi',
    'video/mp4': 'mp4',
    'video/x-msvideo': 'avi',
    'video/x-matroska': 'mkv',
    'video/quicktime': 'mov',
    'video/x-flv': 'flv',
    'video/webm': 'webm',
    'video/ogg': 'ogv',
    'video/x-ms-wmv': 'wmv',
    'video/x-m4v': 'm4v',
    'application/x-chrome-extension': 'crx',
    'application/x-mobipocket-ebook': 'mobi',
    'application/x-ns-proxy-autoconfig': 'pac',
    'application/x-pkcs12': 'p12',
    'application/x-pkcs7-certificates': 'p7b',
    'application/x-pkcs7-certreqresp': 'p7r',
    'application/x-pkcs7-mime': 'p7m',
    'application/x-pkcs7-signature': 'p7s',
    'application/x-rar': 'rar',
    'application/rar': 'rar',
};

function getFileExtension(mimeType: string): string {
    // Normalize the MIME type by removing any parameters
    const baseMimeType = mimeType.split(';')[0].trim();
    
    // Lookup the base MIME type in the mapping
    const extension = mimeTypeToExtension[baseMimeType];
    
    // Return the file extension or a default value if MIME type is not found
    return extension || 'unknown';
}


export const get_file_json_obj = async (F:any, eid:string, prop_name:string, idx:number, IS_IMAGE:boolean, mid:string) => {

    const app_id = GC.APP_ID;

    const user_api_token = get_user_token_api();
    if (!user_api_token.success) return {success:false, errors:[{code:"INTERNAL", message:"Unable to get api"}]};


    const {api, token} = user_api_token.data;

    if(typeof(F) === "string"){
        return {success:true, data:{name: F, url: F, size: 1, type: "image/jpeg"}};
    }
    else if(!(F instanceof File)){
        if(F && F.url && F.name && F.size && F.type) return {success:true, data: F}; // already formated json obj
        return {success:false, errors:[{code:"INTERNAL", message:"Invalid file object"}]};
    }
    const ulid = get_ulid();

    let r:any = {};
    if (IS_IMAGE) {
        const file = { image: F, name: F.name || 'file', uid: ulid};
        r = await api.image
            .put_one({access: 'PUBLIC', app_id, model_id:mid, entity_id: eid, prop_id: prop_name, data: file, token: token})
            .catch((e) => {
                feedback(`Error in file upload: ${e.message} `, "error");
            });
    }
    else{
        const file = { file: F, name: F.name || 'file', uid: idx.toString() + "." + getFileExtension(F.type) };
        r = await api.file
        .put_one({access: 'PUBLIC', app_id, model_id:mid, entity_id: eid, prop_id: prop_name, data: file, token: token})
        .catch((e) => {
            feedback(`Error in file upload: ${e.message} `, "error");
        });
    }


    const upload_url = await get_url(r);
    if(!upload_url) return {success:false, errors:[{code:"INTERNAL", message:"Unable to get upload url"}]};
    return {success:true, data:{name: F.name, url:upload_url, size: F.size, type: F.type}};
}



export const upload_file = async (value:any, mid:string, did:string, prop_name:string, idx:number) => {
    
    const D = AS.GSTORE.get_draft(mid, did);
    if(!D || !D.id) return {success: false, errors: [{code: "INTERNAL", message: "Draft not found"}]};
    const model = get_model(mid);
    if(!model) {
        console.warn('no model found for mid: ', mid);
        return {success:false, errors:[{code:"INTERNAL", message:"No model found for mid"}]};
    }
    const prop = model?.props?.filter(p => p.name === prop_name)[0];
    if(!prop) {
        console.warn('no prop found in the models: ', prop_name, model);
        return {success:false, errors:[{code:"INTERNAL", message:"No prop found in the models"}]};
    }

    const prop_type = prop.type;
    let IS_IMAGE = false;
    if(prop_type === 'image') {
        IS_IMAGE = true;
    }
    const eid = D.id.toString();

    const r = await get_file_json_obj(value,eid,prop_name,idx,IS_IMAGE,mid);
    return r;
}

export const get_file_mimetype_from_url_ = (url:string) => {
    // Extract the file extension
    if(!url) return 'unknown';

    const extension = url.split('.')?.pop()?.toLowerCase();
    if(!extension) return 'unknown';
    
    for (const [mimeType, ext] of Object.entries(mimeTypeToExtension)) {
        if (ext === extension) {
            return mimeType;
        }
    }
    return 'unknown'; 

}

export const get_file_name_from_url = (url:string) => {
    if(!url) return 'unknown';

    // Extract file name from URL (everything after the last '/')
    const fullFileName = url.substring(url.lastIndexOf('/') + 1);

    // Remove the extension (everything after the last '.')
    const fileNameWithoutExtension = fullFileName.split('.').slice(0, -1).join('.');
    
    return fileNameWithoutExtension || 'unknown';
    
}


export const on_input_file = async function(e:any, M:any, INFO:T_INFO,prop_name:string) {
    // @todo: fix state function

    const errors: {code: string, message: string}[] = [];
    const mid = INFO.mid;
    const cid = INFO.cid;
    const cidx = INFO.cidx;

    if (!e.target) {
        console.warn(`target is empty`, e.target);
        return;
    }
    const did = generate_draft_id(cid, cidx);

    const files = e.target.files;
    const file_url = e.target.value;

    if(!files && file_url){
        //when users paste url get the type  and name of the file from the url
        const type = get_file_mimetype_from_url_(file_url);
        const name  = get_file_name_from_url(file_url);

        const file = {name:name, url: file_url, size: 0, type: type};
        AS.GSTORE.update_draft(mid, did, {[prop_name]: file});
        return;
    }
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
        console.warn(`value is undefined`, value);
        return;
    }

    
    value.url = URL.createObjectURL(value); // name, type, size already exits
  
    AS.GSTORE.update_draft(mid, did, {[prop_name]: value});


    const D = AS.GSTORE.get_draft(mid, did);
    if(!D || !D.id) return {success: false, errors: [{code: "INTERNAL", message: "Draft not found"}]};


    const meta = D.__meta || {props:{}};
    const props_obj = meta.props || {};

    let prop_progress = props_obj[prop_name] || {};

    AS.GSTORE.update_draft(mid, did, {'__meta': {props: {...props_obj,[prop_name]: {...prop_progress,progress:'uploading'}}}});


    //uploading file
    const r = await upload_file(value, mid, did, prop_name,0);

    if(!r || !r.success || !('data' in r) || (!r.data)) {
        console.warn('error in uploading file', r.errors?.map(m => m.message).join(', '));
        AS.GSTORE.update_draft(mid, did, {'__meta': {props: {...props_obj,[prop_name]: {...prop_progress,progress:''}}}});
        return;
    }
    const file_obj = r.data;
    console.log('file upload completed',r, prop_name);
    AS.GSTORE.update_draft(mid, did, {[prop_name]:file_obj});

    // const ND2 = produce(D, (draft) => {
    //     if(!draft.__meta) draft.__meta = {props:{}};
    //     draft.__meta.props = {...draft.__meta.props, [prop_name]: {progress:'done'}};
    // })


    AS.GSTORE.update_draft(mid, did, {'__meta': {props: {...props_obj,[prop_name]: {...prop_progress,progress:'done'}}}});
    // AS.GSTORE.update_draft(mid, did, ND2);

    //file upload completed

}

export const bro_on_input_file = async function (e:any, M:any, INFO: T_INFO, props: any, idx:number) {
    const errors: {code: string, message: string}[] = [];
    const mid = INFO.mid;
    const cid = INFO.cid;
    
    const name = get_attr_from_event(e, ['b-name', 'name']);
    if(!name){
        errors.push({code: "INTERNAL", message: "prop-name not found"});
        AS.GSTORE.set_error(cid, errors);
        return {success: false, errors};
    }
    await  on_input_file(e, M, INFO, name);
}
// export const on_input_file_idx = (e:any, M:any,INFO:T_INFO, prop_name:string, idx:number) => {
//     // @todo: fix state function

//     if (!e.target) {
//         console.warn(`target is empty`, e.target);
//         return;
//     }

//     const files = e.target.files as FileList|null;
//     if (!files) {
//         console.warn(`files is empty`, files);
//         return;
//     }

//     if (Array.from(files).length === 0) {
//         console.warn(`files is empty`, files);
//         return;
//     }

//     Array.from(files).forEach((f) => {
//         (f as File & {url: string}).url = URL.createObjectURL(f); // name, type, size already exits
//     });
//     const values = files;

//     if (values === undefined) {
//         console.warn(`value is undefined`, values);
//         return;
//     }

// //     set_m_state((s) => {
// //         const prop_state = s[prop_name];
// //         if (!prop_state) return s;

// //         if (!Array.isArray(prop_state)) {
// //             console.warn(
// //                 `prop state for : ${prop_name} is not an array`,
// //                 prop_state,
// //                 s
// //             );
// //             return s;
// //         }
// //         let l  = prop_state.length;
// //         const vals_len = values.length;
// //         const prev_key = idx > 0 ? prop_state[idx-1]?.id : null;
// //         const next_key = idx < l-1 ?  prop_state[idx+1].id : null;
// //         const vs:{id: string, v: File}[] = [];
// //         const ids = generateNKeysBetween(prev_key, next_key, vals_len);
// //         Array.from(values).map((f, i) => {
// //             vs.push({id: ids[i], v: f});
// //         })
        
// //         prop_state.splice(idx, 1, ...vs);

// //         // g_fn.add_meta_key_to_state(s, prop_name); // because we might have many items selected

// //         return { ...s, [prop_name]: [...prop_state] };
// //     });
// }
export const on_input_file_idx = async (e:any, M:any,INFO:T_INFO, prop_name:string, idx:number) => {
    // @todo: fix state function

    const errors: {code: string, message: string}[] = [];
    const mid = INFO.mid;
    const cid = INFO.cid;
    if (!e.target) {
        console.warn(`target is empty`, e.target);
        return;
    }
    const did = generate_draft_id(cid);

    const files = e.target.files;
    const file_url = e.target.value;

    if(!files && file_url){
       //when users paste url get the type  and name of the file from the url
       const type = get_file_mimetype_from_url_(file_url);
       const name  = get_file_name_from_url(file_url);

       const file = {name:name, url: file_url, size: 0, type: type};
      
        const D = AS.GSTORE.get_draft(mid, did);
        if(!D || !D.id) return {success: false, errors: [{code: "INTERNAL", message: "Draft not found"}]};
        const prop_state = D[prop_name] || [];
        if (!prop_state) return {success: false, errors: [{code: "INTERNAL", message: "prop state not found"}]};
        if (!Array.isArray(prop_state)) {
            console.warn(
                `prop state for : ${prop_name} is not an array`,
                prop_state,
                D
            );
            return {success: false, errors: [{code: "INTERNAL", message: "prop state is not an array"}]};
        
        }
        prop_state[idx].v = file;
        AS.GSTORE.update_draft(mid, did, {[prop_name]: [...prop_state]});
        return;
    }
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
        console.warn(`value is undefined`, value);
        return;
    }

    
    value.url = URL.createObjectURL(value); // name, type, size already exits
    
  

    const D = AS.GSTORE.get_draft(mid, did);
    if(!D || !D.id) return {success: false, errors: [{code: "INTERNAL", message: "Draft not found"}]};
    const prop_state = D[prop_name] || [];
    if (!prop_state) return {success: false, errors: [{code: "INTERNAL", message: "prop state not found"}]};
    if (!Array.isArray(prop_state)) {
        console.warn(
            `prop state for : ${prop_name} is not an array`,
            prop_state,
            D
        );
        return {success: false, errors: [{code: "INTERNAL", message: "prop state is not an array"}]};
    
    }
    prop_state[idx].v = value;


    AS.GSTORE.update_draft(mid, did, {[prop_name]: [...prop_state]});

    const meta = D.__meta || {props:{}};

    const props_obj = meta?.props || {};

    let prop_progress = props_obj[prop_name];

   if(!prop_progress || !Array.isArray(prop_progress)) {
        console.warn('prop progress is not an array', prop_progress);
        prop_progress = [];
        prop_progress[idx] = {progress: 'uploading'};
   } else {
       prop_progress[idx] = {...prop_progress[idx],progress: 'uploading'};
   }


    AS.GSTORE.update_draft(mid, did, {'__meta': {props: {...props_obj, [prop_name]: [...prop_progress]}}});

    const r = await upload_file(value, mid, did,prop_name,idx);

    if(!r || !r.success || !('data' in r) || (!r.data)) {
        console.warn(' error in uploading file or image');
        
        prop_progress[idx] = {...prop_progress[idx],progress: ''};
       
        AS.GSTORE.update_draft(mid, did, {'__meta': {props: {...props_obj, [prop_name]: [...prop_progress]}}});
        return;
    }
    const file_obj = r.data;
    console.log('file upload completed for file: ', idx);
    prop_state[idx].v = file_obj;
    AS.GSTORE.update_draft(mid, did, {[prop_name]: [...prop_state]});


    prop_progress[idx] = {...prop_progress[idx],progress: 'done'};

    AS.GSTORE.update_draft(mid, did, {'__meta': {props: {...props_obj, [prop_name]: [...prop_progress]}}});

}

export const bro_on_input_file_idx = async function (e:any, M:any, INFO: T_INFO, props: any, idx:number) {
    // const set_M = INFO.SET_M;

    const errors: {code: string, message: string}[] = [];
    const mid = INFO.mid;
    const cid = INFO.cid;

    const name = get_attr_from_event(e, ['b-name', 'name']);
    if(!name){
        errors.push({code: "INTERNAL", message: "prop-name not found"});
        AS.GSTORE.set_error(cid, errors);
        return {success: false, errors};
    }

    const idx_s = get_attr_from_event(e, ['b-idx', 'idx']);
    if (!idx_s) {
        errors.push({code: "INTERNAL", message: "idx not found"});
        AS.GSTORE.set_error(cid, errors);
        return {success: false, errors};
    }; 
    const idx1 = parseInt(idx_s) || 0;
    await on_input_file_idx(e, M,INFO, name, idx1);
}



export const on_input_select_many = (e:any, M:any,INFO:T_INFO, prop_name:string, converter?: (v: any)=>any) => {

    const value = get_valid_target_value(e, converter);
    const errors: {code: string, message: string}[] = [];
    const mid = INFO.mid;
    const cid = INFO.cid;

    if(value === undefined){
        errors.push({code: "INTERNAL", message: "value is undefined"});
        AS.GSTORE.set_error(cid, errors);
        return {success: false, errors};
    }

    const did = generate_draft_id(cid);

    const D = AS.GSTORE.get_draft(mid, did);
    if(!D || !D.id) return {success: false, errors: [{code: "INTERNAL", message: "Draft not found"}]};
    const prop_state = D[prop_name] || [];
    if (!prop_state) return {success: false, errors: [{code: "INTERNAL", message: "prop state not found"}]};
    if (!Array.isArray(prop_state)) {
        console.warn(
            `prop state for : ${prop_name} is not an array`,
            prop_state,
            D
        );
        return {success: false, errors: [{code: "INTERNAL", message: "prop state is not an array"}]};
    }
            
    if(!prop_state.includes(value)) prop_state.push(value);
    else prop_state.splice(prop_state.indexOf(value), 1);


    AS.GSTORE.update_draft(mid, did, {[prop_name]: [...prop_state]});

    // set_m_state((s) => {
    //     const prop_state = s[prop_name] || [];
    //     if (!prop_state) return s;
    //     if (!Array.isArray(prop_state)) {
    //         console.warn(
    //             `prop state for : ${prop_name} is not an array`,
    //             prop_state,
    //             s
    //         );
    //         return s;
    //     }
    //     if(!prop_state.includes(value)) prop_state.push(value);
    //     else prop_state.splice(prop_state.indexOf(value), 1);
    //     return { ...s, [prop_name]: [...prop_state] };
    // });
}

export const bro_on_input_select_many = function (e:any, M:any, INFO:T_INFO, props:any, idx?:number) {
    const errors: {code: string, message: string}[] = [];
    const mid = INFO.mid;
    const cid = INFO.cid;

    const name = get_attr_from_event(e, ['b-name', 'name']);
    if(!name){
        errors.push({code: "INTERNAL", message: "prop-name not found"});
        AS.GSTORE.set_error(cid, errors);
        return {success: false, errors};
    }
    // on_input(e, M, INFO, name);
    on_input_select_many(e, M,INFO, name);
}

export const on_input_select_many_idx = (e:any, M:any, INFO:T_INFO, prop_name:string, idx:number, converter?: (v: any)=>any) => {

    const value = get_valid_target_value(e, converter);
    const errors: {code: string, message: string}[] = [];
    const mid = INFO.mid;
    const cid = INFO.cid;

    if(value === undefined){
        errors.push({code: "INTERNAL", message: "value is undefined"});
        AS.GSTORE.set_error(cid, errors);
        return {success: false, errors};
    }

    const did = generate_draft_id(cid);


    const D = AS.GSTORE.get_draft(mid, did);
    if(!D || !D.id) return {success: false, errors: [{code: "INTERNAL", message: "Draft not found"}]};
    const prop_state = D[prop_name] || [];
    if (!prop_state) return {success: false, errors: [{code: "INTERNAL", message: "prop state not found"}]};
    if (!Array.isArray(prop_state)) {
        console.warn(
            `prop state for : ${prop_name} is not an array`,
            prop_state,
            D
        );
        return {success: false, errors: [{code: "INTERNAL", message: "prop state is not an array"}]};
    }
    let prop_value = prop_state[idx].v;

    //getitng prop value undefined for first time :
    if(!prop_value) prop_value = [value];
    else if(prop_value && !Array.isArray(prop_value)){
        prop_value = [value]
    } else {
        if(!prop_value.includes(value)) prop_value.push(value);
        else prop_value.splice(prop_value.indexOf(value), 1);
    }

    prop_state[idx].v = prop_value;

    AS.GSTORE.update_draft(mid, did, {[prop_name]: [...prop_state]});

    // set_m_state((s) => {
    //     const prop_state = s[prop_name] || [];
    //     if (!prop_state) return s;
    //     if (!Array.isArray(prop_state)) {
    //         console.warn(
    //             `prop state for : ${prop_name} is not an array`,
    //             prop_state,
    //             s
    //         );
    //         return s;
    //     }
    //     if(!prop_state.includes(value)) prop_state.push(value);
    //     else prop_state.splice(prop_state.indexOf(value), 1);
    //     return { ...s, [prop_name]: [...prop_state] };
    // });
}

export const bro_on_input_select_many_idx = function (e:any, M:any, INFO:T_INFO, props:any, idx?:number) {
    const errors: {code: string, message: string}[] = [];
    const mid = INFO.mid;
    const cid = INFO.cid;

    const name = get_attr_from_event(e, ['b-name', 'name']);
    if(!name){
        errors.push({code: "INTERNAL", message: "prop-name not found"});
        AS.GSTORE.set_error(cid, errors);
        return {success: false, errors};
    }
    const idx_s = get_attr_from_event(e, ['b-idx', 'idx']);
    if (!idx_s) {
        errors.push({code: "INTERNAL", message: "idx not found"});
        AS.GSTORE.set_error(cid, errors);
        return {success: false, errors};
    };
    const idx1 = parseInt(idx_s) || 0;
    on_input_select_many_idx(e, M,INFO, name, idx1);
}



export const bro_on_input_filter = function (e, set_m_state) {
    const value = get_valid_target_value(e);
    if (value === undefined) return;
    set_m_state((s) => ({ ...s, _meta: { filter: value } }));
}






