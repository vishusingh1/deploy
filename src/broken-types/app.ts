
// all the final types will be here
// specific types have to be written in specific folders of app types
// imports to other project files happen from here, not from internal version files (unless if specific version is required)

import { z } from 'zod';
import { zod_app_object_v1, zod_app_ui_v1, zod_browser_permissions, zod_login_methods_v1, zod_payment_details } from './app_versions/app_v1';
import { z_server_state, zod_app_object_v2, zod_app_ui_v2, zod_login_methods_v2 } from './app_versions/app_v2';
import { zod_api, zod_app_api, zod_app_authz, zod_app_store, zod_apps_store, zod_authz, zod_comparitive, zod_datascript_level, zod_db, zod_domain_login, zod_login, zod_middleware, zod_middleware_ops, zod_model, zod_model_api, zod_model_authz, zod_model_prop, zod_none_login, zod_operation, zod_private_login, zod_public_login, zod_subscribe_reccurence, zod_user_profile } from './app_versions/app_internals';
import { z_accounts_type_v1 } from './broken-user-api/user/user-internals';





export const zod_app_ui = z.union([zod_app_ui_v1, zod_app_ui_v2]);


export const zod_app_object = z.union([zod_app_object_v1, zod_app_object_v2]);
export const zod_login_methods = z.union([zod_login_methods_v1, zod_login_methods_v2]);


export type operation_type = z.infer<typeof zod_operation>;
export type comparitive_type = z.infer<typeof zod_comparitive>;
export type model_prop_type = z.infer<typeof zod_model_prop>;
export type middleware_ops_type = z.infer<typeof zod_middleware_ops>;
export type middleware_type = z.infer<typeof zod_middleware>;
export type model_type = z.infer<typeof zod_model>;
export type app_api_type = z.infer<typeof zod_app_api>;
export type model_api_type = z.infer<typeof zod_model_api>;
export type api_type = z.infer<typeof zod_api>;
export type app_authz_type = z.infer<typeof zod_app_authz>;
export type model_authz_type = z.infer<typeof zod_model_authz>;
export type authz_type = z.infer<typeof zod_authz>;
export type none_login_type = z.infer<typeof zod_none_login>;
export type private_login_type = z.infer<typeof zod_private_login>;
export type public_login_type = z.infer<typeof zod_public_login>;
export type domain_login_type = z.infer<typeof zod_domain_login>;
export type login_type = z.infer<typeof zod_login>;
export type datascript_level_type = z.infer<typeof zod_datascript_level>;
export type db_type = z.infer<typeof zod_db>;
export type login_methods_type = z.infer<typeof zod_login_methods>;
export type browser_permissions_type = z.infer<typeof zod_browser_permissions>;
export type payment_details_type = z.infer<typeof zod_payment_details>;

export type app_store_type = z.infer<typeof zod_app_store>;
export type apps_store_type = z.infer<typeof zod_apps_store>;

export type user_profile_type = z.infer<typeof zod_user_profile>;
export type user_acc_type = z.infer<typeof z_accounts_type_v1>;
export type subscribe_reccurence_type = z.infer<typeof zod_subscribe_reccurence>;

export type server_state_meta_type = z.infer<typeof z_server_state>;
export type app_object_type = z.infer<typeof zod_app_object>;
export type app_ui_type = z.infer<typeof zod_app_ui>