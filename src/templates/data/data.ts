import SELECTABLE from "@/data/selectable";



const data = {
    // a: new SELECTABLE([{id: 1, name: 'A'}, {id: 2, name: 'B'}, {id: 3, name: 'C', children: [{id: 4, name: 'D'}, {id: 5, name: 'E'}]}]),
    
    // =======
    // b@data
    // data will get inserted here
    // -------


    
    // general function to check if V is selected
    // Please don't use these functions. They aren't optimized for performance
    // use data.abc.is_selected(V) instead
    is_selected: function(V: any){
        for(let [k, v] of Object.entries(this)){
            if(v instanceof SELECTABLE){
                if(v.is_selected(V)) return true;
            }
        }
        return false;
    },

    select: function(params: {V: any, idx: number}){
        for(let [k, v] of Object.entries(this)){
            if(v instanceof SELECTABLE){
                v.select(params);
            }
        }
    },

    selected: function(){
        for(let [k, v] of Object.entries(this)){
            if(v instanceof SELECTABLE){
                return v.is_selected({V:v});
            }
        }
    }
};

export default data;