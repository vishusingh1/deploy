export const get_nearest_size = (size) => {
    // Give nearest size in GB/MB/KB
    if (size >= 1000000000) return `${(size / 1000000000).toFixed(2)} GB`;
    if (size >= 1000000) return `${(size / 1000000).toFixed(2)} MB`;
    if (size >= 1000) return `${(size / 1000).toFixed(2)} KB`;
    return `${size} B`;
}

export const get_file_obj_from_string = (s: any) => {
    let obj = {
        name: 'name',
        url: 'url',
        size: '0 bytes',
        type: 'none',
    };

    try {
        const o = JSON.parse(s);

        if (o.name) obj.name = o.name;
        if (o.url) obj.url = o.url;
        if (o.size) obj.size = get_nearest_size(o.size);
        if (o.type) obj.type = o.type;
    } catch (error) {
        console.warn(`get_file_obj_from_string: ${JSON.stringify(error)}`);
    }

    return obj;
}


export const bro_download_file = async function (cf_src_url) {
    if (!cf_src_url) return {success: false, message: 'No URL provided'};

    const r = await fetch(cf_src_url);
    if (!r) return {success: false, message: 'Error fetching URL'};

    const p = await r.json();
    if (!p || !p.success) return {success: false, message: 'Error parsing JSON'};

    const data = p.data;
    if (!data || !Array.isArray(data) || !data[0] || !data[0].url) return {success: false, message: 'Error parsing JSON'};
    const url = p.data[0].url;

    window.open(url, '_blank');
    return {success: true};
}