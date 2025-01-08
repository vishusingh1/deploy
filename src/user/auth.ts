import { DEFAULT_RES_SINGLE } from "../broken-types/default_res";
import { OBJ_WITH_ID } from "../broken-types/g_type";
import { GC } from "../global_state";
import { BROKEN_USER } from "./user";
const authz = {
    get_user_role: function(user: BROKEN_USER): DEFAULT_RES_SINGLE<string>{

        const roles = GC.APP_JSON.roles;
        if(!roles) return {
            success: false,
            errors: ["App should have atleast one role"]
        }

        if( user.role === "creator") {
            return {
                success:true,
                data:user.role
            }
        }

        const user_role = roles.find((r) => r === user.role);
        if (!user_role) return {
            success:false,
            errors: ["user role is not there in the app roles"]
        };
        return {
            success:true,
            data:user_role
        };
    },
    create: function (mid:string, data:OBJ_WITH_ID|OBJ_WITH_ID[], user:BROKEN_USER): DEFAULT_RES_SINGLE<{allowed: boolean, role: string}> {
        let r = this.get_user_role(user);
        if(!r.success) {
            return {
                success:false,
                errors: r.errors
            }
        }

        const role = r.data;
        if( role === "creator") {
            return {
                success: true,
                data: {
                    allowed:true,
                    role:"creator"
                }
            }
        }


        const app_level_auth = GC.APP_JSON.authz.app.role[role];
        const app_level_create = app_level_auth.find((r) => r === "create");
        const model_level_auth = GC.APP_JSON.authz.models[mid]?.role[role];
        const model_level_create = model_level_auth ? model_level_auth.find((r) => r === "create") : false;

        let permission = false;
        if (app_level_create || model_level_create) permission = true;
        if(!permission){
            return {
                success: false,
                errors: [`user with ${role} role not allowed to create data`]
            }
        }
        return {
            success: true,
            data: {
                allowed: true,
                role: role
            }
        }
    },
    get: function (model_id, user): DEFAULT_RES_SINGLE<{allowed: boolean, role: string}> {
        let r = this.get_user_role(user);
        if(!r.success) {
            return {success: false, errors: r.errors}
        }
        
        const role = r.data;

        if( role === "creator") {
            return {
                success: true,
                data: {
                    allowed:true,
                    role:"creator"
                }
            }
        }
        

        const app_level_auth = GC.APP_JSON.authz.app.role[role];
        const app_level_read = app_level_auth.find((r) => r === "read")
        const model_level_auth = GC.APP_JSON.authz.models[model_id]?.role[role];
        const model_level_read = model_level_auth ? model_level_auth.find((r) => r === "read") : false;

        let permission = false;
        if (app_level_read || model_level_read) permission = true;
        if(!permission) {
            return {
                success: false,
                errors: [`user with ${role} role not allowed to read data`]
            }
        } 
        
        
        return {
            success: true,
            data: {
                allowed: true,
                role: role
            }
        }
    },

    // @todo: implement update with T_UPDATE type
    update: function (model_id, data, user): DEFAULT_RES_SINGLE<{allowed: boolean, role: string}> {
        let r = this.get_user_role(user);
        if(!r.success) {
            return {
                success:false,
                errors: r.errors
            }
        }

        const role = r.data;

        if(role === "creator") {
            return {
                success:true,
                data: {
                    allowed:true,
                    role:"creator"
                }
            }
        } 



        const app_level_auth = GC.APP_JSON.authz.app.role[role];
        const app_level_update = app_level_auth.find((r) => r === "update")
        const model_level_auth = GC.APP_JSON.authz.models[model_id]?.role[role];
        const model_level_update = model_level_auth ? model_level_auth.find((r) => r === "update") : false;

        let permission = false;
        if (app_level_update || model_level_update) permission = true;

        if(!permission) {
            return {
                success: false,
                errors: [`user with ${role} role not allowed to update data`]
            }
        } 
        return {
            success: true,
            data: {
                allowed: true,
                role: role
            }
        }
    },
    delete: function (model_id, user): DEFAULT_RES_SINGLE<{allowed: boolean, role: string}> {
        let r = this.get_user_role(user);
        if(!r.success) {
            return {
                success:false,
                errors: r.errors
            }
        }

        const role = r.data;

        if( role === "creator") {
            return {
                success: true,
                data: {
                    allowed:true,
                    role:"creator"
                }
            }
        }



        const app_level_auth = GC.APP_JSON.authz.app.role[role];
        const app_level_delete = app_level_auth.find((r) => r === "delete");
        const model_level_auth = GC.APP_JSON.authz.models[model_id]?.role[role];
        const model_level_delete = model_level_auth ? model_level_auth.find((r) => r === "delete") : false;

        let permission = false;
        if (app_level_delete || model_level_delete) permission = true;
        if(!permission) {
            return {
                success: false,
                errors: [`user with ${role} role not allowed to delete data`]
            }
        } 
        
        return {
            success: true,
            data: {
                allowed: true,
                role: role
            }
        }
    },
}
export default authz;