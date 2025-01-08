import React, { useState, useEffect } from "react";
import "./app.css";

import {
    BrowserRouter as Router,
    RouterProvider,
    Routes,
    Route,
    Link,
} from "react-router-dom";

import { motion } from 'framer-motion';
import { AnimatePresence } from 'framer-motion';

import { Toaster } from "react-hot-toast";

import ErrorPage from "./utils/error-page";
import {observer} from "mobx-react-lite"

import MAIN_COMP from "./comp/main";

import GFN from "./GFN";
import Login from "./user/login";

import { Subscription } from "rxjs";
import AS from "./gfn/AS";


// we want to make some changes to vite
import.meta?.hot?.on("vite:beforeUpdate", (pl)=>{
    // @ts-ignore
    const intercept = window.intercept_vite_update || ((cb:any)=>{console.warn("intercept_vite_update not defined")});
    if(intercept){
        intercept(pl);
    }
});







import BGLOBAL from "./BROKENGLOBAL";
import DevPreview from "./dev/DevPreview";
import UTILITY_COMPS from "./lib/comp/utility";
import UTILS_PAGE from "./utils/page";
BGLOBAL.init();




// const router = createBrowserRouter([
//     // for app.brokenatom.io
//     {
//         path: "/:app_id/:ui_id/login",
//         element: <Login />,
//     },
//     {
//         path: "/:app_id/:ui_id/*",
//         element: <MAIN_COMP />,
//         errorElement: <ErrorPage />,
//     },

//     // for custom domains
//     {
//         path: "/login",
//         element: <Login />,
//     },
//     {
//         path: "/*",
//         element: <MAIN_COMP />,
//         errorElement: <ErrorPage />,
//     },
// ]);

const ERROR_PAGE = ErrorPage;

function App() {

    useEffect(() => {
        const subs: Subscription[] = [];
        UTILS_PAGE.setup_page_change_on_p(subs);
    }, []);


    // BRO-CODE.APP.TSX START

    // BRO-CODE.APP.TSX END




    // SHOW LOADING SCREEN UNTIL LOGIN INFO IS LOADED
    if(AS.enable_login && AS.USER.LOADING){
        return (
            <AnimatePresence>
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center justify-center h-screen w-screen bg-gray-100">
                    <div className="flex flex-col items-center justify-center w-full h-full">
                        <div className="text-center"><div className="bg-white rounded px-8 pt-6 pb-8 w-full max-w-md space-y-6">
                            <div className="text-3xl font-bold text-center text-white">
                                <span className="bg-gradient-to-r text-transparent from-blue-500 to-purple-500 bg-clip-text">Login to {AS.APP.name}</span>
                            </div>
                            <div className="mb-4 w-full flex flex-col items-center justify-center space-y-4">
                                <div className="w-full">
                                    <div className="flex flex-col gap-2">
                                        {/* <iconify-icon icon="svg-spinners:tadpole"></iconify-icon> */}
                                        <div className="text-sm text-gray-500">Please wait while we load your login info</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>
        )
    }




    // LOGIN IF NOT LOGGED IN and ENABLED
    if (AS.enable_login && AS.show_login && !AS.USER.IS_LOGGED_IN) return (
        <div>
            <Login />
            <Toaster/>
            <DevPreview />
        </div>
    );


    return (
        <div>
            <Router>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/*" element={<MAIN_COMP />} />
                    <Route path="*" element={<ERROR_PAGE />} />
                </Routes>
            </Router>
            <Toaster/>
            <DevPreview />
        </div>
    )
}

export default observer(App);
