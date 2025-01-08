import { z } from 'zod';
import { zod_api, zod_authz, zod_db, zod_login, zod_model } from '../app_versions/app_internals';
import { z_user } from '../broken-user-api/user/user-internals';

// specific types of version 1 here, rest import from  app.ts

// if creating a separate versions  for models, keep v1 here
export const zod_payment_details = z.object({
	key: z.string(),
	secret: z.string()
});

export const zod_login_methods_v1 = z.object({
	version: z.literal(1).optional(), // first version does not have version
	email: z.boolean().optional(),
	otp: z.boolean().optional(),
	oauth: z.object({
		google: z.boolean().optional(),
		microsoft: z.boolean().optional(),
		github: z.boolean().optional(),
		linkedin: z.boolean().optional(),
		twitter: z.boolean().optional(),
		gitlab: z.boolean().optional(),
		facebook: z.boolean().optional(),
		instagram: z.boolean().optional(),
		apple: z.boolean().optional(),
		amazon: z.boolean().optional(),
		yahoo: z.boolean().optional(),
		wordpress: z.boolean().optional(),
		wordpresscom: z.boolean().optional(),
		tumblr: z.boolean().optional(),
		medium: z.boolean().optional(),
		pinterest: z.boolean().optional(),
		reddit: z.boolean().optional(),
		figma: z.boolean().optional(),
	}).optional(),
}).passthrough();

export const zod_browser_permissions = z.object({
	"Location": z.boolean().optional(),
	"Notifications": z.boolean().optional(),
	"Microphone": z.boolean().optional(),
	"Camera": z.boolean().optional(),
	"Sound": z.boolean().optional(),
});


export const zod_app_object_v1 = z.object({
	version: z.literal(1),
	id: z.string(),
	name: z.string(),
	logo_url: z.string(),
	models: z.array(zod_model),
	apis: zod_api,
	authz: zod_authz,
	login: zod_login,
	db_type: zod_db,
	roles: z.array(z.string()),
	creator: z_user.optional(),
	favicon: z.string().optional(), // svg paste
	meta_name: z.string().optional(),
	meta_content: z.string().optional(),
	title: z.string().optional(),
	login_methods: zod_login_methods_v1.optional(),
	description: z.string().optional(),
	browser_permissions: zod_browser_permissions.optional(),
	payments: z.object({
		razorpay: zod_payment_details.optional(),
		stripe: zod_payment_details.optional(),
	}).optional()
});



export const zod_app_ui_v1 = z.object({
	app_id: z.string().length(26),
	ui_id: z.string().length(11), // bnode_{5 letters}
	compiled_html: z.string(),
	version : z.literal(1).optional()
})



export default {};