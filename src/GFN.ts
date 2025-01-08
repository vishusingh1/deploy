import { GC } from "./global_state";

import { _logger, feedback, get_api, get_auth, get_feedback, get_ulid, get_utils, json_parse } from './gfn/utils';
import { generate_user_id_by_email, get_roles, get_token, get_user, get_user_profile, get_user_token_api } from './gfn/user';
import { bro_email_login, bro_github_login, bro_google_login, bro_linkedin_login, bro_login, bro_logout, bro_microsoft_login,  bro_mobile_otp_login,  bro_twitter_login, get_otp_login, set_token_after_login } from './gfn/login';
import { push_state_to_history, runtime_get_url_state, runtime_set_url_state } from './gfn/path';
import { bro_on_input, bro_on_input_file, bro_on_input_file_idx, bro_on_input_filter, bro_on_input_idx, bro_on_input_select_many, bro_on_input_select_many_idx, bro_on_key_up, bro_on_key_up_idx, check_email_format, get_valid_target_value, on_input, on_input_file, on_input_file_idx, on_input_idx, on_input_select_many, on_key_up, on_key_up_idx } from './gfn/inputs';
import { to_iso_string } from './gfn/datetime';
import { get_formated_state } from './gfn/format';
import { bro_go_to_page, bro_go_to_page_by_name, bro_navigate, runtime_select_next_page } from './gfn/page';
import { bro_download_file, get_file_obj_from_string, get_nearest_size } from './gfn/files';
import { get_attr_from_event, is_event_in_editing_mode } from './gfn/events';
import { add_meta_key_to_state, add_meta_to_data, array_or_null, get_key_from_meta, get_safe_condition, non_empty_array_or_null, safe_array } from './gfn/ds-utils';
import { bro_add_prop_item, bro_add_rel_item, bro_delete_prop, bro_delete_prop_item, on_input_relation, on_is_json_change } from './gfn/props';
import { decrement, increment } from './gfn/actions';
import { inc_tx } from './gfn/db';
import { bro_accordion, bro_alert, bro_dropdown, bro_formula, bro_print, bro_run_custom_action, bro_toast } from './gfn/bro-fns';
import MODELFN, { get_model, get_model_by_name } from './gfn/models';
import { apply_updates, assign_id_and_user_and_time, bro_apply_updates, bro_update_one, prepare_data_for_update, update_one, update_one_get_changed_values, update_one_prop } from './gfn/update';
import { bro_create_one, create_many, create_one, prepare_data_for_create } from './gfn/create';
import { download_csv_data, upload_csv_data } from './gfn/data';
import { bro_select_one, get_selected_entity_id, is_selected, select_one } from './gfn/select';
import {  bro_get_many, bro_get_many_next, bro_get_many_prev, bro_get_one, bro_subs_for_get_many_on_tx, get_many, get_many_pagination, get_many_qid, get_one, get_one_find_id } from './gfn/get';
import { bro_delete_one, delete_one } from './gfn/delete';
import { bro_apply_filters, bro_apply_limit, bro_apply_sorts, bro_emit_filters, update_query_filters } from './gfn/filters';
import { call_server_side_comp } from './gfn/ssr-comp';
import { clear_db } from './gfn/local-db';
import { get_valid_date, get_valid_datetime, get_valid_time } from './gfn/time-utils';
import { add_script, add_style, toggle_dark_mode } from './gfn/html';
import { set_state, toggle_state } from './gfn/react';
import { GET, GET_ARRAY } from './gfn/jsx-fns';
import { emit_m } from './gfn/dev';
import { get_aggregate } from './gfn/aggregate';
import { freeze_many, freeze_one } from "./gfn/freeze";
import { bro_close_modal, bro_open_modal } from "./gfn/modal";




const EN_BROKEN_G_FN_LOGS = {
    PAGE_CHANGED: false,
    URL_POP_STATE: false,
    LOGIN: true,
    DATE_TIME_CREATE: false,
    GET_MANY: false,
    GET_ONE: false,
    FILTERS: false,
}
window.EN_BROKEN_G_FN_LOGS = EN_BROKEN_G_FN_LOGS;

// Filter OBJ is used to create filters in the UI. It is converted to FILTER_PARAMS before sending to the server




const GFN = {
    _logger: _logger,

    feedback: feedback,

    get_feedback: get_feedback,

    // get_broken: get_broken,
    // get_current: get_current,


    get_api: get_api,

    get_ulid: get_ulid,
    get_utils: get_utils,
    get_user_token_api: get_user_token_api,
    
    
    
    get_auth: get_auth,
    get_otp_login: get_otp_login,
    get_token: get_token,
    get_user: get_user,
    get_roles: get_roles,



    push_state_to_history: push_state_to_history,

    get_valid_target_value: get_valid_target_value,

    to_iso_string: to_iso_string,

    get_formated_state: get_formated_state,

    runtime_select_next_page: runtime_select_next_page,


    // we aren't using this
    // runtime_set_page_effect: runtime_set_page_effect,
    // runtime_set_app_effect: runtime_set_app_effect,



    runtime_get_url_state: runtime_get_url_state,

    runtime_set_url_state: runtime_set_url_state,

    
    // g_app_state_init: g_app_state_init,
    // g_app_init: g_app_init, 
    // init_online: init_online,
    // init_offline: init_offline,


    get_nearest_size: get_nearest_size,

    get_file_obj_from_string: get_file_obj_from_string,



    // Input functions
    get_attr_from_event: get_attr_from_event,
    is_event_in_editing_mode: is_event_in_editing_mode,

    on_key_up: on_key_up,
    bro_on_key_up: bro_on_key_up,

    on_key_up_idx: on_key_up_idx,
    bro_on_key_up_idx: bro_on_key_up_idx,

    on_input: on_input,
    bro_on_input: bro_on_input,

    on_input_select_many: on_input_select_many,
    // bro_on_input_select_any: bro_on_input_select_any,
    bro_on_input_select_many: bro_on_input_select_many,
    bro_on_input_select_many_idx: bro_on_input_select_many_idx,

    bro_on_input_filter: bro_on_input_filter,


    on_input_idx: on_input_idx,

    bro_on_input_idx: bro_on_input_idx,

    on_input_file: on_input_file,


    bro_on_input_file: bro_on_input_file,

    
    add_meta_key_to_state: add_meta_key_to_state,

    on_input_file_idx: on_input_file_idx,

    bro_on_input_file_idx: bro_on_input_file_idx,


    bro_add_rel_item : bro_add_rel_item,

    bro_add_prop_item: bro_add_prop_item,


    bro_delete_prop_item: bro_delete_prop_item,

    bro_delete_prop: bro_delete_prop,


    on_input_relation: on_input_relation,

    on_is_json_change: on_is_json_change,



    bro_download_file: bro_download_file,




    increment: increment,
    decrement: decrement,

    check_email_format: check_email_format,

    // Returns true if client_id is set - To show state in login page for applications
    set_token_after_login: set_token_after_login,

    // broken std.lib
    bro_email_login: bro_email_login,
    bro_mobile_otp_login,
    bro_google_login: bro_google_login,
    bro_microsoft_login: bro_microsoft_login,
    bro_github_login: bro_github_login,
    bro_linkedin_login: bro_linkedin_login,
    bro_twitter_login: bro_twitter_login,

    bro_login: bro_login, // default login method => using email
    bro_logout: bro_logout,

    inc_tx: inc_tx,

    bro_go_to_page: bro_go_to_page,

    bro_go_to_page_by_name : bro_go_to_page_by_name,




    bro_navigate: bro_navigate,




    bro_alert: bro_alert,

    bro_toast: bro_toast,

    bro_formula: bro_formula,

    bro_open_modal:bro_open_modal,
    bro_close_modal:bro_close_modal,

    bro_accordion: bro_accordion,
    bro_dropdown: bro_dropdown,
    bro_print: bro_print,

    // @deprecated: use GFN.MODELFN
    get_model: get_model,
    // @deprecated: use GFN.MODELFN
    get_model_by_name: get_model_by_name,
    MODELFN: MODELFN,


    assign_id_and_user_and_time: assign_id_and_user_and_time,



    prepare_data_for_create: prepare_data_for_create,
    prepare_data_for_update: prepare_data_for_update,

    upload_csv_data: upload_csv_data,
    download_csv_data: download_csv_data,

    create_one: create_one,
    bro_create_one: bro_create_one,

    create_many: create_many,
    bro_select_one: bro_select_one,
    select_one: select_one,
    is_selected: is_selected,

    get_one : get_one,
    get_one_find_id: get_one_find_id,
    // get_one_query_entity : get_one_query_entity,
    // get_prop_value_from_query : get_prop_value_from_query,
    get_selected_entity_id : get_selected_entity_id,
    // get_selected_entity : get_selected_entity,
    generate_user_id_by_email : generate_user_id_by_email,
    get_many_qid : get_many_qid,
    bro_get_one: bro_get_one,
    update_one_get_changed_values: update_one_get_changed_values,
    update_one: update_one,
    bro_update_one: bro_update_one,
    update_one_prop: update_one_prop,

    // takes a update object which has the diff and changes the DB
    apply_updates: apply_updates,
    bro_apply_updates: bro_apply_updates,
    delete_one: delete_one,

    bro_delete_one: bro_delete_one,
    get_many : get_many,
    
    get_aggregate : get_aggregate,

    get_many_pagination: get_many_pagination,



    bro_get_many: bro_get_many,
    bro_get_many_next: bro_get_many_next,
    bro_get_many_prev: bro_get_many_prev,
    // bro_get_many_for_pagination : bro_get_many_for_pagination,
    bro_apply_filters: bro_apply_filters,
    bro_emit_filters: bro_emit_filters,
    update_query_filters: update_query_filters,
    
    bro_apply_sorts: bro_apply_sorts,
    bro_apply_limit: bro_apply_limit,
    // bro_on_input_set_text_filters: bro_on_input_set_text_filters,
    // bro_get_is_json: bro_get_is_json,

    freeze_many: freeze_many,
    freeze_one: freeze_one,


    call_server_side_comp : call_server_side_comp,





    clear_db: clear_db,

    bro_subs_for_get_many_on_tx: bro_subs_for_get_many_on_tx,
    // bro_subs_for_get_selected_one: bro_subs_for_get_selected_one,

    // bro_subs_for_selected_entity: bro_subs_for_selected_entity,



    // Server side component

    // This is the user model in our app
    get_user_profile: get_user_profile,

    // utils
    array_or_null: array_or_null,
    safe_array: safe_array,
    non_empty_array_or_null: non_empty_array_or_null,

    get_key_from_meta: get_key_from_meta,

    get_safe_condition: get_safe_condition,
    json_parse: json_parse,
    add_meta_to_data: add_meta_to_data,

    // time
    time_utils: {
        get_valid_date: get_valid_date,
        get_valid_time: get_valid_time,
        get_valid_datetime: get_valid_datetime
    },

    add_script: add_script,
    add_style: add_style,


    // REACT_STATE
    toggle_state: toggle_state,
    set_state: set_state,
    toggle_dark_mode: toggle_dark_mode,


    // CUSTOM ACTION
    bro_run_custom_action : bro_run_custom_action,



    // this will work only during development, in production it will be empty, we have to call init_app_state
    // AS: AS,

    // this can't be async => it will be used inside JSX
    GET: GET,
    GET_ARRAY: GET_ARRAY,

    G_STATIC_DATA: {},

    GET_GC: ()=>GC,



    // DEV
    dev: {
        emit_m: emit_m
    }
};


export default GFN;
