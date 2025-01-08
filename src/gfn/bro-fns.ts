import { get_attr_from_event } from "./events";
import { feedback } from "./utils";

export const bro_alert = function (e: any, msg?: string) {
    if(!msg) return feedback("Can't alert: msg not found", "error");
    alert(msg);
}

export const bro_toast = function (e: any, msg?: string) {
    if(!msg) return feedback("Can't toast: msg not found", "error");
    
    feedback(msg, "log");
}

export const bro_formula = function (e, state) {
    const formula = get_attr_from_event(e, ['formula']);
    if (!formula) return feedback("Can't calculate: formula not found", "error");

    const evalWithVariables = (func, vars) => {
        return new Function('v', 'with (v) { return (' + func + ')}')(vars);
    };

    const res = evalWithVariables(formula, state);
    feedback(`The value is ${res}`, "log");
}

export const bro_accordion = function (e) {
    const current_el = e.currentTarget;

    const sibling_el = current_el.nextElementSibling;
    if (!sibling_el) return feedback("Can't find sibling element", "error");

    // if open, close. if closed, open
    sibling_el.classList.toggle('collapse');
}

export const bro_dropdown = function (e) {
    const sel_el = e.currentTarget;
    const val = sel_el.value;
    sel_el.setAttribute('chosen_value', val);
}
export const bro_print = function (e) {
    const sel_el_sibling_el = e.currentTarget?.previousElementSibling;
    const old_doc_val = document.body.innerHTML;
    document.body.innerHTML = sel_el_sibling_el.innerHTML;
    window.print();
    document.body.innerHTML = old_doc_val;
}


export const bro_run_custom_action = function (e, M, INFO) {
    const code = e.currentTarget?.getAttribute('code');

    try {
        eval(code);
    } catch (e) {
        console.warn('ERROR WHILE EVALUATING CUSTOM ACTION : ', e);
        feedback('error while evaluating custom action', 'error');
    }
}