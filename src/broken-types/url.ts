import { z } from 'zod';

export const z_url_eids = z.array(z.object({
    mid: z.string(),
    eids: z.array(z.string()),
    cid: z.string().optional(),
}));

export const z_url_qs = z.array(z.object({
    mid: z.string(),
    q: z.any(),
    cid: z.string().optional(),
}));

export type T_URL_IDS = z.infer<typeof z_url_eids>;
export type T_URL_QS = z.infer<typeof z_url_qs>;