// draft id is uniuqe for each model-id + component + idx 
// because mid is already part of each draft store we don't need to include it in the draft id
export const generate_draft_id = (cid: string, idx?: number) => "d:" + cid + (idx || 0);


export const generate_query_id = (cid: string, idx?: number) => "q:" + cid + (idx || 0);