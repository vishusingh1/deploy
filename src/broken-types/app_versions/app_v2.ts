import { z } from 'zod';
import { zod_api, zod_app_authz, zod_authz, zod_login, zod_middleware, zod_model } from './app_internals';
import { z_user } from '../broken-user-api/user/user-internals';


export const zod_login_methods_v2 = z.object({
	version: z.literal(2),
	email: z.boolean().optional(),
	otp: z.boolean().optional(),
	oauth: z.record(z.string(), z.boolean()).optional(),
});

const z_seo_data = z.object({
	id: z.string(),
	meta_content: z.string().optional(),
	meta_name: z.string().optional(),
	meta_description: z.string().optional(),
});


const z_collaborator = z.object({

	user: z.object({
		id: z.string() // user id
	}).passthrough(),

	access: z.union([
		z.literal('view'),
		z.literal('edit')
	]),
	publish: z.boolean().default(false),
	create_branch: z.boolean().default(false),
	switch_branch: z.boolean().default(false),
	// delete and add collaborators only by owner
})



const zod_model_prop_rel = z.object({

	id				: 	z.string(),
	name			: 	z.string(),
	type			: 	z.string(), // id of the model which it is related to
	is_relation		: 	z.literal(true),
	relation_type	: 	z.union([z.literal("ONE-ONE"), z.literal("MANY-ONE"), z.literal("ONE-MANY"), z.literal("MANY-MANY")]), // A -> B  B's primary key type (SERIAL, TEXT, NUMBER)

	created_at		: 	z.number(),
	created_by		: 	z.string(),
	updated_at		: 	z.number(),
	updated_by		: 	z.string(),

	is_indexable	: 	z.boolean().optional(),

	derived_keys: z.object({
		expression: z.string(),
		conditions: z.array(z.string()).optional()
	}).optional(),

	documentation: z.string().optional()
}).passthrough()



export const zod_model_prop_v2 = z.object({
	id: z.string(),
	name: z.string(),
	type: z.string(),
	relation_type: z.string().optional(), // A -> B  B's primary key type (SERIAL, TEXT, NUMBER)
	created_at: z.number(),
	created_by: z.string(),
	updated_at: z.number(),
	updated_by: z.string(),
	options: z.array(z.string()).optional(), // If the type is any_one_of or many_of, then this is the list of values
	is_required: z.boolean(),
	is_many: z.boolean(),
	is_unique: z.boolean(),
	is_range: z.boolean().optional(),
	is_json: z.boolean().optional(),
	is_relation: z.literal(false).optional(),
	is_searchable: z.boolean().optional(),
	is_indexable: z.boolean().optional(),
	is_rev_rel_many: z.boolean().optional(), // This will decide if ONE-TO-MANY or MANY-TO-MANY

	constraints: z.string().optional(), // Array of constraints won't make sense since we can't really assume they are always ANDed or ORed
	derived_keys: z.object({
		expression: z.string(),
		conditions: z.array(z.string()).optional()
	}).optional(),
	documentation: z.string().optional()
});


export const zod_model_v2 = z.object({
	version: z.number(),
	name: z.string(),
	id: z.string(),
	primarykey: z.string(),
	source: z.string().optional(), // who created it AI/USER
	created_at: z.number(),
	created_by: z.string(),
	updated_at: z.number(),
	updated_by: z.string(),
	deployed_at: z.number(),
	props: z.array(zod_model_prop_v2),
	middleware: zod_middleware.optional(),
	documentation: z.string().optional()
});





export const zod_group = z.object({
	id: z.string().min(1),
	description: z.string().max(500).optional(),
	limits: z.object({
		maxUsers: z.number().optional(),
		maxDataSize: z.number().optional(),
		maxEntities: z.number().optional(),
	}).passthrough(),

	// high level access based on user roles
	access: z.any(),
	// these rules are jsonlogic rules which take entity, user, appjson as inputs and return true or false
	rules: z.record(z.string(), z.any()),
	parent: z.string().optional(),	// id of the group
}).passthrough()



const z_group_within_appjson = zod_group.extend({
	location: z.literal('appjson')
})


const z_group_with_kv = z.object({
	key: z.string(),// shoudl this be the secret key, where the actual key is part of list of secrets?
	location: z.literal('kv')
})


const z_casl_rule = z.object({
	// action: create, read, manage, delete, update
	action: z.string(),
	model_id: z.string(),



	// type to differentiate between static and dynamic conditions

	// conditions are of mongodb style
	// static condition eg: {"created_at" : {$gt : 1298798} , text: {$eq: "t2"}}

	// dynamic condition eg: {"created_by" : {$eq : user.id}, created_at: {$gt: today}}

	conditions: z.object({ type: z.union([z.literal('static'), z.literal('dynamic')]), value: z.record(z.string(), z.any()) }),

	// an array of fields to which user has (or not) access //[name, age]
	fields: z.string().array().optional(),

	// reason for the rule (for not allowing access)
	reason: z.string().optional(),

	// this is important! inverted means that the user is not allowed to perform the action
	inverted: z.boolean(),

	// this is used to apply the rule only if the condition is met
	// FORMAT  will be json logic
	// Variables(or literals) that would be passed or USER, ENTITY, MODEL?, GROUP? (Are group and model needed?) 
	applyOnlyIf: z.union([z.record(z.string(), z.any()), z.boolean()]).optional()
})

const z_rules_in_kv = z.object({
	key: z.string(),
	location: z.literal('KV'),
	type: z.literal('CASL'),
})

const z_casl_rule_within_appjson = z_casl_rule.extend({
	type: z.literal('CASL'),
	location: z.literal('appjson'),
})

const z_casl_rule_with_appjson = z.union([z_casl_rule_within_appjson, z_rules_in_kv])


export const zod_authz_v2 = zod_authz.extend({
	rules: z_casl_rule_with_appjson.array().optional()
})


const z_app_server_state = z.object({
	level: z.literal('app'),
	location: z.string().optional(),//default is dynamo db
	key: z.union([z.string(), z.record(z.string(), z.any())]).optional(),
	auth: zod_app_authz.optional(),// role based authz
})

const z_ui_server_state = z.object({
	level: z.literal('ui'),
	ui_id: z.string(),
	location: z.string().optional(),
	key: z.union([z.string(), z.record(z.string(), z.any())]).optional(),
	auth: zod_app_authz.optional(),
})

const z_model_server_state = z.object({
	level: z.literal('model'),
	model_id: z.string(),
	location: z.string().optional(),
	key: z.union([z.string(), z.record(z.string(), z.any())]).optional(),
	auth: zod_app_authz.optional(),
})

const z_group_server_state = z.object({
	level: z.literal('group'),
	model_id: z.string(),
	group_id: z.string(),

	location: z.string().optional(),
	key: z.union([z.string(), z.record(z.string(), z.any())]).optional(),
	auth: zod_app_authz.optional(),
})


const z_entity_server_state = z.object({
	level: z.literal('entity'),
	entity_id: z.string(),
	model_id: z.string(),
	group_id: z.string().optional(),

	location: z.string().optional(),
	key: z.union([z.string(), z.record(z.string(), z.any())]).optional(), // dbid, {pk, sk}
	auth: zod_app_authz.optional(),
})


export const z_server_state = z.union(
	[
		z_app_server_state,
		z_ui_server_state,
		z_model_server_state,
		z_group_server_state,
		z_entity_server_state
	]
)


//{serverstate: { app1: {level: 'app'}, app2: {level: 'app'},  model_user: {}, model_post: {}, }}
const z_server_states = z.array(z_server_state)


export const zod_app_json_branches_v2 = z.object({
	id: z.string(),
	name: z.string(),

	database: z.object({
		id: z.string(),
		name: z.string(),
		connection: z.union([
			z.object({
				type: z.literal("uri"),
				uri: z.string(), // secret://db_uri_01
			}),
			z.object({
				type: z.literal("credentials"),
				username: z.string(),
				password: z.string(),
				host: z.string(),
				port: z.number(),
				database: z.string(),
				ssl: z.boolean().default(false),
			})
		])
	}).optional()
})

export const zod_app_json_domains_v2 = z.object({
	cloudflare: z.object({
		domain_root_name: z.string(), 	// example.com
		cloudflare_zone_id: z.string().optional(),
		is_domain_verified: z.boolean(),
		original_nameservers: z.array(z.string()).optional(),
		new_nameservers: z.array(z.string()).optional(),
	}).optional(),

	// vercel:
})

export const zod_app_json_ui_v2 = z.object({
	id: z.string(),
	name: z.string(),
	title: z.string().optional(),

	login_methods: zod_login_methods_v2.optional(),// email, otp, oauth
	login: zod_login, // public, private, domain, none

	broken_subdomains: z.array(z.string()),
	domains: z.array(z.object({
		domain: z.string(),
		cloudflare: z.object({
			route_id: z.string().optional(),
		}).optional()
	})), // domain names for each of the application route

	primary_color: z.string().optional(),
	logo: z.string().optional(),
	favicon: z.string().optional(), // svg paste

	seo: z_seo_data.optional(),
})


//specific types of version 2 files here, rest import from app.ts
export const zod_app_object_v2 = z.object({
	version: z.literal(2),
	id: z.string(),
	name: z.string(),
	description: z.string().max(500).optional(),
	logo_url: z.string().optional(),

	models: z.array(zod_model),
	groups: z.record(z.string(), z.union([z_group_within_appjson, z_group_with_kv])).optional(),
	server_states: z_server_states.optional(),


	apis: zod_api,
	authz: zod_authz_v2,

	// FREE => broken-cloudflare + datascript
	//
	infra: z.union([
		z.literal("FREE"),
		z.literal("STANDARD"),
		z.literal("PROFESSIONAL"),
		z.literal("ENTERPRISE"),
	]),

	roles: z.array(z.string()),
	owner: z_user.optional(),
	collaborators: z.array(z_collaborator),
	// browser_permissions: zod_browser_permissions,

	// common middleware for all apis
	// first check if same middleware is defined in model. If not use common middleware
	middleware: zod_middleware.optional(),


	branches: z.record(z.string(), zod_app_json_branches_v2),

	// This is for nameservers and domain verification - cloudflare until the CNAME way is figured out
	domains: zod_app_json_domains_v2.optional(),


	uis: z.array(zod_app_json_ui_v2),

	// git

	// code_apis

	secret: z.record(z.string(), z.string()),


}).passthrough();


export const zod_app_ui_v2 = z.object({
	app_id: z.string(),
	ui_id: z.string(),
	compiled_html: z.string(),
	version: z.literal(2),
	files: z.record(z.string(), z.object({ src: z.string(), headers: z.string(), path: z.string() }))
})