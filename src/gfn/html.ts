

export const add_script = function (id: string, url: string, callback: () => void) {
    return new Promise((resolve, reject) => {
        // first check if script is already loaded
        if (document.getElementById(id)) {
            callback();
            resolve(false);
            return;
        }
    
        const script = document.createElement("script") as HTMLScriptElement & {readyState: any, onreadystatechange: any}
        script.type = "text/javascript";
    
        if (script.readyState) {  //IE
            script.onreadystatechange = function () {
                if (script.readyState === "loaded" ||
                    script.readyState === "complete") {
                    script.onreadystatechange = null;
                    callback();
                    resolve(true);
                }
            };
        } else {  //Others
            script.onload = () =>{
                callback();
                resolve(true);
            }
        }
    
        script.src = url;
        script.id = id;
        document.getElementsByTagName("head")[0].appendChild(script);
    });
}


export const add_style = function(id, url, callback) {
    return new Promise((resolve, reject) => {

        // first check if script is already loaded
        if (document.getElementById(id)) {
            callback();
            resolve(false);
            return;
        }
    
        const link = document.createElement("link") as HTMLLinkElement & {readyState: any, onreadystatechange: any}
        link.type = "text/css";
        link.rel = "stylesheet";
    
        if (link.readyState) {  //IE
            link.onreadystatechange = function () {
                if (link.readyState === "loaded" ||
                    link.readyState === "complete") {
                    link.onreadystatechange = null;
                    callback();
                    resolve(true);
                }
            };
        } else {  //Others
            link.onload = () =>{
                callback();
                resolve(true);
            }
        }
    
        link.href = url;
        link.id = id;
        document.getElementsByTagName("head")[0].appendChild(link);

    });
}

export const toggle_dark_mode = function (e) {
    const EL = document.getElementsByName("body")[0] as HTMLBodyElement | null;
    if(!EL) return console.warn("@toggle_dark_mode: body not found");
    if(EL.classList.contains("dark")){
        EL.classList.remove("dark");
    }
    else{
        EL.classList.add("dark");
    }
}