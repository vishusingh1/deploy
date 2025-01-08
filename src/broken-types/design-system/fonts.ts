import { z } from 'zod';


export const z_font = z.object({
    id:z.string(),
    name:z.string(),
    weights:z.array(z.string()),
    src:z.string(),
    url:z.string()
})

export const z_fonts = z.object({
    applied:z.array(z_font),
    body_font:z_font,
    display_font:z_font
})


export type T_FONTS = z.infer<typeof z_fonts>;

export type T_FONT = z.infer<typeof z_font>;