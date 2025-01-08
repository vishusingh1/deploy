// import { DEFAULT_RES_SINGLE_P } from "../../broken-types/default_res";

import { DEFAULT_RES_SINGLE_P } from "../../../broken-types/default_res";

type access      =   "PUBLIC" | "PRIVATE"
type resource    =   "IMAGE" | "FILE"


export const UPLOADS_WORKER_URL = 'https://uploads.brokenatom.io';


// This function is used to generate url for resource[File/Image].  Hierarchy => Type[What is the type of resource] -> Access[Is the resource public or private?] -> App ID -> Model ID -> Entity ID -> Prop ID -> File Name


export const generate_resource_base_url = (params: { resource: resource, access: access, app_id: string, model_id: string, entity_id: string, prop_id: string, uid: string, token: string }): string => {
    
    const query_params = {
        app_id      :   params.app_id,
        model_id    :   params.model_id,
        token       :   params.token,
        entity_id   :   params.entity_id,
        prop_id     :   params.prop_id,
        uid         :   params.uid
    }

    // join all the query string params
    let query_string_params:string[] = [];
    for(const key in query_params) {
        if(query_params[key] !== undefined) {
            query_string_params.push(`${key}=${query_params[key]}`);
        }
    }


    return `${UPLOADS_WORKER_URL}/${params.resource.toLowerCase()}/${params.access.toLowerCase()}?${query_string_params.join('&')}`;
    // return `${UPLOADS_WORKER_URL}/${resource.toLowerCase()}/${access.toLowerCase()}?app_id=${app_id}&model_id=${model_id}&entity_id=${entity_id}&prop_id=${prop_id}&uid=${uid}`;
}




export const generate_resource_signed_url = async (prams: { resource: resource, access: access, method: 'POST' | 'GET' | 'PUT' | 'DELETE', app_id: string, model_id: string, entity_id: string, prop_id: string, uid: string, token: string }): DEFAULT_RES_SINGLE_P<{ return_url: string, signed_url: string }> => {
    
    const {resource, access, method, app_id, model_id, entity_id, prop_id, uid, token} = prams;


    const errors: string[] = [];
    // We require signed url for image only in create which gives a return of multiple variants of urls. For get, we can directly access public link
    const url = generate_resource_base_url({resource, access, app_id, model_id, entity_id, prop_id, uid, token});
    const res = await fetch(url, {
        method: method
    }).catch(e => {
        errors.push(e);
        return null;
    });

    if (!res) return {
        success: false,
        code: 2001,
        errors
    };

    const r = await res.json();

    if (!r || !r.success) return {
        success: false,
        code: r.code || 2003,
        errors: r.errors
    };

    if (!r.data || !r.data[0] || !r.data[0].url) return {
        success: false,
        code: 1058,
        errors: ['No signed url found in the response in generate_resource_signed_url']
    }

    return {
        success: true,
        data: {
            return_url: url,
            signed_url: r.data[0].url as string
        }
    }
}



export const is_base64_url_image = async (base64String: string): Promise<boolean> => {
    let image = new Image();
    image.src = base64String;
    return await (new Promise((resolve) => {
        image.onload = function () {
            if (image.height === 0 || image.width === 0) {
                resolve(false);
                return;
            }
            resolve(true)
        }
        image.onerror = () => {
            resolve(false)
        }
    }))
}


export default {};