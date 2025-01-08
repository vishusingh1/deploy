import GFN from "@/GFN";
import { OBJ_WITH_ID } from "@/broken-types/g_type";
import {makeAutoObservable, observable, action, toJS} from "mobx"
class SELECTABLE {
    items: any[] = [];
    selected: any = {}; // {"": 1}, {"children": 4}

    constructor(items: any[]) {
        this.items = items;

        makeAutoObservable(this, {
            items: observable,
            selected: observable,
            select: action,
        });

        this.select_default({parent: this.items, path: [], depth: 0});
    }

    select_default(params: {parent: any, path: (string | number)[], depth?: number}) {
        let {parent, path, depth} = params;
        if (!parent) return;

        if(!depth) depth = 0; if(depth > 25) return; // prevent infinite loop

        if(typeof(parent) !== "object") return;


        // select the first item
        if(Array.isArray(parent) && parent.length){
            const first = parent[0];
            const ps = path.join(".");
            this.selected[ps] = first;
        }



        if(Array.isArray(parent)){
            for(let i=0; i<parent.length; i++){
                this.select_default({parent: parent[i], path: [...path, i], depth: depth+1});
            }
        }
        else if(typeof(parent) === "object"){
            for(let key in parent){
                if(parent.hasOwnProperty(key)){
                    this.select_default({parent: parent[key], path: [...path, key], depth: depth+1});
                }
            }
        }

    }

    find(params: {V: OBJ_WITH_ID, parent: any, path: (string | number)[], depth?: number}): {path: (string | number)[], parent: any}|undefined {
        let {V, parent, path, depth} = params;
        if (!V || !parent) return;

        if(!depth) depth = 0; if(depth > 25) return; // prevent infinite loop

        if(V === parent) return {path, parent};

        // If the parent is an object or an array, continue searching
        if (typeof(parent) === "object") {
            if (Array.isArray(parent)) {
                // Handle array elements by iterating through indices
                for (let i = 0; i < parent.length; i++) {
                    const result = this.find({V, parent: parent[i], path: [...path, i], depth: depth+1});
                    if (result) return result;
                }
            } else {
                // Handle object keys
                for (const key in parent) {
                    if (parent.hasOwnProperty(key)) {
                        const result = this.find({V, parent: parent[key], path: [...path, key], depth: depth+1});
                        if (result) return result;
                    }
                }
            }
        }
    }

    select(params: {V: any, idx: number, D?: any[]}) {
        const {V, idx, D} = params;
        if (!V) return;

        
        
        // find V in items
        const r = this.find({V, parent: this.items, path:[]});
        // console.log("BEFORE SELECTING : ", V.name, idx, path, item, toJS(this.items));
        if(!r) return;
        const {path, parent} = r;
        
        path.pop(); // get parent path
        const ps = path.join(".");
        console.log("SELECTING : ", toJS(V));
        this.selected[ps] = (V || idx);
    }

    select_add(params: {V: any, idx: number, D?: any[]}) {}
    select_remove(params: {V: any, idx: number, D?: any[]}) {}

    select_toggle(params: {V: any, idx: number, D?: any[]}) {
        const {V, idx, D} = params;
        if (!V) return;

        // find V in items
        const r = this.find({V, parent: this.items, path:[]});
        if(!r) return;
        const {path, parent} = r;

        path.pop(); // get parent path
        const ps = path.join(".");
        if(this.selected[ps] === (V || idx)){
            this.selected[ps] = undefined;
        }
        else{
            this.selected[ps] = (V || idx);
        }
    }

    select_next(params: {V: any, idx: number, D?: any[]}) {
        const {V, idx, D} = params;
        if (!V) return;

        // find V in items
        const r = this.find({V, parent: this.items, path: []}); // this is the address if the items array
        if(!r) return;
        const {path, parent} = r;
        // const parent = GFN.GET(this.items, path.map(String)); // @note: array["1"] same as array[1], that's why it works 

        if(!Array.isArray(parent)) return;

        const pos = parent.findIndex(e=>e === V);
        if(pos === -1) return;
        if(pos === parent.length-1) return;

        const next = parent[pos+1];
        this.select({V: next, idx: pos+1});
    }

    select_prev(params: {V: any, idx: number, D?: any[]}) {
        const {V, idx, D} = params;
        if (!V) return;

        // find V in items
        const r = this.find({V, parent: this.items, path: []}); // this is the address if the items array
        if(!r) return;
        const {path, parent} = r;

        // const parent = GFN.GET(this.items, path.map(String)); // @note: array["1"] same as array[1], that's why it works

        if(!Array.isArray(parent)) return;
        
        const pos = parent.findIndex(e=>e === V);
        if(pos === -1) return;
        if(pos === 0) return;

        const prev = parent[pos-1];
        this.select({V: prev, idx:pos-1});
    }

    is_selected(params: {V: any, idx?: number, D?: any[]}) {
        const {V, idx, D} = params;
        if (!V) return;

        // find V in items
        const r = this.find({V, parent: this.items, path: []});
        if(!r) return;
        const {path, parent} = r;

        path.pop(); // get parent path
        const ps = path.join(".");
        return this.selected[ps] === (V || idx);
    }

    query(params: {V: any, idx: number, D: any[], pre: string}) {
        if (!params.V) return;

        // class prefix
        if(params.pre === "b-sel"){
            return this.is_selected(params);
        }
    }
}

export default SELECTABLE;