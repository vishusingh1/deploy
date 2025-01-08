
	import { z } from 'zod';

	export const zod_operation = z.union([
		z.literal('create'),
		z.literal('read'),
		z.literal('update'),
		z.literal('delete')
	]);

	export const zod_comparitive = z.union([
		z.literal('eq'),
		z.literal('ne'),
		z.literal('gt'),
		z.literal('lt'),
		z.literal('ge'),
		z.literal('le')
	]);

	const zod_rel_prop = z.object({

		id				: 	z.string(),
		name			: 	z.string(),
		type			: 	z.string(), // rel model id
		is_relation		: 	z.literal(true),

		relation_type	: 	z.union([z.literal("ONE-ONE"), z.literal("MANY-ONE"), z.literal("ONE-MANY"), z.literal("MANY-MANY")]).optional(), // A -> B  B's primary key type (SERIAL, TEXT, NUMBER)

		created_at		: 	z.number(),
		created_by		: 	z.string(),
		updated_at		: 	z.number(),
		updated_by		: 	z.string(),

		is_indexable	: 	z.boolean().optional(),
		is_required		: 	z.boolean().optional(),

		derived_keys: z.object({
			expression: z.string(),
			conditions: z.array(z.string()).optional()
		}).optional(),

		documentation: z.string().optional()
	}).passthrough()

	const zod_prop = z.object({

		id: z.string(),
		prop_id: z.string().optional(),
		name: z.string(),
		type: z.string(),

		created_at: z.number(),
		created_by: z.string(),
		updated_at: z.number(),
		updated_by: z.string(),


		options: z.union([z.string().array(), z.record(z.any()).array()]).optional(), // If the type is any_one_of or many_of, then this is the list of values
		is_required: z.boolean(),
		is_many: z.boolean(),
		is_unique: z.boolean(),
		is_range: z.boolean().optional(),
		is_json: z.boolean().optional(),
		is_relation: z.literal(false).optional(),
		is_searchable: z.boolean().optional(),
		is_indexable: z.boolean().optional(),
		constraints: z.string().optional(), // Array of constraints won't make sense since we can't really assume they are always ANDed or ORed
		derived_keys: z.object({
			expression: z.string(),
			conditions: z.array(z.string()).optional()
		}).optional(),
		documentation: z.string().max(100).optional()
	})

	export const zod_model_prop = z.union([zod_prop, zod_rel_prop])


	/*
		{pre: {
			"/api/v1/create_one": ["https://altheal.io"],
			"/api/v1/transaction": ["https://altheal.io"]
		}}
	*/
	export const zod_middleware_ops = z.record(z.string(), z.array(z.string()).optional())


	export const zod_middleware = z.object({
		pre: zod_middleware_ops.optional(),
		post: zod_middleware_ops.optional()
	});

	export const zod_model = z.object({
		version: z.number(),
		name: z.string(),
		id: z.string(),
		ns: z.string().optional(),
		hash_id: z.string().optional(),
		primarykey: z.string(),
		source: z.string().optional(),

		// Use for migration/ undo-redo
		created_at: z.number(),
		created_by: z.string(),
		updated_at: z.number(),
		updated_by: z.string(),

		deployed_at: z.number().optional(),

		props: z.array(zod_model_prop),
		middleware: zod_middleware.optional(),
		forward_to_queue: z.string().optional(),
		db: z.record(z.string()).optional(),
		documentation: z.string().max(200).optional()
	});




	export const zod_app_api = z.any();
	export const zod_model_api = z.record(z.any());

	export const zod_api = z.object({
		app: zod_app_api.optional(),
		models: zod_model_api.optional()
	});

	export const zod_app_authz = z.object({
		role: z.record(
			z.array(zod_operation)
		),
		resource: z.array(z.object({
			rule: z.object({
				lhs: z.string(),
				condition: zod_comparitive,
				rhs: z.string()
			}),
			permissions: z.record(
				z.array(zod_operation)
			)
		})).optional(),
		attribute: z.array(z.any()).optional(),
	});

	export const zod_model_authz = z.record(zod_app_api);

	export const zod_authz = z.object({
		app: zod_app_authz,
		models: zod_model_authz
	});

	export const zod_none_login = z.object({
		type: z.literal('none'),
		pre: z.any().optional(), // before login check true or false, castle code
		post: z.any().optional()
	});

	export const zod_public_login = z.object({
		type: z.literal('public'),
		default_role: z.string(),
		pre: z.any().optional(), // before login check true or false, castle code
		post: z.any().optional()
	});

	export const zod_private_login = z.object({
		type: z.literal('private'),
		pre: z.any().optional(), // before login check true or false, castle code
		post: z.any().optional()
	});

	export const zod_domain_login = z.object({
		type: z.literal('domain'),
		domains: z.array(z.object({
			name: z.string(),
			default_role: z.string()
		})),
		pre: z.any().optional(), // before login check true or false, castle code
		post: z.any().optional()
	});

	export const zod_login = z.union([
		zod_none_login,
		zod_public_login,
		zod_private_login,
		zod_domain_login
	]);

	export const zod_datascript_level = z.tuple([
		z.literal('application')
	]).rest(
		z.union([
			z.literal('user'),
			z.literal('entity')
		])
	);

	export const zod_db = z.union([ // Default is dynamodb
		z.object({
			type: z.literal('dynamodb')
		}),
		z.object({
			type: z.literal('datascript'),
			level: zod_datascript_level
		})
	]);




	export const zod_browser_permissions = z.object({
		"Location": z.boolean().optional(),
		"Notifications": z.boolean().optional(),
		"Microphone": z.boolean().optional(),
		"Camera": z.boolean().optional(),
		"Sound": z.boolean().optional(),
	});

	export const zod_payment_details = z.object({
		key: z.string(),
		secret: z.string()
	});

	export const zod_app_store = z.object({
		id: z.string(),
		name: z.string(),
		logo_url: z.string(),
	})

	export const zod_apps_store = z.array(zod_app_store);



	export const zod_subscribe_reccurence = z.union([
		z.literal('MONTHLY'),
		z.literal('YEARLY')
	])

	export const zod_app = z.object({
		id: z.string(),
		name: z.string(),
		logo_url: z.string(),
		version: z.number(),
		created_at: z.number(),
		updated_at: z.number().optional(),
		url: z.string(),
	})

	export const zod_user_profile = z.object({
		apps: z.object({
			live: z.array(zod_app),
			archived: z.array(zod_app.extend({
				archived_at: z.number()
			})),
			deleted: z.array(zod_app.extend({
				deleted_at: z.number()
			}))
		})
	});

	export type app_type = z.infer<typeof zod_app>;