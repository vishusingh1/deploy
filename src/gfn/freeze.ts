import { GET_MANY_RESULT, OBJ_WITH_ID } from "@/broken-types/g_type";
import AS from "./AS";
import { T_INFO } from "@/broken-types/comp";
import { generate_query_id } from "@/utils/draft";


// when we freeze data. We will not query db
// But this has to set in the GSTORE just as we save data after querying from db to have the same consitency everywhere
// When we freeze GET_MANY the GET_ONE data has to be stored in GSTORE as well

export const freeze_many = (INFO: T_INFO, M: OBJ_WITH_ID[]) => {
    if(!M || !Array.isArray(M)) return;

    const qid = generate_query_id(INFO.cid, INFO.cidx);
    const Q = INFO.query || {
        type: "QP_LEVEL2",
        qid: qid,
        limit: 16,
        sorts: []
    }
    const GMS: GET_MANY_RESULT = {
        params: Q,
        queried_at: Date.now(),
        data: M
    }
    AS.GSTORE.set_many(INFO.mid, Q, GMS, ["freeze_many"]);
}

export const freeze_one = (INFO: T_INFO, M: OBJ_WITH_ID) => {
    if(!M || !M.id) return;

    // AS.GSTORE.set(INFO.mid, M.id, M, ["freeze_one"]);
    AS.GSTORE.set(INFO.mid, M.id, M);
}