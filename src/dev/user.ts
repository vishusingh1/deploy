import GFN from "../GFN";
import AS from "../gfn/AS";
import { BROKEN_USER } from "../user/user";

// This is mostly for development purposes

export const AVAILABLE_USERS: BROKEN_USER[] = [];
const add = (user: any) => {
    // check duplicate
    for(let u of AVAILABLE_USERS){
        if(u.token === user.token){
            console.error("User already exists: ", user.id);
            return;
        }
    }

    const USER = new BROKEN_USER(user.token);
    if(user.profile) USER.profile = user.profile;
    if(user.role) USER.role = user.role;
    if(user.token) USER.token = user.token;
    if(user.LOGGED_IN) USER.IS_LOGGED_IN = user.LOGGED_IN;
    AVAILABLE_USERS.push(USER);

    // set the first one as user and logged in
    if(!AS.USER.IS_LOGGED_IN){
        if(AVAILABLE_USERS.length){
            const U0 = AVAILABLE_USERS[0];
            U0.IS_LOGGED_IN = true;
            AS.USER = U0;

            // don't save in DEV MODE
            // AS.USER.save_local(); // this cause problem if you want to see diff UI with diff user type. Because this will re-write the local storage
        }
    }

    // setTimeout because: Uncaught ReferenceError: Cannot access 'AS' before initialization
}

const DEV_MODE_USER = {
    add
}
export default DEV_MODE_USER;