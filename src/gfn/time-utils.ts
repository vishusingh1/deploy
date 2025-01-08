

export const get_valid_date = function (date) {
    // '1970-01-01'
    if (!date) return undefined;

    const d = new Date(date);
    if(String(d) === "Invalid Date") return undefined;

    return d.toISOString().split('T')[0]; // @todo: this will have timezone offset, remove it
}


export const get_valid_time = function (time) {
    // '12:00'
    if (!time) return undefined;

    // check if it's valid time
    // const d = new Date(`1970-01-01T${time}`);
    // if(String(d) === "Invalid Date") return undefined;

    // return d.toLocaleTimeString();
    return time;
}

function formatDateToInputValue(date) {
    const pad = (num) => (num < 10 ? '0' + num : num);
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1); // Months are zero-based
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

export const get_valid_datetime = function (datetime) {

    // 1637837738783
    if (!datetime) return undefined;

    const d = new Date(datetime);
    if(String(d) === "Invalid Date") return undefined;

    //datetime-local input vlaue should be in this format 'YYYY-MM-DDTHH:MM'
    return formatDateToInputValue(d);;
}