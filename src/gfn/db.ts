import AS from './AS';

export const inc_tx = function (type, model_id, entity_ids, prop_names, data) {
    AS.db.count++;
    const new_tx = {
        type,
        count: AS.db.count,
        model_id,
        entity_ids,
        prop_names,
        data,
    }
    AS.db.tx.next(new_tx);
}