import { ulid } from "ulid";
import "./toast-classes.css";
import { customAlphabet } from 'nanoid/non-secure';




const generate_ulid = (): string => {
    return ulid().toLowerCase();
}

const generate_nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyz1234567890', 5);
const generate_nanoid_al = customAlphabet('abcdefghijklmnopqrstuvwxyz', 5);

const create_toast = (text: string, type?: "log" | "error" | "warn" | "success", timer?: number) => { // Timer is in seconds
    const toast = document.createElement('div');
    toast.className = type ? type : "log";
    toast.id = 'toast';
    toast.innerText = text;
    document.querySelector('body')?.appendChild(toast);
    // If timer is given, then use that timer, otherwise use 2 seconds
    const timeout = timer ? timer * 1000 : 2000;
    setTimeout(() => {
        toast.className = toast.className.replace("show", "");
        document.querySelector('body')?.removeChild(toast);
    }, timeout);
}


// export const generate_search_params_object = (params: URLSearchParams): OBJECT_TYPE<string> => {
//     const obj: OBJECT_TYPE<string> = {};
//     for (const [key, value] of params) {
//         obj[key] = value;
//     }
//     return obj;
// }

const utils = {
    ulid: () => generate_ulid(),
    nanoid: (size?: number) => generate_nanoid(size),
    nanoid_al: (size?: number) => generate_nanoid_al(size),
    feedback: (text: string, type?: "log" | "error" | "warn" | "success", timer?: number) => create_toast(text, type, timer),
}

export default utils;