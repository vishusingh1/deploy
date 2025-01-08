import { to_iso_string } from "./datetime";

export const get_formated_state = (state: any, prop: any) => {
    // e.g m_state.dob  => new Date(m_state.dob).toISOString()
    let v = state;

    if (prop.type === 'datetime') {
        v = to_iso_string(new Date(state)); //`\${GFN.to_iso_string(new Date(${state}))}`;
    } else if (prop.type === 'boolean') {
        v = state ? 'true' : 'false';
    } else if (prop.type === 'many_of') {
        if (Array.isArray(state)) {
            v = state.join(', ');
        }
    } else if (prop.type === 'image') {
        if (typeof state === 'string') {
            v = state;
        } else {
            v = URL.createObjectURL(state);
        }
    } else if (prop.type === 'file') {
        if (typeof state === 'string') {
            v = state;
        } else {
            v = URL.createObjectURL(state);
        }
    }

    return v;
};