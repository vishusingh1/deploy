import { get_model } from "./models";
import { feedback, get_ulid } from "./utils";

import GFN from "../GFN";
import {GC} from "../global_state";
import { get_user } from "./user";
import { create_many } from "./create";
import { get_many } from "./get";
import { T_QUERY_PARAMS } from "../broken-types/fe-query/query";

export const upload_csv_data = function (e, model_id) {
    const file = e.target.files[0];
    if (!file) return;

    if (!model_id) return console.warn('model_id not found for uploading csv');
    
    const model = get_model(model_id);
    const upload_data:any[] = [];

    if(!model) return console.warn('Model not found for uploading csv');

    const reader = new FileReader();
    reader.onload = async (ev) => {
        const text = ev.target?.result;

        // check if string or ArrayBuffer
        if (typeof text !== 'string') return console.warn('text is not string');

        const rows = text.split('\n');
        const header = rows[0].split(',');
        const data = rows.slice(1).map((r) => r.split(','));

        data.forEach((d) => {
            const obj:any = {};
            d.forEach((v, i) => {
                // the cases of file/image are handled in prepare_data_for_create
                obj[header[i]] = v;
            });
            upload_data.push(obj);
        });

        // add id, created_by, updated_by, created_at, updated_at if not exists
        upload_data.forEach((d) => {
            if (!d.id) d.id = get_ulid();

            const now = Date.now();
            if (!d.created_at) d.created_at = now;
            if (!d.updated_at) d.updated_at = now;

            const user = get_user();
            if(!user) return console.warn("User not found", "error");
            if (!d.created_by) d.created_by = user.profile?.id;
            if (!d.updated_by) d.updated_by = user.profile?.id;
        });
        console.log('upload_data : ', upload_data);

        const res = await create_many(model.id, upload_data);

        if (!res || !res.success) return;

        // on success
        feedback('Uploaded Successfully', "success");
        // clear the input
        e.target.value = null;
    };
    reader.readAsText(file);
}

export const download_csv_data = async function (model_id) {
    if (!model_id) return console.warn('model_id not found for downloading csv');
    const app_id = GC.APP_ID;
    const model = get_model(model_id);
    if (!model) return console.warn('Model not found for downloading csv');


    const query: T_QUERY_PARAMS = { type: "QP_LEVEL2", sorts: [], qid: "", limit: 5000};
    const r = await GFN.get_many(model_id, query); // limit is set to be max 50 in backend
    if (!r || !r.success) return feedback('Getting data failure', "error");

    const data = r.data;


    // convert json into csv
    const header:string[] = [];
    const rows:string[] = [];

    const prop_types_mapping = {};
    model.props.forEach((p:any) => {
        prop_types_mapping[p.name] = p.type;
        header.push(p.name);
    });

    data.forEach((d) => {
        const row:any = [];
        header.forEach((h) => {
            // created_by, updated_by, created_at, updated_at are not shown in csv
            if (['created_by', 'updated_by', 'created_at', 'updated_at'].includes(h)) return;
            const prop_type = prop_types_mapping[h];
            if (!prop_type) return;
            if (prop_type === 'file' || prop_type === 'image') {
                // modify the structure assuming a link is given
                row.push(d[h]?.url);
            }
            else {
                row.push(d[h]);
            }
        });
        rows.push(row);
    });

    // @ts-ignore
    const csv = [header, ...rows].map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `${model.name}.csv`);

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}