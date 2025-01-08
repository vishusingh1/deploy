import { z } from 'zod';

export const z_condition = z.object({
	final: z.string(),
	basis: z.object({
		attr: z.string(),
		op: z.string(),
		val: z.any(),
	}).optional(),
});

export const z_conditional_value = z.object({
	id: z.string(),
	conditions: z.array(z_condition),
	value: z.any(),
});
export const z_conditional_values = z.array(z_conditional_value);
export type T_CONDITIONAL_VALUE = z.infer<typeof z_conditional_value>;
export type T_CONDITIONAL_VALUES = z.infer<typeof z_conditional_values>;


// @todo : implementing the following query type only for get_one, to be implemented for get many too
export const z_query_type = z.object({
	prop_name: z.string(),
	prop_value: z.string(),
	op: z.string()
});


/**
 * {
 *      node_id: {
 *          attr: [z_conditional_value]
 *      }
 *
 *      bnode_abc: {
 *          class: [{id:'24ipi',value:'bg-pink-400',conditions:[{final:'M.email === \'act.jnv@gmail.com\''}]}]
 *      }
 * }
 */
export const z_conditional_attr_ctx = z.record(z.record(z_conditional_values));
export type T_CONDITIONAL_ATTR_CTX = z.infer<typeof z_conditional_attr_ctx>;

export const z_node_update = z.object({
	source: z.string(),
	dest: z.string(),
	action: z.string(),
	code: z.string().optional()
});
export const z_node_updates = z.array(z_node_update);

export type T_NODE_UPDATE = z.infer<typeof z_node_update>;
export type T_NODE_UPDATES = z.infer<typeof z_node_updates>;

export const z_node_filters_data = z.object({
	id: z.string(),
	name: z.string(),
	filter: z.array(z.object({
		id: z.string(),
		attr: z.string(),
		op: z.string(),
		val: z.any(),
		meta: z.any()
	})),
	data: z.array(z.record(z.string())).optional(), // it's the Model data [], all filter based on this are of type key === value
	enabled: z.boolean().optional(),
	static: z.boolean().optional(),
	live: z.boolean().optional(),
	realtime: z.boolean().optional(),
});
export const z_node_filters_datas = z.array(z_node_filters_data);

export type T_NODE_FILTERS_DATAS = z.infer<typeof z_node_filters_datas>;
export type T_NODE_FILTERS_DATA = z.infer<typeof z_node_filters_data>;
export type T_NODE_FILTERS = { [id: string]: T_NODE_FILTERS_DATAS }









// not used anywhere yet
export const z_animation = z.union([
	z.object({
		type: z.literal("framer-motion"),
		attrs: z.array(z.object({
			key: z.string(),
			value: z.string(),
		}))
	}),
	z.object({
		type: z.literal("std-lib"),
		name: z.string(),
	})
]);

export type T_ANIMATION = z.infer<typeof z_animation>;