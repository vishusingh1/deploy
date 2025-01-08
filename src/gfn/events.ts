export const get_attr_from_event = (e:any, any_of: string[], required?: boolean) => {
    const el = e.currentTarget;
    let value:any = null;
    for (let n of any_of) {
        value = el?.getAttribute(n); // if the elment is removed from DOM during action the element doesn't exists anymore
        if (value) return value;
    }

    if (!value && required) {
        console.warn(
            `@b_code_error: any_of ${any_of.join(', ')} is not present in el`,
            el
        );
    }
};

export const is_event_in_editing_mode = function (e) {
    const el = e.target;
    const nn = el.nodeName;
    if (nn === 'BODY') return false;

    const tags = ['INPUT', 'TEXTAREA', 'SELECT'];
    if (tags.includes(nn)) return true;

    if (el.contentEditable === 'true') return true;

    return false;
};