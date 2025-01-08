import { G_TYPE } from "../broken-types/g_type.ts";
// import {login_email_password, login_username_password, login_magic_link} from "./api/login.ts";
// import {signup_email_password, signup_magic_link, signup_username_password} from "./api/signup.ts"



// const common_fns_setup = (G: G_TYPE)=>{
//     G.fns["login_email_password"] = {
//         name: "Login Email Password",
//         description: "Login using email and password",
//         function: login_email_password,
//         arguments: [
//             {name: "email", type: "string"},
//             {name: "password", type: "string"},
//         ],
//         return_type: "DEFAULT_RES_SINGLE_P<any>",
//         icon: "login"
//     }


//     G.fns["login_username_password"] = {
//         name: "Login Username Password",
//         description: "Login using username and password",
//         function: login_username_password,
//         arguments: [
//             {name: "username", type: "string"},
//             {name: "password", type: "string"},
//         ],
//         return_type: "DEFAULT_RES_SINGLE_P<any>",
//         icon: "login"
//     }

//     G.fns["login_magic_link"] = {
//         name: "Login Magic Link",
//         description: "Login using magic link",
//         function: login_magic_link,
//         arguments: [
//             {name: "email", type: "string"},
//         ],
//         return_type: "void",
//         icon: "login"
//     }


//     // signup
//     G.fns["signup_email_password"] = {
//         name: "Signup Email Password",
//         description: "Signup using email and password",
//         function: signup_email_password,
//         arguments: [
//             {name: "email", type: "string"},
//             {name: "password", type: "string"},
//         ],
//         return_type: "void",
//         icon: "signup"
//     }

//     G.fns["signup_magic_link"] = {
//         name: "Signup Magic Link",
//         description: "Signup using magic link",
//         function: signup_magic_link,
//         arguments: [
//             {name: "email", type: "string"},
//         ],
//         return_type: "void",
//         icon: "signup"
//     }

//     G.fns["signup_username_password"] = {
//         name: "Signup Username Password",
//         description: "Signup using username and password",
//         function: signup_username_password,
//         arguments: [
//             {name: "username", type: "string"},
//             {name: "password", type: "string"},
//         ],
//         return_type: "void",
//         icon: "signup"
//     }
// }

const init = async (G: G_TYPE)=>{
    if(!G){
        console.warn("INIT USER: Global object is not passed to init function");
        return;
    }
    console.log("INIT MODULE USER: ");

    
    G.fns = G.fns || {};

    // add functions to to access it from the ui-dev
    // common_fns_setup(G);

    

    
} 

export default {
    init,

//     login_email_password,
//     login_username_password,
//     login_magic_link,

//     signup_email_password,
//     signup_magic_link,
//     signup_username_password,
}


