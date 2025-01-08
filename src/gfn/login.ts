import {GC} from "../global_state";
import { feedback } from "./utils";
import GFN from "../GFN";
import AS from './AS';
import { DEFAULT_RES_SINGLE_P } from "../broken-types/default_res";
import { T_INFO } from "@/broken-types/comp";


export const get_otp_login = function () {
    const AJ = GC.APP_JSON as any;
    if (!AJ) {
        console.warn("No APP_JSON found in global state. Can't get otp_login");
        return null;
    }

    const login_methods = AJ.login_methods;
    if (!login_methods || !login_methods.otp) {
        console.warn('login_methods not found in APP_JSON or does not having otp', login_methods);
        return null;
    }
    return login_methods.otp || false;
};




// Returns true if client_id is set - To show state in login page for applications
export const set_token_after_login = function (r, set_M?: any) {
    if (!r) return;
    if (!r.success) {
        feedback("Unable to login, please try again!", "error");
        console.error('error while logging in : ', r.errors.join(' , '));
        return;
    }

    if (!r.data) {
        feedback("Unable to login, please try again!", "error");
        console.error('data not found in response');
        return;
    }

    if (!r.data.token) {
        if(set_M) set_M((s) => ({ ...s, email_sent: true }));
        feedback('Email sent to your inbox. Please check your email and click on the link to login', "log");
        return true;
    }

    if (r.data.token) {
        if(set_M) set_M((s:any) => ({ ...s, email_sent: false, token: r.data.token }));

        AS.USER.setLogin(r.data.token).finally(() => {
            const name = AS.USER.profile?.name || AS.USER.ddbuser?.name;
            const message =  name? "Logged in as " + name : "Logged in successfully";
            feedback(message, "success");
        });
        return true;
    }

    return false;
}

const add_branch_to_app_id = (app_id: string, branch: string) => {
    if(!app_id.includes("--")){
        return app_id + "--" + branch;
    }
    return app_id;
}

const get_client_id_key = (app_id: string, ui_id: string, method: string) => {
    return `${app_id}_${ui_id}_${method}_client_id`;

}

const get_token_key = (app_id: string, ui_id: string) => {
    return `${app_id}_${ui_id}_token`;
}


const set_client_id_in_local_storage = function ( method: string, client_id: string,) {

    const app_id    =   add_branch_to_app_id(GC.APP_ID, GC.BRANCH);
    const ui_id     =   GC.UI_ID;

    const client_id_key  = get_client_id_key(app_id, ui_id, method);
    window.localStorage.setItem(client_id_key, client_id);
}

const get_client_id_from_local_storage = function (method: string) {

    const ui_id     =   GC.UI_ID;   
    const app_id    =   add_branch_to_app_id(GC.APP_ID, GC.BRANCH);

    const client_id_key  = get_client_id_key(app_id, ui_id, method);
    return window.localStorage.getItem(client_id_key);
}

const clear_client_id_in_local_storage = function (method: string) {
    
    const ui_id     =   GC.UI_ID
    const app_id    =   add_branch_to_app_id(GC.APP_ID, GC.BRANCH);

    const client_id_key  = `${app_id}_${ui_id}_${method}_client_id`;
    window.localStorage.removeItem(client_id_key);
}

const clear_token_in_local_storage = function () {
    
    const app_id    =   add_branch_to_app_id(GC.APP_ID, GC.BRANCH);
    const ui_id     =   GC.UI_ID;

    const token_key  = get_token_key(app_id, ui_id);
    window.localStorage.removeItem(token_key);
}


const set_token_in_local_storage = function (token: string) {

    const app_id    =   add_branch_to_app_id(GC.APP_ID, GC.BRANCH);
    const ui_id     =   GC.UI_ID;

    const token_key  = get_token_key(app_id, ui_id);
    window.localStorage.setItem(token_key, token);
}


const get_token_from_local_storage = function () {
    
    const ui_id     =   GC.UI_ID;   
    const app_id    =   add_branch_to_app_id(GC.APP_ID, GC.BRANCH);

    const token_key  = get_token_key(app_id, ui_id);
    return window.localStorage.getItem(token_key);
}

// step 1 is when there is no client id
const login_with_email_step1 = async( email: string ) =>{

    const auth = GFN.get_auth();

    const app_id        =   GC.APP_ID;
    const ui_id         =   GC.UI_ID;
    const branch        =   GC.BRANCH;

    const r = await auth.login_with_email({email,app_id, ui_id, branch });

    if(!r.success){
        r.errors.push('Unable to login, please try again!');
        GFN.feedback('Unable to login, please try again!');
        return r;
    }

    const client_id = r.data.client_id;
    set_client_id_in_local_storage("email", client_id);
    GFN.feedback('Email sent to your inbox. Please check your email and click on the link to login', "log");
    return r;
}


// step 2 is when there is a client id in local storage
const login_with_email_step2 = async( email: string, client_id: string ) =>{

    const auth = GFN.get_auth();

    const app_id        =   GC.APP_ID;
    const ui_id         =   GC.UI_ID;
    const branch        =   GC.BRANCH;

    const r = await auth.login_with_email({email,app_id, ui_id, branch, client_id });
    
    //clear client id in local storage
    clear_client_id_in_local_storage('email');
    if(!r.success){
        GFN.feedback('Unable to login, please try again!');
        return r;
    }

    const token = r.data.token;
    const user  = r.data.user;


    AS.USER.setLogin(token, user).then(() => {
        const name = AS.USER.profile?.name || AS.USER.ddbuser?.name;
        const message =  name? "Logged in as " + name : "Logged in successfully";
        feedback(message, "success");
    });

    return r;
}


export const bro_email_login = async function (e: any, M: any, INFO: T_INFO): DEFAULT_RES_SINGLE_P<any> {



    if (!M.email){
        GFN.feedback('NO EMAIL FOUND', "warn");
        return {success: false, errors: ['NO EMAIL FOUND']};
    }

    const email_is_valid = GFN.check_email_format(M.email);

    if (!email_is_valid) {

        GFN.feedback('Please enter a valid email', "warn");
        return {success: false, errors: ['Please enter a valid email']};
    }

    
    const email         =   M.email;
    const client_id     =   get_client_id_from_local_storage("email");

    if(!client_id){
        return login_with_email_step1(email);
    }
    else{
        return login_with_email_step2(email, client_id);
    }    

}   



const login_with_mobile_step1 = async( mobile: string ) =>{

    const auth = GFN.get_auth();

    const app_id        =   GC.APP_ID;
    const ui_id         =   GC.UI_ID;
    const branch        =   GC.BRANCH;

    const r = await auth.login_with_mobile_otp({mobile,app_id, ui_id, branch });

    if(!r.success){
        GFN.feedback('Unable to login, please try again!');
        return r;
    }

    const client_id = r.data.client_id;
    set_client_id_in_local_storage("mobile", client_id);
    GFN.feedback('Mobile number sent to your inbox. Please check your email and click on the link to login', "log");
    return r;
}


const login_with_mobile_step2 = async( mobile: string, client_id: string , otp: number) =>{

    const auth = GFN.get_auth();

    const app_id        =   GC.APP_ID;
    const ui_id         =   GC.UI_ID;
    const branch        =   GC.BRANCH;

    const r = await auth.login_with_mobile_otp({mobile,app_id, ui_id, branch, client_id, otp });
    
    
    if(!r.success){
        GFN.feedback('Unable to login, please try again!');
        return r;
    }

    if(!r.data.token){
        const attempts_left = r.data.attempts_left;
        if(attempts_left > 0){
            GFN.feedback('Invalid OTP.  ' + attempts_left , "warn");
            return r;
        }
        else{
            GFN.feedback('Try Log In Process Again');
            clear_client_id_in_local_storage('mobile');
            return r;
        }
    }

    //clear client id in local storage
    clear_client_id_in_local_storage('mobile');
    const token = r.data.token;
    const user  = r.data.user;


    // if(set_M) set_M((s:any) => ({ ...s, email_sent: false, token: r.data.token }));

    await AS.USER.setLogin(token, user);
    const name = AS.USER.profile?.name || AS.USER.ddbuser?.name;

    //setting the token in the local store?
    const message =  name? "Logged in as " + name : "Logged in successfully";
    feedback(message, "success");

    return r;
}

export const bro_mobile_otp_login = async function (e, M, INFO, role): DEFAULT_RES_SINGLE_P<any> {
    
    //NOTE: EXPECTED MOBILE NUMBER WITH COUNTRY CODE
    if(!M.mobile){
        GFN.feedback('NO MOBILE NUMBER FOUND', "warn");
        return {success: false, errors: ['NO MOBILE NUMBER FOUND']};
    }

    const client_id     =   get_client_id_from_local_storage("mobile");

    if(!client_id){
        return login_with_mobile_step1(M.mobile);
    }
    else{
        const otp = M.otp;
        return login_with_mobile_step2(M.mobile, client_id, otp);
    }

}



export const bro_google_login = async function () {
    const auth = GFN.get_auth();
    if (!auth) return GFN.feedback('Error in broken std.lib: auth not found', "error");
    const app_id = add_branch_to_app_id(GC.APP_ID, GC.BRANCH);


    const r = await auth.google_login(app_id, GC.UI_ID);
    GFN.set_token_after_login(r);
}

export const bro_microsoft_login = async function () {
    const auth = GFN.get_auth();
    if (!auth) return GFN.feedback('Error in broken std.lib: auth not found', "error");
    const app_id = add_branch_to_app_id(GC.APP_ID, GC.BRANCH);
    const r = await auth.microsoft_login(app_id, GC.UI_ID);
    GFN.set_token_after_login(r);
}

export const bro_github_login = async function () {
    const auth = GFN.get_auth();
    if (!auth) return GFN.feedback('Error in broken std.lib: auth not found', "error");
    const app_id = add_branch_to_app_id(GC.APP_ID, GC.BRANCH);
    const r = await auth.github_login(app_id, GC.UI_ID);
    GFN.set_token_after_login(r);
}

export const bro_linkedin_login = async function () {
    const auth = GFN.get_auth();
    if (!auth) return GFN.feedback('Error in broken std.lib: auth not found', "error");
    const app_id = add_branch_to_app_id(GC.APP_ID, GC.BRANCH);
    const r = await auth.linkedin_login(app_id, GC.UI_ID);
    GFN.set_token_after_login(r);
}

export const bro_twitter_login = async function () {
    const auth = GFN.get_auth();
    if (!auth) return GFN.feedback('Error in broken std.lib: auth not found', "error");

    const r = await auth.twitter_login(GC.APP_ID);
    GFN.set_token_after_login(r);
}

export const bro_logout = async function (e: any, M: any, INFO: T_INFO, props: any, idx?: number) {
    const WAS_LOGGED_IN = AS.USER.IS_LOGGED_IN;
    const name = AS.USER.profile?.name || AS.USER.profile?.email || AS.USER.ddbuser?.name || AS.USER.ddbuser?.email;
    if(WAS_LOGGED_IN) GFN.feedback('Logging out: ' + name, "success");

    // const app_id = GC.APP_ID;

    clear_token_in_local_storage();

    // clear client id in local storage if any
    clear_client_id_in_local_storage("email");
    clear_client_id_in_local_storage("mobile");

    AS.navigate("");
    AS.USER.logout();
}


export const bro_login = async function (e: any, M: any, INFO: T_INFO, props: any, idx?: number) {
    // we have bro_login action in the editor
    // by default we could use one of the login methods

    await bro_email_login(e, M, INFO);
}