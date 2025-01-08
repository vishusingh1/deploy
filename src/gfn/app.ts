import { get_token } from "./user";
import {GC} from "../global_state";
import GFN from "../GFN";



// export const runtime_set_app_effect = function (set_user, subs, listeners) {
//     // assume that all apps requires login

//     const token = get_token();
//     if (!token) {
//         set_user(null);
//     }

//     subs.push(
//         AS.rx_user.subscribe((user) => {
//             if (!user) return;
//             set_user(user);
//         })
//     );
// };

// // const setup_app_json_for_std_lib = () => {
// //     const APP_JSON = GC.APP_JSON as any;
// //     if (APP_JSON) {
// //         const C = get_current();
// //         if(C){
// //             // @todo: TYPES
// //             C.app = APP_JSON;
// //         }

// //         AS.app = {id: APP_JSON.id, name: APP_JSON.name, logo_url: APP_JSON.logo_url};
// //     }

// //     // we might have token before broken module is loaded
// //     const A = get_auth();
// //     if(A && AS.user && AS.token){
// //         A.token = AS.token;
// //         A.user = AS.user;
// //     }
// // }

// export const g_app_init = function (broken: any) {
    


//     // std.lib may take time to load
//     // const timer = setInterval(()=>{
//     //     const B = GFN.get_broken();
//     //     if(!B) return;


//     //     B.init(GC.APP_ID, GC.APP_JSON);



//     //     setup_app_json_for_std_lib();
//     //     S.rx_boken_module.next(B); // broken module loaded




//     //     clearInterval(timer);
//     // }, 100);


//     // setup_app_json_for_std_lib(); // once in the beginning, this will set enable login


//     // we will put a callback for B.current.auth to set token and user
//     // this is useful for oauth login like Google, Facebook, etc
//     // because they are called using url callback ther eis no way for the bro_login() function to set this
//     // bro_login() will not return anything for OAuth
//     // The window will reload and broken module will get the token and user from local storage
//     // broken module will call this calback and we will update the AS
//     window.broken_on_login_success = (token, user) => {
//         if(!token) return;
//         if(!user) return;
//         AS.rx_token.next(token);
//         AS.rx_user.next(user);


//         // from user setup BUSER
//         const U = AS.USER;
//         if(user.id) U.id = user.id;
//         if(user.name) U.name = user.name;
//         if(user.email) U.email = user.email;
//         if(user.username) U.username = user.username;
//         if(user.mobile) U.mobile = user.mobile;
//         if(user.role) U.role = user.role;
//         if(user.profile) U.profile = user.profile;
//         U.LOGGED_IN = true;
//     }



//     return g_app_state_init();
// };
// export const init_online = function () {
//     GFN.get_broken()
//     const broken = get_broken();
//     if (!broken) return 'broken not found';
//     if (!broken.online) return 'online module not found';

//     console.log('INIT: online module');
//     broken.current = broken.online;

//     return g_app_init(broken);
// }
// export const init_offline = function () {
//     const broken = get_broken();
//     if (!broken) return 'broken not found';
//     if (!broken.offline) return 'offline module not found';

//     console.log('INIT: offline module');
//     broken.current = broken.offline;

//     return g_app_init(broken);
// }