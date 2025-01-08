import { BRO_ACTION_FN_T, BRO_ACTION_T } from "../broken-types/action";
import { G_TYPE } from "../broken-types/g_type";
import { BROKEN_ACTIONS } from "./default-actions";



const get_broken_action = (a:string) => {
	const def_act_val = BROKEN_ACTIONS[a];
	if(!def_act_val) return;
	let event_name = 'onClick';
	if(a.startsWith('oninput-')) event_name = 'onInput';
	else if(a.startsWith('ondrop-')) event_name = 'onDrop';

	let bro_action:BRO_ACTION_T = {
		event: {
			name:event_name,
			type:event_name
		},
		type: 'seq',
		fns: [
			{
				name:def_act_val.name || "",
				code: def_act_val.code || "",
				icon: def_act_val.icon || '',
				description:def_act_val.description || '',

				async: false,
				arguments: {},
				returns: {
					type: '',
					description: ''
				}

			}
		],
		config: {
			preventDefault: false,
			stopPropagation: false,
			preventDefaultOnClick: false
		},
		scope:{
			type: def_act_val.scope || 'ui'
		}
	};

	return bro_action
};

const init = (G: G_TYPE) => {
    if (!G) {
        console.warn("Global object is not passed to init function");
        return;
    }

    // add default actions to broken global
    for (let action_name of Object.keys(BROKEN_ACTIONS)) {
        let action = get_broken_action(action_name);
        if (!action) {
            console.warn(`Action ${action_name} not found in default actions`);
            continue;
        }

        G.actions.push(action);
    }

}

export default {
    init
}