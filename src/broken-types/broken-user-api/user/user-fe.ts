import {z} from "zod"
import { z_user, z_user_with_email, z_user_with_mobile } from "./user-internals";

export const z_dev_user = z_user
export type T_DEV_USER_TYPE = z.infer<typeof z_dev_user>;