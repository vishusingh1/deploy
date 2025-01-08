import { computed, makeObservable, observable, autorun, action } from "mobx";
import { GC } from "../global_state";
import { json5_parse } from "../gfn/utils";
import GFN from "../GFN";
import { getUserFromJwt } from "./jwt";
import { GEN_DEPLOY_APP_ID } from "@/utils/app";
import PUBLIC_TOKEN from "@/model/token";
import AS from "@/gfn/AS"; // this might cause recursive import


// const get_app_id_with_branch = () => {
//     const app_id = GC.APP_ID;
//     const branch = GC.BRANCH;
//     if(app_id && branch && !app_id.includes("--")){
//         return app_id + "--" + branch;
//     }
//     return app_id;
// }

const get_token_key = () => {
    const app_id = GEN_DEPLOY_APP_ID();
    const ui_id = GC.UI_ID;
    return `${app_id}_${ui_id}_token`;
}

const get_token_from_local_storage = () => {
    const tkey = get_token_key(); // there is no longer offline
    const token = localStorage.getItem(tkey);
    return token;
}


const save_user_to_local_storage = (token: string) => {
    const tkey = get_token_key();
    localStorage.setItem(tkey, token);
}


const remove_user_from_local_storage = () => {
    const tkey = GC.APP_ID + '_token_online';
    localStorage.removeItem(tkey);

    const ukey = GC.APP_ID + '_user_online';
    localStorage.removeItem(ukey);

    return true;
}


const get_token_from_url = () => {
    const url = new URL(window.location.href);
    const token = url.searchParams.get('token');
    if(!token) return null;

    // remove the token from the url
    url.searchParams.delete('token');
    window.history.replaceState({}, '', url.toString());

    const user = getUserFromJwt(token);
    if(!user) return null;

    // check if the token app is same as current app. This is because we are using EDITOR token to launch the app preview
    // e.g. app0_ui0.brokenatom.ai?token=
    // we shoudl be actually doing app0_ui0.brokenatom.ai?creator_token=

    const DEP_APPID = GEN_DEPLOY_APP_ID();
    if(user.app_id !== DEP_APPID){
        console.warn("TOKEN APP ID IS NOT SAME AS CURRENT APP ID", user.app_id, GC.APP_ID, token);
        return null;
    }

    return {token, user};
}

export class BROKEN_USER {
    token: string = "";
    role: string = "";


    ddbuser?: any; // user from broken dynamodb
    profile?: any; // profile data from the user models for this app

   
    IS_LOGGED_IN = false;
    LOADING = true; // we need to show loading screen until we get the user profile


    constructor(token: string) {
        this.token = token;

        makeObservable(this, {
            role:       observable,
            profile:    observable,

            IS_LOGGED_IN    : observable,
            LOADING         : observable,

            // actions
            set_user_profile:   action,
            login:              action,
            logout:             action,
            setLogin:           action,
        });

        this.init();
    }


    async init(){
        // // for public sites set the public token
        // if(!GC.SHOW_LOGIN){ // @todo: do it for login_type = none
        //     const branch = GC.BRANCH || "dev";
        //     const token = PUBLIC_TOKEN[branch];
        //     this.setLogin(token);
        // }
        // @act: Even if we are logging in as admin - this one removes the admin token put's the public token
        // which is uninteded


        const success = this.load_url();
        if(!success) await this.load_local(); // once in the beginning, this will set enable login

        
        // couldn't get login token - use public token
        if(!this.token){
            if(!GC.SHOW_LOGIN){ // don't show login page in the beginning - set public token
                const branch = GC.BRANCH || "dev";
                const token = PUBLIC_TOKEN[branch];
                this.setLogin(token);
            }
        }

        this.LOADING = false; // we got user profile

    } 

    // actions
    

    set_user_profile(data: any) {
        this.profile = data;
    }


    async load_local() {
        if(this.IS_LOGGED_IN &&  this.token){
            return true;
        }

        const token = get_token_from_local_storage();
        if(!token) return false;

        await this.setLogin(token);
        return true;
    }
    save_local() {
        if(!this.token) return;
        save_user_to_local_storage(this.token);
    }

    load_url(){
        const u = get_token_from_url();
        if(!u) return;
        this.setLogin(u.token, u.user);
        this.save_local();
        return true;
    }

    toJSON() {
        return JSON.parse(JSON.stringify(this));
    }

    // @deprecated: Once the 2nd version is all good, we can remove this
    // In the 2nd version, we will consider IS_LOGGED_IN as false when role=public and not download the profile from the server
    // // @todo: check user
    // async setLogin(token: string, _profile?: any) {
    //     if(!token) return;
    //     const ddbuser = getUserFromJwt(token);
    //     if(!ddbuser){
    //         this.logout();
    //         return;
    //     };
    //     this.token = token;
    //     this.ddbuser = ddbuser;
    //     if(ddbuser.role) this.role = ddbuser.role;


    //     // profile
    //     if(_profile && _profile.id){
    //         this.profile = _profile;
    //     }

    //     this.IS_LOGGED_IN = true;
    //     this.LOADING = false; // we might call setLogin separately


    //     // get the profile from the server again 
    //     const profile = await GFN.get_user_profile({id: ddbuser.id, token});
    //     console.log("LOADING USER PROFILE :", profile);
    //     if(profile && profile.id) this.profile = profile;
    //     // always download from the server - because if it;s the first time we need to create this user


    

    //     // after getting profile, save it in local storage
    //     this.save_local();
    // }
    // 

    // V2: IS_LOGGED_IN is false when role=public & profile is not downloaded from the server
    // @todo: check user
    async setLogin(token: string, _profile?: any) {
        if(!token) return;
        const ddbuser = getUserFromJwt(token);
        if(!ddbuser){
            this.logout();
            return;
        };
        this.token = token;
        this.ddbuser = ddbuser;
        if(ddbuser.role) this.role = ddbuser.role;


        // profile
        if(_profile && _profile.id){
            this.profile = _profile;
        }

        this.IS_LOGGED_IN = this.role === "public" ? false : true; // token will be there but IS_LOGGED_IN would be false
        this.LOADING = false; // we might call setLogin separately


        // get the profile from the server again 
        if(this.IS_LOGGED_IN){
            const profile = await GFN.get_user_profile({id: ddbuser.id, token});
            console.log("LOADING USER PROFILE :", profile);
            if(profile && profile.id) this.profile = profile;
            // always download from the server - because if it;s the first time we need to create this user
        }
        // for role=public no profile needed


    

        // after getting profile, save it + token in local storage
        this.save_local();
    }

    // @todo: 
    login(){
        AS.show_login = true;
        // this might cause recursive import
    }

    logout() {
        this.profile = undefined;
        this.token = "";
        this.IS_LOGGED_IN = false;

        // remove from local storage
        remove_user_from_local_storage();
    }


}

