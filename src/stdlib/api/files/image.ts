// import { DEFAULT_RES_ARR_P, DEFAULT_RES_SINGLE_P, access } from "../types";
import { DEFAULT_RES_ARR_P, DEFAULT_RES_SINGLE_P } from "../../../broken-types/default_res";
// import { access } from "../../types";
import { generate_resource_signed_url, is_base64_url_image } from "./utils";

type access     =   "PUBLIC" | "PRIVATE"
type resource   =   "IMAGE" | "FILE"

interface image_api_data {
    image   : File | string, // Can be image or base64 string
    name    : string,
    uid     : string
}

const put_one_image = async (params: { access: access, app_id: string, model_id: string, entity_id: string, prop_id: string, data: image_api_data, token: string }): DEFAULT_RES_SINGLE_P<{message: string, url: string, variants: string[]}> => {
    
    const {access, app_id, model_id, entity_id, prop_id, data, token} = params;
    // Check if the data.image is of instance File. If not, check if it is a valid base64 image string or else return error.
    if (!(data.image instanceof File)) {
        const s = await is_base64_url_image(data.image);
        if (!s) return {
            success: false,
            code: 1051,
            errors: ['Invalid base64 image string']
        }
    }
    const signed_url = await generate_resource_signed_url({resource: "IMAGE", access, method: 'POST', app_id, model_id, entity_id, token, prop_id, uid: data.uid});
    if (!signed_url.success) {
        return {
            success: false,
            code: 1059,
            errors: ['Could not generate signed url', ...signed_url.errors]
        }
    }
    const form = new FormData();
    if (!(data.image instanceof File)) { // Here we know that data.image is a valid base64 image string
        form.append('url', data.image);
    }
    else { // Here we know that data.image is of instance File
        form.append('file', data.image);
    }

    const r = await fetch(signed_url.data.signed_url, {
        method: 'POST',
        body: form
    }).catch(e => {
        console.log(e)
        return null;
    })

    if (!r) {
        return {
            success: false,
            code: 1060,
            errors: [`Could not upload into signed url here: ${signed_url}`]
        }
    }

    const res = await r.json();

    if(!res.success) return {
        success: false,
        code: res.code || 2003,
        errors: [res.errors]
    }

    const public_url = res.result.variants.filter((x: string) => x.split("/").pop() === "public")[0];

    if (!public_url) return {
        success: false,
        code: 1061,
        errors: ['Could not find public url']
    }

    return {
        success: true,
        data: {
            message: 'Image uploaded successfully',
            url: public_url,
            variants: res.result.variants as string[]
        }
    }
}

const get_one_image = async (params: { access: access, app_id: string, model_id: string, entity_id: string, prop_id: string, token: string, uid: string }): DEFAULT_RES_SINGLE_P<{message: string, url: string}> => {
    
    const {access, app_id, model_id, entity_id, prop_id, token, uid} = params;
    
    
    const signed_url = await generate_resource_signed_url( {resource: "IMAGE", access, method: 'GET', app_id, model_id, entity_id, token, prop_id, uid});
    if (!signed_url.success) {
        return {
            success: false,
            code: 1059,
            errors: ['Could not generate signed url', ...signed_url.errors]
        }
    }
    // Special character is getting encoded in the put url, so the result should be encoded url
    return {
        success: true,
        data: {
            message: 'Image fetched successfully',
            url: encodeURI(signed_url.data.signed_url)
        }
    }
}
const update_one_image = async (params: { access: access, app_id: string, model_id: string, entity_id: string, token:string, prop_id: string, data: image_api_data }): DEFAULT_RES_SINGLE_P<{message: string, url: string, variants: string[]}> => {
    
    const {access, app_id, model_id, entity_id, token, prop_id, data} = params;
    // Check if the data.image is of instance File. If not, check if it is a valid base64 image string or else return error.
    if (!(data.image instanceof File)) {
        const s = await is_base64_url_image(data.image);
        if (!s) return {
            success: false,
            code: 1051,
            errors: ['Invalid base64 image string']
        }
    }
    const signed_url = await generate_resource_signed_url({resource: "IMAGE", access, method: 'PUT', app_id, model_id, entity_id, token, prop_id, uid: data.uid});
    if (!signed_url.success) {
        return {
            success: false,
            code: 1059,
            errors: ['Could not generate signed url', ...signed_url.errors]
        }
    }
    const form = new FormData();
    if (!(data.image instanceof File)) { // Here we know that data.image is a valid base64 image string
        form.append('url', data.image);
    }
    else { // Here we know that data.image is of instance File
        form.append('file', data.image);
    }

    const r = await fetch(signed_url.data.signed_url, {
        method: 'POST',
        body: form
    }).catch(e => {
        console.log(e)
        return null;
    })

    if (!r) {
        return {
            success: false,
            code: 1060,
            errors: [`Could not upload into signed url here: ${signed_url}`]
        }
    }

    const res = await r.json();

    if(!res.success) return {
        success: false,
        code: res.code || 2003,
        errors: [res.errors]
    }

    const public_url = res.result.variants.filter((x: string) => x.split("/").pop() === "public")[0];

    if (!public_url) return {
        success: false,
        code: 1061,
        errors: ['Could not find public url']
    }

    return {
        success: true,
        data: {
            message: 'Image updated successfully',
            url: public_url,
            variants: res.result.variants as string[]
        }
    }
}

const delete_one_image = async (params: { access: access, app_id: string, model_id: string, entity_id: string, prop_id: string, token,  uid: string }): DEFAULT_RES_SINGLE_P<{message: string}> => {
    
    const {access, app_id, model_id, entity_id, prop_id, token, uid} = params;
    
    const signed_url = await generate_resource_signed_url({resource: "IMAGE", access, method: 'DELETE', app_id, model_id, entity_id, token, prop_id, uid});
    if (!signed_url.success) {
        return {
            success: false,
            code: 1059,
            errors: ['Could not generate signed url', ...signed_url.errors]
        }
    }

    return {
        success: true,
        data: {
            message: 'Image deleted successfully'
        }
    }
}

const put_many_images = async (parmas: { access: access, app_id: string, model_id: string, entity_id: string, prop_id: string,  token: string, data: image_api_data[] }): DEFAULT_RES_ARR_P<{message: string, url: string, variants: string[]}> => {
    
    const {access, app_id, model_id, entity_id, token, prop_id, data} = parmas;
    // Return success if all are success, else return error
    const r = await Promise.all(data.map(d => put_one_image({access, app_id, model_id, entity_id, prop_id, token,  data: d}))); 
    const success = r.every(r => r.success);
    const errors: string[] = [];
    if (!success) {
        r.forEach(r => {
            if (!r.success) {
                errors.push(...r.errors as string[]);
            }
        })
        return {
            success: false,
            code: 1062,
            errors
        }
    }
    return {
        success: true,
        data: r.map(r => r.data as {message: string, url: string, variants: string[]})
    }
}

const get_many_images = async (params: { access: access, app_id: string, token: string, model_id: string, entity_id: string, prop_id: string, uids: string[] }): DEFAULT_RES_ARR_P<{message: string, url: string}> => {
    
    const {access, app_id, token, model_id, entity_id, prop_id, uids} = params;
    const r = await Promise.all(uids.map(uid => get_one_image({access, app_id, model_id, entity_id, prop_id, token, uid})));
    const success = r.every(r => r.success);
    const errors: string[] = [];
    if (!success) {
        r.forEach(r => {
            if (!r.success) {
                errors.push(...r.errors as string[]);
            }
        })
        return {
            success: false,
            code: 1063,
            errors
        }
    }
    return {
        success: true,
        data: r.map(r => r.data as {message: string, url: string})
    }
}

const update_many_images = async (params: { access: access, app_id: string, token: string, model_id: string, entity_id: string, prop_id: string, data: image_api_data[] }): DEFAULT_RES_ARR_P<{message: string, url: string, variants: string[]}> => {
    
    const {access, app_id, token, model_id, entity_id, prop_id, data} = params;
    const r = await Promise.all(data.map(d => update_one_image({access, app_id, model_id, entity_id, prop_id, token, data: d})));
    const success = r.every(r => r.success);
    const errors: string[] = [];
    if (!success) {
        r.forEach(r => {
            if (!r.success) {
                errors.push(...r.errors as string[]);
            }
        })
        return {
            success: false,
            code: 1064,
            errors
        }
    }
    return {
        success: true,
        data: r.map(r => r.data as {message: string, url: string, variants: string[]})
    }
}

const delete_many_images = async (params: { access: access, app_id: string, token: string, model_id: string, entity_id: string, prop_id: string, uids: string[] }): DEFAULT_RES_ARR_P<{message: string}> => {
    
    const {access, app_id, token, model_id, entity_id, prop_id, uids} = params;
    const r = await Promise.all(uids.map(uid => delete_one_image({access, app_id, model_id, entity_id, prop_id, token, uid})));
    const success = r.every(r => r.success);
    const errors: string[] = [];
    if (!success) {
        r.forEach(r => {
            if (!r.success) {
                errors.push(...r.errors as string[]);
            }
        })
        return {
            success: false,
            code: 1065,
            errors
        }
    }
    return {
        success: true,
        data: r.map(r => r.data as {message: string})
    }
}


export default {
    put_one: put_one_image,
    get_one: get_one_image,
    update_one: update_one_image,
    delete_one: delete_one_image,
    put_many: put_many_images,
    get_many: get_many_images,
    update_many: update_many_images,
    delete_many: delete_many_images,

};