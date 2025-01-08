import { fetch_get } from "@/stdlib/Fetch";

export const fetch_file_url = async(url: string) =>{
    const res = await fetch_get(url);
    if(!res) return null;
    if(!res.success) return null;
    if(!res.data || !res.data.length) return null;
    const download_url =  res.data[0].url;
    return download_url;
}