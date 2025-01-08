import AS from "../gfn/AS";
export const expose_state = (
    REACT_STATES: {[name: string]: {
        state: any,
        set_state: any,
        defaultValue?: any
    }},
    _AS: any, 
    INFO: any, 
    name: string, 
    state: any, 
    set_state: any, 
    defaultValue?: any
) => {

    REACT_STATES[name] = { state, set_state, defaultValue};

	// const AS_COMPONENTS = AS.components[INFO.comp_id] || {};
	// AS_COMPONENTS.REACT_STATES = REACT_STATES;
	// AS.components[INFO.comp_id] = AS_COMPONENTS;
}