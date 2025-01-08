import React, { useEffect, useRef, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import {observer} from "mobx-react-lite"

import FallbackRender from "../../utils/ErrorBoundaryFallback";
import { Subscription } from "rxjs";


import UTILITY_COMPS from "@/lib/comp/utility";
const Modal = UTILITY_COMPS.Modal;

import { motion } from 'framer-motion';

import GFN from '../../GFN';
import AS from "../../gfn/AS";
import UTILS from "@/utils/index";

import {OBJ_WITH_ID, T_INFO, T_QUERY_PARAMS} from "../types";


// INJECT IMPORTS HERE
// b@imports


const MobileOtp = (props: any) => {

    let idx = props.idx; // for node it's required
    const app_id = AS.APP.id;
    const app_name = AS.APP.name;
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [attempts, setAttempts] = useState(5);
    const [hash, setHash] = useState('');
    const [resendDisabled, setResendDisabled] = useState(false);
    const [currentStep, setCurrentStep] = useState('phone'); // 'phone' or 'otp'
    const otp_login = GFN.get_otp_login();

    const handleSendOtp = async () => {
        // const errors = [];
        // // Validate phone number (assuming 10 digits for simplicity)
        // if (phoneNumber.length !== 10) {
        //     GFN.feedback('Invalid phone number. Please enter a 10-digit phone number.', "warn");
        //     return;
        // }

        // setCurrentStep('otp');

        // const res = await GFN.bro_otp_create(phoneNumber, app_name, app_id);
        // if(!res) return console.error("OTP not sent");

        // if (!res.success) {
        //     GFN.feedback(`Error: ${res.errors}`, "error");
        //     return;
        // }

        // // FOR OFFLINE MODULE, ON FIRST HIT, THE TOKEN IS SENT
        // if (res.data.token) {
        //     return GFN.set_token_after_login(res);
        // }

        // setHash(res.data.hash);

        // GFN.feedback("OTP Sent!", "log");
        // setResendDisabled(true);

        // // Simulate a delay before allowing resend
        // setTimeout(() => {
        //     setResendDisabled(false);
        // }, 5000); // 5000 milliseconds (5 seconds) delay before allowing resend
    };

    const handleVerifyOtp = async () => {
        // const errors = [];

        // // Send to API
        // const res = await GFN.bro_otp_verify(phoneNumber, otp, hash, app_id, props.role);
        // if (!res) return console.error("OTP not verified");

        // if (!res.success) {
        //     GFN.feedback(`Errors: ${res.errors}`, "warn");
        //     const curr_attempts = attempts - 1;
        //     setAttempts(curr_attempts);
        //     if (curr_attempts === 0) {
        //         GFN.feedback('Maximum attempts reached. Please try again later.', "error");
        //         // Reset values after maximum attempts reached
        //         setOtp('');
        //         setAttempts(5);
        //         setCurrentStep('phone'); // Move back to asking for phone number
        //     } else {
        //         GFN.feedback(`Incorrect OTP. ${curr_attempts} attempts left.`, "error");
        //     }

        //     // Change hash
        //     setHash(res.data.hash);
        //     return;
        // }

        // // Login to system
        // setOtp('');
        // setAttempts(5);
        // setCurrentStep('phone'); // Move back to asking for phone number
    };

    useEffect(() => {
        // Disable the "Resend OTP" button if attempts are exhausted
        if (attempts === 0) {
            setResendDisabled(true);
        }
    }, [attempts]);

    return (
        <div className={`w-full mx-auto ${otp_login ? "" : "hidden"}`}>
            {/* <h2 className="text-2xl font-bold mb-4 text-center">Mobile OTP Verification</h2> */}

            {currentStep === 'phone' && (
                <div className="mb-4">
                    <label htmlFor="phoneNumber" className="block text-gray-700 text-sm font-bold mb-2">
                        Enter Phone Number:
                    </label>
                    <input
                        type="text"
                        id="phoneNumber"
                        name="phoneNumber"
                        placeholder="Enter 10-digit phone number"
                        value={phoneNumber}
                        maxLength={10}
                        onChange={(e) => {
                            // Only allow numbers
                            const re = /^[0-9\b]+$/;
                            if (e.target.value === '' || re.test(e.target.value)) setPhoneNumber(e.target.value)
                        }}
                        className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-md"
                    />
                </div>
            )}

            {currentStep === 'otp' && (
                <div className="mb-4">
                    <label htmlFor="otp" className="block text-gray-700 text-sm font-bold mb-2">
                        Enter OTP:
                    </label>
                    <input
                        type="text"
                        id="otp"
                        name="otp"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-md"
                    />
                </div>
            )}

            {currentStep === 'otp' && (
                <div className="mb-4">
                    <p className={`text-red-500 ${attempts === 0 ? 'font-bold' : ''}`}>
                        {attempts === 0 ? 'Maximum attempts reached. Please try again later.' : ''}
                        {attempts > 0 && `Attempts left: ${attempts}`}
                    </p>
                </div>
            )}

            <div className="flex items-center justify-center mb-4">
                {currentStep === 'phone' && (
                    <div className="flex flex-col items-center justify-center w-80 mx-auto" onClick={handleSendOtp}>
                        <button className="flex items-center bg-white border border-gray-300 rounded-lg shadow-md px-6 py-2 text-sm font-medium text-gray-800 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 w-full justify-center">
                            Send OTP
                        </button>
                    </div>
                )}
                {currentStep === 'otp' && (
                    <div className="flex flex-col items-center justify-center w-80 mx-auto" onClick={handleVerifyOtp}>
                        <button className="flex items-center bg-white border border-gray-300 rounded-lg shadow-md px-6 py-2 text-sm font-medium text-gray-800 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 w-full justify-center">
                            Verify OTP
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};


const BROKEN_JSX = () => <div className="h-screen w-screen flex items-center justify-center text-gray-500 font-semibold bg-gray-100">DEFAULT LOGIN</div>


// local code - e.g sub components
// b@locals


const Login = (props: any) => {

  

    let idx = props.idx; // for node it's required
    let V = props.V || {}; // for protection from error


    // REPLACE INFO HERE - NEXT LINE after b@
	// b@info
	const INFO:T_INFO = { mid: "", model_name: "", prop_name: "", op: "get_many", cid: "login", cidx:idx};


    // DYNAMIC VARIABLES & FUNCTIONS
	const B		: any = {}; // contains actions and common functions
	const VARS	: any = {}; // contains variables
	const FNS	: any = {}; // contains functions



	// STATES
	const [M,  SET_M ] 					= useState(props.M  || {})	// model data
	const [SM, SET_SM] 					= useState(null);			// selected model data
	
	const CS = UTILS.GET_STATE(INFO, "COMP")		// local state 	- only for this comp
	const GS = AS.GSTORE.GLOBAL_STATE				// global state - shared  but only with this client in this frontend
	const SS = AS.GSTORE.SERVER_STATES				// server state - shared with evryone using this app



    
    // USER DEFINED STATES
    // b@states

	


    // REFS
    // USER DEFINED REFS
    // b@refs





	// QUERY
	// b@query


	// RELATION
	// b@relation



    const [user, set_user] = useState({ email: "" });
    const [roles, set_roles] = useState<any[]>([]);

    const [mail_sending, set_mail_sending] = useState(false);
    const [mail_sent, set_mail_sent] = useState(false);


    useEffect(() => {
        const roles = GFN.get_roles();
        if (!roles) return;
        set_roles(roles);
    }, []);

    // if already logged in, and path is /login redirect to home
    const check_if_logged_in = () => {
        const path = window.location.pathname;
        if (path === "/login") {
            if (AS.USER.IS_LOGGED_IN) {
                AS.navigate("/");
            }
        }
        else if (path.endsWith("/login")) { //  /appid/uiid/login
            if (AS.USER.IS_LOGGED_IN) {
                AS.navigate(""); //
            }
        }
    }
    // useEffect(() => {
    //     check_if_logged_in();

    //     const sub = AS.rx_user.subscribe(user => {
    //         check_if_logged_in();
    //     });

    //     return () => sub.unsubscribe();
    // }, []);

    const PreviewAs = () => {
        if (!AS.is_dev) return null;

        return (
            <div className="w-full inline-flex items-center">
                <div className="w-32">
                    Preview as:
                </div>
                <select className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" >
                    {roles.map(r => {
                        return (
                            <option key={r} value={r}>{r}</option>
                        )
                    })}
                </select>
            </div>
        )
    }


    const on_email_input = (e) => {
        set_user({...user, email: e.target.value});
        // GFN.bro_on_input(e, M, INFO, props, idx);
    }

    const on_email_send = async (e) => {
        // if (AS.is_dev_edit_mode) return; // @todo: get token from ui-server and set in local store

        set_mail_sending(true);
        const s = await GFN.bro_email_login(e, user, INFO);
        set_mail_sending(false);
        
        set_mail_sent(s.success||false);
    }


    const EmailSending = () => {
        return (
            <div>
                {mail_sending ? (
                    <svg aria-hidden="true" className="w-6 h-6 text-gray-200 animate-spin fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M100 50.59c0 27.615-22.386 50.001-50 50.001s-50-22.386-50-50 22.386-50 50-50 50 22.386 50 50Zm-90.919 0c0 22.6 18.32 40.92 40.919 40.92 22.599 0 40.919-18.32 40.919-40.92 0-22.598-18.32-40.918-40.919-40.918-22.599 0-40.919 18.32-40.919 40.919Z" fill="currentColor" /><path d="M93.968 39.04c2.425-.636 3.894-3.128 3.04-5.486A50 50 0 0 0 41.735 1.279c-2.474.414-3.922 2.919-3.285 5.344.637 2.426 3.12 3.849 5.6 3.484a40.916 40.916 0 0 1 44.131 25.769c.902 2.34 3.361 3.802 5.787 3.165Z" fill="currentFill" /></svg>
                ) : (
                    <span className="h-6 flex items-center">{mail_sent ? "Login" : "Mail me a magic link"}</span>
                )}
            </div>
        )
    }


    const on_google_login = (e) => {
        if (AS.is_dev_edit_mode) return;
        GFN.bro_google_login();
    }

    const on_microsoft_login = (e) => {
        if (AS.is_dev_edit_mode) return;
        GFN.bro_microsoft_login();
    }

    const on_github_login = (e) => {
        if (AS.is_dev_edit_mode) return;
        GFN.bro_github_login();
    }

    const on_linkedin_login = (e) => {
        if (AS.is_dev_edit_mode) return;
        GFN.bro_linkedin_login();
    }

    const on_twitter_login = (e) => {
        if (AS.is_dev_edit_mode) return;
        GFN.bro_twitter_login();
    }



    // EFFECTS INIT
	useEffect(()=>{
		init();

		return () => {
            // if(INITIALIZING.value) return; // don't unsubscribe if initializing. There is a strange react unmount bug happeing
			subs.current.forEach(s=>s.unsubscribe());
		}
	}, []);


    // USER DEFINED EFFECTS
    // b@effects



	// FUNCTIONS

	const set_pre = (M: OBJ_WITH_ID): OBJ_WITH_ID => {
		return M;
	}

	const set_post = (M: OBJ_WITH_ID): OBJ_WITH_ID => {
		return M;
	}



    // RxJs Subscriptions - to be destroyed on unmount
	const subs = useRef<Subscription[]>([]);

	const init = async ()=>{
		const mid = INFO.mid;
		const cid = INFO.cid;
		if(!mid || !cid) return console.warn("NO MODEL ID OR COMP ID FOUND");


		// remove all previous subscriptions
		subs.current.forEach(s=>s.unsubscribe()); subs.current = [];

		
		// NOTHING TO DOWNLOAD IN main.tsx


	}

    // USER DEFINED FUNCTIONS
    // b@functions



	// STATEMENTS
	INFO.SET_M          = SET_M;
	INFO.query		  	= VARS.query;
	INFO.on_created     = props.on_created || props.INFO?.on_created;
	INFO.on_selected    = props.on_selected || props.INFO?.on_selected;

    // USER DEFINED STATEMENTS
    // b@statements




	// CONDITIONALS ATTRS
	const COND_ATTRS = {};
	//b@cond-attrs







	// DYNAMIC REACT STATES
	const REACT_STATES: {[name: string]: {state: any, set_state: any, defaultValue?: any}} = {};
    // b@dynamic-states
    // we are also using REACT_STATES to generate some dynamic state from html <state> tag, or from state attr

	


	// MAPPED DATA
	// b@mapped-data


	// USER CODE - Extra code written by user
	// b@user-code

	// b@user-code-end




    return (
		<ErrorBoundary fallbackRender={FallbackRender} onReset={(d) => { console.error(d) }}>
            <BROKEN_JSX />
		</ErrorBoundary>
	)
}


export default observer(Login);