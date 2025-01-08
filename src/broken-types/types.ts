import { acc_type } from "./broken-user-api/user/user-internals";

export type navbar_tab_type = 'Models' | 'APIs' | 'Permissions' | 'UI' | 'Advanced' | 'headerBroken'
export const navbar_tabs: navbar_tab_type[] = ['Models', 'APIs', 'Permissions', 'UI', 'Advanced'];
export type crud_op_type = 'Get' | 'Create' | 'Edit' | 'Delete'
export const crud_ops: crud_op_type[] = ['Get', 'Create', 'Edit', 'Delete'];
export type authz_type_type = 'role' | 'resource' | 'attribute'
export const authz_types: authz_type_type[] = ['role', 'resource', 'attribute'];
export type default_role_type = 'admin' | 'editor' | 'user' | 'viewer'
export const default_roles: default_role_type[] = ['admin', 'editor', 'user', 'viewer'];
export type comparitive_type = 'eq' | 'gt' | 'lt' | 'ne' | 'ge' | 'le'
export const comparitives: comparitive_type[] = ['eq', 'gt', 'lt', 'ne', 'ge', 'le'];
export type scope_type = 'user.role.name'
export const scopes: scope_type[] = ['user.role.name'];
export const basic_props: string[] = ['user_id', 'serial', 'text', 'number', 'date', 'time', 'datetime', 'password', 'color', 'boolean', 'url', 'email', 'description', 'rich_text', 'image', 'file', 'any_one_of', 'many_of'];
export const undeletable_props: string[] = ['created_at', 'created_by', 'updated_at', 'updated_by']; // @important: We can delete 'id' but it will be auto generated
export type prop_attr = 'id' | 'name' | 'type' | 'is_many' | 'is_required' | 'is_unique' | 'is_range' | 'is_json' | 'is_searchable' | 'is_indexable' | 'is_relation' | 'prop_id' | 'documentation'
export const prop_attrs: prop_attr[] = ['id', 'name', 'type', 'is_many', 'is_required', 'is_unique', 'is_range', 'is_json', 'is_searchable', 'is_indexable', 'is_relation', 'prop_id', 'documentation'];
export type middleware = 'pre' | 'post'
export const middlewares: middleware[] = ['pre', 'post'];
export type middleware_api = 'put_one' | 'put_many' | 'get_one' | 'get_many' | 'delete_one' | 'delete_many' | 'update_one' | 'update_many'
export const middleware_apis: middleware_api[] = ['put_one', 'put_many', 'get_one', 'get_many', 'delete_one', 'delete_many', 'update_one', 'update_many'];
export type login_mode = 'none' | 'public' | 'private' | 'domain'
export const login_modes: login_mode[] = ['none', 'public', 'private', 'domain'];
export type advanced_feature = 'middleware' | 'payments' | 'queue' | 'db_type' | 'otp_login'
export const advanced_features: advanced_feature[] = ['payments', 'db_type', 'otp_login', 'middleware', 'queue'];
export type payment_option = 'stripe' | 'razorpay'
export const payment_options: payment_option[] = ['stripe', 'razorpay'];
export const acc_types: acc_type[] = ['free', 'standard', 'professional'];
export type permission_tab = 'roles' | 'app_login' | 'authorization'
export const permission_tabs: permission_tab[] = ['roles', 'app_login', 'authorization'];


export default {};