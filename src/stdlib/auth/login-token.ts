import { DEFAULT_RES_SINGLE_P } from "../../broken-types/default_res";
import { fetch_get, fetch_post } from "../Fetch";

const LOGIN_BASE_URL    =   "https://user-api-v2.brokenatom.workers.dev/api/v1/app/login";

const REFRESH_TOKEN_URL =  "https://user-api-v2.brokenatom.workers.dev/api/v1/token/refresh";

const PUBLIC_TOKEN_URL  =  "https://user-api-v2.brokenatom.workers.dev/api/v1/app/public_token";

const TOKEN_GENERATE_URL = "https://user-api-v2.brokenatom.workers.dev/api/v1/token/generate";

const OAUTH_REDIRECT_URL            =   "https://user-api-v2.brokenatom.workers.dev/api/v1/callback/";

const google_client_id              =   '1027174537777-un09m7gfcah2l4coiq8ef8eru0jir9c0.apps.googleusercontent.com';
const microsoft_client_id           =   '3875c7bd-2b84-4868-a115-fc001403e351';
const linkedin_client_id            =   '868uso32rirzl3';
const github_client_id              =   '70ab8ce114c160b23b96';



const add_branch_to_app_id = (app_id: string, branch: string) => {
    if(!app_id.includes("--")){
        return app_id + "--" + branch;
    }
    return app_id;
}


const login_with_email  = async( params : {email: string, ui_id: string, app_id: string, branch: string,  client_id?:string} ) =>   {

    const email_login_url = LOGIN_BASE_URL+"?method=email";

    const app_id = add_branch_to_app_id(params.app_id, params.branch);

    const req_body  = {
        email   :   params.email,
        ui_id   :   params.ui_id,
        app_id  :   app_id,
        client_id : params.client_id,
        step    : params.client_id?2:1
    }

    return await fetch_post(email_login_url, req_body);


} 


const login_with_mobile_otp = async(params: {mobile: string, ui_id: string, app_id: string, branch: string, client_id?:string, otp?:number}) => {

    const mobile_login_url = LOGIN_BASE_URL+"?method=mobile";

    const app_id = add_branch_to_app_id(params.app_id, params.branch);


    const req_body  = {
        mobile      :   params.mobile,
        ui_id       :   params.ui_id,
        app_id      :   app_id,
        client_id   :   params.client_id,
        otp         :   params.otp,
        step        :   params.client_id?2:1
    }

    return await fetch_post(mobile_login_url, req_body);
}


const refresh_token = async(params: {token: string, app_id: string, branch: string}) =>{
   
    const app_id = add_branch_to_app_id(params.app_id, params.branch);

    const refresh_token_url = REFRESH_TOKEN_URL+"?token="+params.token+"&app_id="+app_id;
    return await fetch_get(refresh_token_url);
}


const get_public_token  = async(params: {token: string, app_id: string, branch: string, role?: string, valid_days?: number}) => {
    
    const app_id = add_branch_to_app_id(params.app_id, params.branch);

    let public_token_url = PUBLIC_TOKEN_URL+"?token="+params.token+"&app_id="+params.app_id;
    if(params.role) public_token_url += "&role="+params.role;
    if(params.valid_days) public_token_url += "&valid_days="+params.valid_days;

    return await fetch_get(public_token_url);
} 

const get_token_of_user  = async(params: {app_id: string, user_key: {method: "email"|"mobile"|"id", value: string}, branch:string, token: string}): DEFAULT_RES_SINGLE_P<any> => {
    
    const app_id = add_branch_to_app_id(params.app_id, params.branch);

    let generate_token_url = TOKEN_GENERATE_URL+"?app_id="+app_id+"?token="+params.token;

    const req_body = {
        user_keys : [params.user_key],
    }
    const r = await fetch_post(generate_token_url, req_body);
    if(!r.success) return r;
    const data = r.data;
    if(Array.isArray(data) && data.length>0){
        return {success: true, data: data[0]};
    }
    return r
}

const get_tokens_of_multiple_users = async(params: {app_id: string, user_keys: {method: "email"|"mobile"|"id", value: string}[], token: string}) =>{
    let generate_token_url = TOKEN_GENERATE_URL+"?app_id="+params.app_id+"?token="+params.token;

    const req_body = {
        user_keys : params.user_keys,
    }
    const r = await fetch_post(generate_token_url, req_body);
    if(!r.success) return r;
    const data = r.data;
    if(Array.isArray(data) && data.length>0){
        return {success: true, data: data[0]};
    }
    return r
}

const login_with_google = async(params: {access_token: string, app_id: string, ui_id: string}) =>{
    const google_login_url = LOGIN_BASE_URL+"?method=google";
    
    const req_body = {
        access_token :  params.access_token,
        app_id       :  params.app_id,
        ui_id        :  params.ui_id
    }

    return await fetch_post(google_login_url, req_body);
}

const login_with_microsoft = async(params: {access_token: string, app_id: string, ui_id: string}) =>{
    const microsoft_login_url = LOGIN_BASE_URL+"?method=microsoft";
    
    const req_body = {
        access_token :  params.access_token,
        app_id       :  params.app_id,
        ui_id        :  params.ui_id
    }

    return await fetch_post(microsoft_login_url, req_body);
}

const login_with_linkedin = async(params: {code: string, redirect_uri: string, app_id: string, ui_id: string}) =>{
    const linkedin_login_url = LOGIN_BASE_URL+"?method=linkedin";
    
    const req_body = {
        app_id       :  params.app_id,
        ui_id        :  params.ui_id,
        code         :  params.code,
        redirect_uri :  params.redirect_uri
    }

    return await fetch_post(linkedin_login_url, req_body);
}


const login_with_github = async(params: {code: string, redirect_uri: string, app_id: string, ui_id: string}) =>{
    const github_login_url = LOGIN_BASE_URL+"?method=github";
    
    const req_body = {
        app_id       :  params.app_id,
        ui_id        :  params.ui_id,
        code         :  params.code,
        redirect_uri :  params.redirect_uri
    }

    return await fetch_post(github_login_url, req_body);
}

const google_login = async (app_id: string, ui_id: string) => {


    var oauth2Endpoint = 'https://accounts.google.com/o/oauth2/v2/auth';
    const google_client_id              =   '1027174537777-un09m7gfcah2l4coiq8ef8eru0jir9c0.apps.googleusercontent.com';

    const google_redirect_url           =   OAUTH_REDIRECT_URL + "google";

    // const oauth_redirect_url            =   "https://user-api-v2.brokenatom.workers.dev/api/v1/app/login";
    // const google_redirect_url           =   oauth_redirect_url + "?method=google";

    // Parameters to pass to OAuth 2.0 endpoint.
    var params: any = {
        'client_id': google_client_id,
        'redirect_uri': google_redirect_url,
        'response_type': 'token',
        'scope': "email profile https://www.googleapis.com/auth/userinfo.email openid https://www.googleapis.com/auth/userinfo.profile",
        'include_granted_scopes': 'true',
        'state': JSON.stringify({
            app_id,
            ui_id,
            url: window.location.href,

    
        }),
    };

    // Create <form> element to submit parameters to OAuth 2.0 endpoint.
    var form = document.createElement('form');
    form.setAttribute('method', 'GET'); // Send as a GET request.
    form.setAttribute('action', oauth2Endpoint);

    // Add form parameters as hidden input values.
    for (var p in params) {
        var input = document.createElement('input');
        input.setAttribute('type', 'hidden');
        input.setAttribute('name', p);
        input.setAttribute('value', params[p]);
        form.appendChild(input);
    }

    // Add form to page and submit it to open the OAuth 2.0 endpoint.
    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
}


const microsoft_login = async (app_id: string, ui_id: string, role?:string) => {
    
    const oauth2Endpoint = 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize';
    const microsoft_redirect_url        =   OAUTH_REDIRECT_URL + "microsoft/app";

    const params: any = {
        'client_id': microsoft_client_id,
        'redirect_uri': microsoft_redirect_url,
        'response_type': 'token',
        'scope': "user.read openid profile email offline_access",
        'state': JSON.stringify({
            app_id,
            ui_id,
            url: window.location.href
            
        }),
    };

    var form = document.createElement('form');
    form.setAttribute('method', 'GET'); // Send as a POST request.
    form.setAttribute('action', oauth2Endpoint);

    for (var p in params) {
        var input = document.createElement('input');
        input.setAttribute('type', 'hidden');
        input.setAttribute('name', p);
        input.setAttribute('value', params[p]);
        form.appendChild(input);
    }

    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
}

const linkedin_login = async (app_id: string, ui_id: string, role?: string) => { // https://learn.microsoft.com/en-us/linkedin/shared/authentication/authorization-code-flow?context=linkedin%2Fcontext&tabs=HTTPS1
    const oauth2Endpoint = 'https://www.linkedin.com/oauth/v2/authorization';

    const linkedin_redirect_url         =   OAUTH_REDIRECT_URL + "linkedin";

    const params: any = {
        'client_id': linkedin_client_id,
        'redirect_uri': linkedin_redirect_url,
        'response_type': 'code', // Code should be used to get token
        'scope': "openid profile email",
        'state': JSON.stringify({
            app_id,
            ui_id,
            url :  window.location.href
        
        }),
    };

    // Create <form> element to submit parameters to OAuth 2.0 endpoint.
    var form = document.createElement('form');
    form.setAttribute('method', 'GET'); // Send as a POST request.
    form.setAttribute('action', oauth2Endpoint);

    // Add form parameters as hidden input values.
    for (var p in params) {
        var input = document.createElement('input');
        input.setAttribute('type', 'hidden');
        input.setAttribute('name', p);
        input.setAttribute('value', params[p]);
        form.appendChild(input);
    }

    // Add form to page and submit it to open the OAuth 2.0 endpoint.
    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
}

const github_login = async (app_id: string, ui_id: string, role?: string) => {
    var oauth2Endpoint = 'https://github.com/login/oauth/authorize';
    const github_redirect_url           =   OAUTH_REDIRECT_URL + "github";

    // Parameters to pass to OAuth 2.0 endpoint.
    var params: any = {
        'client_id': github_client_id,
        'redirect_uri': github_redirect_url,
        'scope': "user",
        'state': JSON.stringify({
            app_id,
            ui_id,
            url: window.location.href
        }),
    };

    // Create <form> element to submit parameters to OAuth 2.0 endpoint.
    var form = document.createElement('form');
    form.setAttribute('method', 'GET'); // Send as a GET request.
    form.setAttribute('action', oauth2Endpoint);

    // Add form parameters as hidden input values.
    for (var p in params) {
        var input = document.createElement('input');
        input.setAttribute('type', 'hidden');
        input.setAttribute('name', p);
        input.setAttribute('value', params[p]);
        form.appendChild(input);
    }

    // Add form to page and submit it to open the OAuth 2.0 endpoint.
    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
}

const twitter_login = async (app_id: string, role?: string) => {
    return console.log("Twitter login not implemented yet");
}


const login_with_twitter = async() =>{
    
}


export default {
    login_with_email,
    login_with_mobile_otp,
    refresh_token,
    get_public_token,
    get_token_of_user,
    get_tokens_of_multiple_users,
    login_with_google,
    login_with_microsoft,
    login_with_linkedin,
    login_with_github,
    login_with_twitter,
    google_login,
    microsoft_login,
    linkedin_login,
    github_login,
    twitter_login
}