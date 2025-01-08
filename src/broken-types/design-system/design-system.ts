import { z } from 'zod';

export const z_shades = z.object({
	'50': z.string(),
	'100': z.string(),		
	'200': z.string(),
	'300': z.string(),
	'400': z.string(),
	'500': z.string(),
	'600': z.string(),
	'700': z.string(),
	'800': z.string(),
	'900': z.string()
})

export const z_color = z.object({
	base: z.string(),
	shades: z_shades
});

export const z_design_system_colors = z.object({
	primary: z_color,
	secondary: z_color,
	tertiary: z_color,
	neutral: z_color,
	success: z_color,
	info: z_color,
	warning: z_color,
	error: z_color,
});


export const z_design_system_text_sizes = z.object({
	base: z.number().default(1), // rem 1rem = 16px
	scale: z.number().default(1.25), // golden ratio 1.618
});

export const z_design_system = z.object({
	colors: z_design_system_colors,

	fonts: z.object({
		display: z.string(),
		body: z.string(),
	}).optional(),

	text_sizes: z_design_system_text_sizes.optional(),

	spacing: z.object({}).optional(),

	border_radius: z.object({}).optional(),
});






// scale factors
// 1.067 => minor second
// 1.125 => major second
// 1.200 => minor third
// 1.250 => major third
// 1.333 => perfect fourth
// 1.414 => augmented fourth
// 1.500 => perfect fifth
// 1.600 => golden ratio
// custom => 1.618


export type T_DESIGN_SYSTEM = z.infer<typeof z_design_system>;

export type T_DESIGN_SYSTEM_COLORS = z.infer<typeof z_design_system_colors>;

export type T_DESIGN_SYSTEM_TEXT_SIZES = z.infer<typeof z_design_system_text_sizes>;

export type T_COLOR = z.infer<typeof z_color>;

export type T_SHADES = z.infer<typeof z_shades>;