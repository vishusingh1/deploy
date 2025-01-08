import { z } from 'zod';

export const z_figma_access_token = z.object({
    access_token: z.string(), //<TOKEN>
    expires_in: z.number(), //<EXPIRATION (in seconds)>,
    refresh_token: z.string(), //<REFRESH TOKEN>
});

export type t_figma_access_token = z.infer<typeof z_figma_access_token>;

export default {};