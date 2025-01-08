import datascript from "./api/datascript";
import entity from "./api/entity";
import sql from "./api/sql";
import file from "./api/files/file";
import image from "./api/files/image";
import v2 from "./auth/login-token";
import utils from "./utils";
import sstate from "./api/server-state";
import user from "./api/user";
import relations from "./api/relations";



export default {
    // init,
    api: {
        entity,
        datascript,
        file,
        image,
        sstate,
        user,
        relations
    },
    auth: v2,
    utils: utils,
};

