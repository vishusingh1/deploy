import { operation_type } from "../broken-types/app";

export const BROKEN_ACTIONS: { [k: string]: {
    name: string, 
    code: string, 
    description: string,
    icon?: string,


    scope?: "prop" | "model"
    op?: string
} } = {
	celebrate: {
        name: 'Celebrate',
        code: 'alert(Hooray!)',
        description: 'Celebrate',
        icon: '🎉'
    },

	alert: {
        name: "Alert",
        code: "GFN.bro_alert(e,$BRO_PARAMS)",
        description: 'Alert',
        icon: '👋'
    },
	toast: {
        name: "Toast",
        code: 'GFN.bro_toast(e,$BRO_PARAMS)',
        description: 'Toast',
        icon: '🍞'
    },
    confirm: {
        name: "Confirm",
        code: 'GFN.bro_confirm(e, M, INFO, props, idx)',
        description: 'Confirm',
        icon: '🤔'
    },
    prompt: {
        name: "Prompt",
        code: 'GFN.bro_prompt(e, M, INFO, props, idx)',
        description: 'Prompt',
        icon: '🤔'
    },

    // Increment
    increment: {
        name: "Increment",
        code: 'GFN.increment(e, M, INFO, props, idx)',
        description: 'Increment',
        icon: '🔢'
    },

    // Decrement
    decrement: {
        name: "Decrement",
        code: 'GFN.decrement(e, M, INFO, props, idx)',
        description: 'Decrement',
        icon: '🔢'
    },

    // Formula
    formula: {
        name: "Formula",
        code: 'GFN.bro_formula(e, M, INFO, props, idx)',
        description: 'Formula',
        icon: '🧮'
    },

    // Accordion
    accordion: {
        name: "Accordion",
        code: 'GFN.bro_accordion(e, M, INFO, props, idx)',
        description: 'Accordion',
        icon: '📜'
    },

    // Dropdown
    dropdown: {
        name: "Dropdown",
        code: 'GFN.bro_dropdown(e, M, INFO, props, idx)',
        description: 'Dropdown',
        icon: '📜'
    },




	// Inputs
	// In all these actions we expect the name of the prop is stored in the attr b_name and idx is stored in b_idx inside the html node
    "oninput-update-m": {
        name: "On Input Update M",
        code: 'GFN.bro_on_input(e, M, INFO, props, idx)',
        description:'Input unpdate of props in model in draft',
        icon: '📝',

        scope: "model"
    },

    "oninput-update-m-idx": {
        name: "On Input Update M Idx",
        code: 'GFN.bro_on_input_idx(e, M, INFO, props, idx)',
        description:'Input update of is many props in model in draft',
        icon: '📝',

        scope: "model"
    },

    "oninput-update-m-file": {
        name: "On Input Update M File",
        code: 'GFN.bro_on_input_file(e, M, INFO, props, idx)',
        description:'Input update of file props in model in draft',
        icon: '📝',

        scope: "model"
    },

    "oninput-update-m-file-idx": {
        name: "On Input Update M File Idx",
        code: 'GFN.bro_on_input_file_idx(e, M, INFO, props, idx)',
        description:'Input update of is many file props in model in draft',
        icon: '📝',

        scope: "model"
    },

    "oninput-update-m-select-any": {
        name: "On Input Update M Select Any",
        code: 'GFN.bro_on_input_select_any(e, M, INFO, props, idx)',
        description:'Input update of any one of props in model in draft',
        icon: '📝',

        scope: "model"
    },

    "oninput-update-m-select-many": {
        name: "On Input Update M Select Many",
        code: 'GFN.bro_on_input_select_many(e, M, INFO, props, idx)',
        description:'Input update of many of props in model in draft',
        icon: '📝',

        scope: "model"
    },

    "oninput-update-m-select-many-idx": {
        name: "On Input Update M Select Any Idx",
        code: 'GFN.bro_on_input_select_many_idx(e, M, INFO, props, idx)', // have another function for idx
        description:'Input update of is many many of props in model in draft',
        icon: '📝',

        scope: "model"
    },





	// Inputs on Submit
	"oninput-set-text-filters": {
        name: "On Input Set Text Filters",
        code: 'GFN.bro_on_input_set_text_filters(e, M, INFO, props, idx)',
        description:'Input set text filters in model',
        icon: '📝',

        scope: "model",
        op: "get_many"
    },



	// Buttons
    "add-prop-item": {
        name: "Add Prop Item",
        code: 'GFN.bro_add_prop_item(e, M, INFO, props, idx)',
        description:'Add prop item',
        icon: '➕',

        scope: "model"
    },

    "delete-prop-item": {
        name: "Delete Prop Item",
        code: 'GFN.bro_delete_prop_item(e, M, INFO, props, idx)',
        description:'Delete prop item',
        icon: '➖',

        scope: "model"
    },

    "delete-prop": {
        name: "Delete Prop",
        code: 'GFN.bro_delete_prop(e, M, INFO, props, idx)',
        description:'Delete prop',
        icon: '⛔',

        scope: "model"
    },


	// Page
	'go-to-page': {
        name: "Go To Page",
        code: 'GFN.bro_go_to_page(e, M, INFO, props, idx)',
        description:'Go to page',
        icon: '👉 📄'
    },


	// navigate
	'navigate': {
        name: "Navigate",
        code: 'GFN.bro_navigate(e, M, INFO, props, idx)',
        description:'Navigate',
        icon: '👉'
    },

	//Print
    "print": {
        name: "Print",
        code: 'GFN.bro_print(e, M, INFO, props, idx)',
        description:'Print',
        icon: '🖨'
    
    },


	// Buttons DB
    "create_one": {
        name: "Create One",
        code: 'GFN.bro_create_one(e, M, INFO, props, idx)',
        description:'Create one of data',
        icon: '➕',

        scope: "model"
    },

    "delete_one": {
        name: "Delete One",
        code: 'GFN.bro_delete_one(e, M, INFO, props, idx)',
        description:'Delete one of data',
        icon: '➖',

        scope: "model"
    },

    "update_one": {
        name: "Update One",
        code: 'GFN.bro_update_one(e, M, INFO, props, idx)',
        description:'Update one of data',
        icon: '✏',

        scope: "model"
    },




    "select-one": {
        name: "Select One",
        code: 'GFN.bro_select_one(e, M, INFO, props, idx)',
        description:'Select one of data',
        icon: '🔍',

        scope: "model"
    },



    




	'apply_updates': {
        name: "Apply Updates",
        code: 'GFN.bro_apply_updates(e, M, INFO, props, idx)',
        description:'Apply updates',
        icon: '📝',

        scope: "model"
    },




	//filter pagination
	'get-next': {
        name: "Get Next",
        code: 'GFN.bro_get_many_for_pagination(e, M, INFO, props, idx)',
        description:'Get next in pagination',
        icon: '👉',

        scope: "model",
        op: "get_many",
    },

	'get-prev': {
        name: "Get Prev",
        code: 'GFN.bro_get_many_for_pagination(e, M, INFO, props, idx)',
        description:'Get previous in pagination',
        icon: '👈',

        scope: "model",
        op: "get_many",
    },


	//runtime filters
	'apply-filters': {
        name: "Apply Filters",
        code: 'GFN.bro_apply_filters(e, M, INFO, props, idx)',
        description:'Apply filters',
        icon: '📝',

        scope: "model",
        op: "get_many",
    },





	// Broken std.lib
    "login": {
        name: "Login",
        code: 'GFN.bro_login(e, M, INFO, props, idx)',
        description:'Login',
        icon: '🔑'
    },

    "logout": {
        name: "Logout",
        code: 'GFN.bro_logout(e, M, INFO, props, idx)',
        description:'Logout',
        icon: '🔑'
    },


	'show-login': {
        name: "Show Login",
        code: 'AS.rx_show_login.next(true)',
        description:'Show login',
        icon: '🔑'
    },



	// Utils
	'onclick-toggle-s': {
        name: "Toggle S",
        code: 'GFN.toggle_state(e, M, INFO, props, idx, REACT_STATES)',
        description:'Toggle state',
        icon: '🔁'
    },

	'onclick-set-s': {
        name: "Set S",
        code: 'GFN.set_state(e, M, INFO, props, idx, REACT_STATES)',
        description:'Set state on onclick',
        icon: '🔁'
    },

	'toggle-dark-mode': {
        name: "Toggle Dark Mode",
        code: 'GFN.toggle_dark_mode(e, M, INFO, props, idx)',
        description:'Toggle dark mode',
        icon: '🌓'
    },


	// DEV ONLY
	'onclick-emit-m': {
        name: "Emit M",
        code: 'GFN.dev.emit_m(e, M, INFO, props, idx)',
        description:'Emit M',
        icon: '📡'
    },

	
    // To allow writing custom functions :
	'custom-action': {
        name: "Custom Action",
        code: 'GFN.bro_run_custom_action(e)',
        description:'Custom Action',
        icon: '🔧'
    },
    
    //Open modal
    'open-modal': {
        name: "Open Modal",
        code: 'GFN.bro_open_modal(e, M, INFO, props, idx)',
        description:'Open Modal',
        icon: '📦'
    },
    //close modal
    'close-modal': {
        name: "Close Modal",
        code: 'GFN.bro_close_modal(e, M, INFO, props, idx)',
        description:'Close Modal',
        icon: '📦'
    }
  

};