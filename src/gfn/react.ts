import { get_attr_from_event } from "./events";
import { feedback } from "./utils";

export const toggle_state = function (e, REACT_STATES) {
    if (!REACT_STATES || !Object.keys(REACT_STATES)) return feedback("Can't toggle state: REACT_STATES not found", "error");
    const state_name = get_attr_from_event(e, ['state', 'state-name']);
    if (!state_name) return feedback("Can't toggle state: state name not found", "error");
    const S = REACT_STATES[state_name];
    if (!S) return feedback("Can't toggle state: state not found", "error");
    if (!S.set_state || typeof (S.set_state) !== "function") return feedback(`Can't toggle state: set_state not found: ${JSON.stringify(S)}`, "error");
    S.set_state(s=>!s);
}

export const set_state = function (e, REACT_STATES) {
    if (!REACT_STATES || !Object.keys(REACT_STATES)) return feedback("Can't set state: REACT_STATES not found", "error");
    const state_name = get_attr_from_event(e, ['state', 'state-name']);
    if (!state_name) return feedback("Can't set state: state name not found", "error");
    const S = REACT_STATES[state_name];
    if (!S) return feedback("Can't set state: state not found", "error");
    if (!S.set_state || typeof (S.set_state) !== "function") return feedback(`Can't set state: set_state not found: ${JSON.stringify(S)}`, "error");
    const value = get_attr_from_event(e, ['state-value', 'value']);
    if (value === undefined) return feedback("Can't set state: value not found", "error");
    S.set_state(value);
}