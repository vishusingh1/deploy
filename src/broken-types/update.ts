import {z} from "zod";

export const z_update_operations = z.object({
    type: z.literal("OPERATIONS"),
    id: z.union([z.string(), z.number()]),
    add: z.record(z.any()),
    delete: z.record(z.any()),
    set: z.record(z.any())
});

export type T_UPDATE_OPERATIONS = z.infer<typeof z_update_operations>;

export const z_update_patches = z.object({
    type: z.literal("PATCHES"),
    id: z.union([z.string(), z.number()]),
    patches: z.array(z.object({
        value: z.any(),
        op: z.union([z.literal("add"), z.literal("replace"), z.literal("remove")]),
        path: z.string(),
    }))
});

export type T_UPDATE_PATCHES = z.infer<typeof z_update_patches>;

export const z_update_by_data = z.object({
    type: z.literal("DATA"),
    id: z.union([z.string(), z.number()]),
    data: z.any(),
    prev: z.any(), // previous data
})

export const z_updates = z.union([
    z_update_operations,
    z_update_patches,
    z_update_by_data
]);
export type T_UPDATES = z.infer<typeof z_updates>;