import JSON5 from 'json5';
import API from '../lib/api';
// DON'T USE AS - we are getting circular dependency
// Separate UI - UTILS from this
// This is for general utility functions



export const _logger = (text: string) => {
    console.log(
        'Feedback in broken module not found. So logging in console => ',
        text
    );
};

// level: log, warn, error, success; duration is in seconds
// export const feedback = function (msg: string, level?: any, duration?: number) {
//     const _feedback = get_feedback();
//     if (!_feedback) return _logger(msg);
//     _feedback(msg, ["log", "warn", "error", "success"].includes(level) ? level : 'log', duration || 2);
// };

export const feedback = function (msg: string, level?: any, duration?: number) {
    const _feedback = API.utils.feedback;
    _feedback(msg, ["log", "warn", "error", "success"].includes(level) ? level : 'log', duration || 2);
};

export const get_feedback = function () {
    return API.utils.feedback;
};



export const get_api = function () {
   return API.api;
};

export const get_auth = function () {
    return API.auth;
}


export const get_utils = function () {
    return API.utils
};

export const get_ulid = function () {
    const utils = get_utils();
    return utils.ulid();
};


export const hashJoaat = function (b: string) {
	for (var a = 0, c = b.length; c--;)a += b.charCodeAt(c), a += a << 10, a ^= a >> 6; a += a << 3; a ^= a >> 11; return ((a + (a << 15) & 4294967295) >>> 0).toString(16);
};

export const json_parse = function (str: string) {
    // if json5 use that
    // for now temp solution

    try {
        return JSON.parse(str);
    } catch (error) {
        try {
            console.warn("@risky: eval is use for data, add json5 to std.lib and use it");
            const obj = (0, eval)('(' + str + ')');
            return obj;
        } catch (error) {
            console.warn("eval also failed on josn_parse");
            return null;
        }
        console.warn("json_parse: ", error, str);
        return null;
    }
}

export const json5_parse = function (str: string) {
    if(typeof(str) === "object") return str;

    try {
        return JSON5.parse(str);
    } catch (error) {
        console.warn("json5_parse: ", error, str);
    }
}

export const json5_stringify = function (obj: any) {
    return JSON5.stringify(obj);
}

export const get_random_string = function () {
    return Math.random().toString(36).substring(2, 15);
}


export const sort_objs = function (objs: any[], key: string, order: -1 | 1) {
    if (!objs || !Array.isArray(objs)) return;
    objs.sort((a, b) => {
        if (a[key] > b[key]) return 1 * order;
        else if (a[key] < b[key]) return -1 * order;
        else return 0;
    });
}


// this has to create user in app db and also dynamoDB
export const create_user = async() =>{

}

// this has to delete user in app db and also dynamoDB
export const delete_user = async() => {

}


