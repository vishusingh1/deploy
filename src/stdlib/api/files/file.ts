// import { DEFAULT_RES_ARR_P, DEFAULT_RES_SINGLE_P } from "../../broken-types/default_res";
import { DEFAULT_RES_ARR_P, DEFAULT_RES_SINGLE_P } from "../../../broken-types/default_res";
import { generate_resource_signed_url } from "./utils";


interface file_api_data {
    file: File,
    name: string,
    uid: string
}

type access      =   "PUBLIC" | "PRIVATE"
type resource    =   "IMAGE" | "FILE"

export const UPLOADS_WORKER_URL = 'https://uploads.brokenatom.io';

const put_one_file = async (params: { access: access, app_id: string, model_id: string, entity_id: string, prop_id: string, data: file_api_data, token: string }): DEFAULT_RES_SINGLE_P<{ message: string, url: string }> => {
    
    const {access, app_id, model_id, entity_id, prop_id, data, token} = params;
    
    const signed_url = await generate_resource_signed_url({resource: "FILE", access, method: 'PUT', app_id, model_id, entity_id, token, prop_id, uid: data.uid});
    
    
    if (!signed_url.success) {
        return {
            success: false,
            code: 1059,
            errors: ['Could not generate signed url', ...signed_url.errors]
        }
    }
    const errors: string[] = [];

    const res = await fetch(signed_url.data.signed_url, {
        method: 'PUT',
        body: data.file
    }).catch(e => {
        console.log(e);
        errors.push(JSON.stringify(e));
        return null;
    });

    if (!res) return {
        success: false,
        code: 2001,
        errors
    };

    const text = await res.text();

    if (!text) {
        // No response from S3 or R2 means the file was uploaded successfully. Ref: https://stackoverflow.com/a/50623666
        return {
            success: true,
            data: {
                message: 'File uploaded successfully',
                url: signed_url.data.return_url
            }
        };
    }

    return {
        success: false,
        code: 1066,
        errors: [text]
    };
}

const get_one_file = async (params: { access: access, app_id: string, model_id: string, entity_id: string, prop_id: string, uid: string, token: string }): DEFAULT_RES_SINGLE_P<{ message: string, url: string }> => {
    
    const {access, app_id, model_id, entity_id, prop_id, uid, token} = params;
    
    const signed_url = await generate_resource_signed_url(  {resource: "FILE", access, method: 'GET', app_id, model_id, entity_id, token, prop_id, uid});
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
            message: 'File fetched successfully',
            url: signed_url.data.signed_url
        }
    };
}

const update_one_file = async (params: { access: access, app_id: string, model_id: string, entity_id: string, prop_id: string, data: file_api_data, token: string }): DEFAULT_RES_SINGLE_P<{ message: string, url: string }> => {
    const {access, app_id, model_id, entity_id, prop_id, data, token} = params;
    // As of now, this is same as put_one_file
    const signed_url = await generate_resource_signed_url({ resource: "FILE", access, method: 'PUT', app_id, model_id, entity_id, token, prop_id, uid: data.uid });
    if (!signed_url.success) {
        return {
            success: false,
            code: 1059,
            errors: ['Could not generate signed url', ...signed_url.errors]
        }
    }
    const errors: string[] = [];

    const res = await fetch(signed_url.data.signed_url, {
        method: 'PUT',
        body: data.file
    }).catch(e => {
        console.log(e);
        errors.push(JSON.stringify(e));
        return null;
    });

    if (!res) return {
        success: false,
        code: 2001,
        errors
    };

    const text = await res.text();

    if (!text) {
        // No response from S3 or R2 means the file was uploaded successfully. Ref: https://stackoverflow.com/a/50623666
        return {
            success: true,
            data: {
                message: 'File updated successfully',
                url: signed_url.data.return_url
            }
        };
    }

    return {
        success: false,
        code: 1066,
        errors: [text]
    };
}

const delete_one_file = async (params: { access: access, app_id: string, model_id: string, entity_id: string, prop_id: string, uid: string, token: string }): DEFAULT_RES_SINGLE_P<{ message: string }> => {
    const {access, app_id, model_id, entity_id, prop_id, uid, token} = params;
    
    const signed_url = await generate_resource_signed_url({resource: "FILE", access, method: 'DELETE', app_id, model_id, entity_id, token, prop_id, uid});
    if (!signed_url.success) {
        return {
            success: false,
            code: 1059,
            errors: ['Could not generate signed url', ...signed_url.errors]
        }
    }
    const errors: string[] = [];

    const res = await fetch(signed_url.data.signed_url, {
        method: 'DELETE',
    }).catch(e => {
        console.log(e);
        errors.push(JSON.stringify(e));
        return null;
    });

    if (!res) return {
        success: false,
        code: 2001,
        errors
    };

    const text = await res.text();

    if (!text) {
        // No response from S3 or R2 means the file was uploaded successfully. Ref: https://stackoverflow.com/a/50623666
        return {
            success: true,
            data: {
                message: 'File deleted successfully'
            }
        };
    }

    return {
        success: false,
        code: 1066,
        errors: [text]
    };
}

const put_many_files = async (params: { access: access, app_id: string, model_id: string, entity_id: string, prop_id: string, data: file_api_data[], token: string }): DEFAULT_RES_ARR_P<{ message: string, url: string }> => {
    
    const {access, app_id, model_id, entity_id, prop_id, data, token} = params;
    
    const r = await Promise.all(data.map(d => put_one_file({access, app_id, model_id, entity_id, prop_id, data: d, token})));
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
        data: r.map(r => r.data as { message: string, url: string, variants: string[] })
    }
}

const get_many_files = async (params : { access: access, app_id: string, model_id: string, entity_id: string, prop_id: string, uids: string[], token: string }): DEFAULT_RES_ARR_P<{ message: string, url: string }> => {
    const {access, app_id, model_id, entity_id, prop_id, uids, token} = params;


    const r = await Promise.all(uids.map(uid => get_one_file({access, app_id, model_id, entity_id, prop_id, uid, token})));
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
        data: r.map(r => r.data as { message: string, url: string })
    }
}

const update_many_files = async (params: { access: access, app_id: string, model_id: string, entity_id: string, prop_id: string, data: file_api_data[], token: string }): DEFAULT_RES_ARR_P<{ message: string, url: string }> => {
    const {access, app_id, model_id, entity_id, prop_id, data, token} = params;
    
    const r = await Promise.all(data.map(d => update_one_file({access, app_id, model_id, entity_id, prop_id, data: d, token})));
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
        data: r.map(r => r.data as { message: string, url: string, variants: string[] })
    }
}

const delete_many_files = async (params: { access: access, app_id: string, model_id: string, entity_id: string, prop_id: string, uids: string[], token: string }): DEFAULT_RES_ARR_P<{ message: string }> => {
    const {access, app_id, model_id, entity_id, prop_id, uids, token} = params;
    
    const r = await Promise.all(uids.map(uid => delete_one_file({access, app_id, model_id, entity_id, prop_id, uid, token})));
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
        data: r.map(r => r.data as { message: string })
    }
}

const get_viewable_url_from_canonical_url = async (canonical_url: string, token: string): Promise<string | undefined> => {
    
    // canonical URL is of the form: `${uploads_worker_url}/${resource.toLowerCase()}/${access.toLowerCase()}?app_id=${app_id}&model_id=${model_id}&entity_id=${entity_id}&prop_id=${prop_id}&uid=${uid}`
    const url = new URL(canonical_url);
    const resource = url.pathname.split('/')[1].toUpperCase();
    const access = url.pathname.split('/')[2].toUpperCase();
    const app_id = url.searchParams.get('app_id');
    const model_id = url.searchParams.get('model_id');
    const entity_id = url.searchParams.get('entity_id');
    const prop_id = url.searchParams.get('prop_id');
    const uid = url.searchParams.get('uid');

    // Check if everything is present
    if (!resource || !access || !app_id || !model_id || !entity_id || !prop_id || !uid) return;

    if (resource !== "FILE") return;

    if (access !== "PUBLIC" && access !== "PRIVATE") return;

    const signed_url = await generate_resource_signed_url({resource, access, method: 'GET', app_id, model_id, entity_id, token, prop_id, uid});

    if (!signed_url.success) return;

    return signed_url.data.signed_url;
}


export default {
    put_one: put_one_file,
    get_one: get_one_file,
    update_one: update_one_file,
    delete_one: delete_one_file,
    put_many: put_many_files,
    get_many: get_many_files,
    update_many: update_many_files,
    delete_many: delete_many_files,
    get_viewable_url_from_canonical_url
};