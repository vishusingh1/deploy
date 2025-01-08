type T_ERR_WARNS = {errors: {code: string, messages: string[]}[], warnings: {code: string, messages: string[]}[]}
const LIBRARY: {[fn:string]: Function} = {
    "email": (value: string):T_ERR_WARNS|undefined => {
        const m = /^[a-zA-Z0-9]$/.test(value);
        if(m) return;

        const r: T_ERR_WARNS = {errors: [], warnings: []};
        r.errors.push({code: "INVALID_EMAIL", messages: ["Invalid email address"]});
        return r;
    }
}

class Comparator {
    attr: string = ""
    op: string = ""
    val: any = ""
}

export class Validation {
    fns: string[] = []
    comparators: Comparator[] = []


    constructor(json: any){

    }

    validate(value: any){
        const errors = [];
        const warnings = [];
        if(this.comparators.length){
            // return {errors: [{code: "INVALID_EMAIL", messages: ["Invalid email address"]}], warnings: []};
            // push to errors and warnings
        }

        for(let fn of this.fns){
            const callable = LIBRARY[fn](value);
            if(callable){
                const r = callable(value);
                // if(r){
                //     errors.push(...r.errors);
                //     warnings.push(...r.warnings);
                // }
            }
        }


    }
}




