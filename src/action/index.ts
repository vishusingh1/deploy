import { G_TYPE } from "../broken-types/g_type";
import std from "./std";

const init = async (G: G_TYPE)=>{
    if(!G){
        console.warn("Global object is not passed to init function");
        return;
    }
    console.log("INIT MODULE ACTION: ");

    
    // do other things
    G.actions = G.actions || [];


    std.init(G);


    // add action to broken global 
    G.actions.push({
        event:{
            name: "onClick",
            type: "click",
        },

        type: "seq",
        fns: [
            {
                name: "Add",
                description: "Add two numbers",
                code: "return a + b;",
                icon: "",
                async: false,
                // function: (a: number, b: number)=>{
                //     return a + b;
                // },
                arguments: {
                    a: {
                        type: "number",
                        description: "First number"

                    },
                    b: {
                        type: "number",
                        description: "Second number"
                    }
                },
                returns:{
                    type: "number",
                    description: "Sum of two numbers"
                }
            }
        ],
        config: {
            preventDefault: false,
            stopPropagation: false,
            preventDefaultOnClick: false
        },
        scope: {
            type: "ui"
        }
    })
}
export default {
    init
}
