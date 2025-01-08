// These fns are used in JSX directly. NO ASYNC HERE

import { json5_parse } from "./utils";

// this can't be async => it will be used inside JSX
export const GET = function (M:any, keys:string[]|string) {
    if (!M || !keys || !keys.length) return undefined;

    
    if(typeof(keys) === "string") {
        const V = M[keys];  // M['address.name']
        if(V) return V;

        // allow images.0.v.url
        keys = keys.split("."); // ["images", "0", "v", "url"] // @rem: it will all be string event 0
    }
    
    
    let V = M;
    for (let i = 0; i < keys.length; i++) {
        const k = keys[i];
        if (!V) return undefined;
        
    
        let _V = V[k];
        

        // may be just a composite key like {address.name: "john"}
        if(!_V && keys.length > 1){
            // {'address.name': 'john'}
            // {abc: {'address.name': 'john'}} => abc.address.name => M[abc][address.name]
            const final = V[keys.slice(i).join(".")];
            if(final) return final;
        }

        if(!_V){
            // V can be json string => `{}`
            if(typeof(V) === "string" && (V.startsWith("{") || V.startsWith("[") || V.startsWith("@json:"))){
                if(V.startsWith("@json:")) V = V.replace("@json:", "");
                V = json5_parse(V);
                
                _V = V[k];
            }
        }
        
        
        V = _V;
    }
    return V;
}

export const GET_ARRAY = function (M:any, keys?: string[]|string) {
    // no keys
    if(!keys || !keys.length){
        if(!M) return [];
        if(!Array.isArray(M)) return [];
        return M;
    }


    if(typeof(keys) === "string") {
        // allow M.products.images
        keys = keys.split(".");
    }
    

    // with keys
    const V = GET(M, keys);
    if (!V) return [];
    if (!Array.isArray(V)) return [];
    return V;
}