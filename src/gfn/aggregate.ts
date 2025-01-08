import { t_filters_v2 } from "@/broken-types/broken-data-api/query";
import { GC } from "../global_state";
import { get_model } from "./models";
import { get_token, get_user_token_api } from "./user";
import { feedback } from "./utils";
import { OBJECT_TYPE } from "@/broken-types/default_res";
import { t_aggregate } from "@/broken-types/broken-data-api/aggregate";

export const get_aggregate = async (params: {
    model_id: string, 
    group_by?: string, 
    filters? : t_filters_v2,
    aggregates: {
        sum?: string[],
        distinct_values?: string[],
        count_distinct?: string[], // distinct count of  property values
        count?: string[] // count of all the data
    }
} ) => {

    const uat = get_user_token_api();
    if(!uat.success) {
        console.warn('User token not found');
        return uat;
    }

    const {user, api, token} = uat.data;

    const {model_id, group_by, filters, aggregates} = params;


    // props_for_aggr => { sum_age: {sum: "age"}, sum_assets: {sum: "assets"}, count_distinct_assets: {count_distinct: "assets"} }

    const props_for_aggr:OBJECT_TYPE<any> = {};

    for(let key in aggregates){
         
        if(aggregates[key]){
            // aggregates[key] :  sum, values : ["age", "assets"]
            for(let prop of aggregates[key]){
                const k = key + "--" + prop;
                props_for_aggr[k] = {
                    [key] : prop
                }
            }
        }
    }

    const aggr: t_aggregate = {
        query: {
            filters: filters,
            group_by: {
                __id: group_by,
                props: props_for_aggr
            }
        }
    }
    const r = await api.entity.aggregate({ model_id, token, aggregare_query:aggr });
    if(!r.success) return r;
    // r => {success: true, data: {"sum_age: [ {__id: "", sum:""}, {__id: "", sum:""},  ]"}}

    // parse the response
    const data = r.data;
    const results: any = {};
    for(let k in data){
        const aggr = k.split("--")[0];
        const prop = k.split("--")[1];

        if(!results[aggr]) results[aggr] = {};
        if(!results[aggr][prop]) results[aggr][prop] = data[k];
    }

    // results => {sum : {age: [{__id: "", sum:""}]  }, count_distinct : [{__id: "", sum:""}] }
    return {success: true, data: results};
}

// group by prop, get count of distinct values
export const get_distinct_count  = async (model_id: string, prop: string | "id",  group_by?: string) => {


    const a = await get_aggregate({
        model_id,
        group_by,
        aggregates: {
            "count_distinct" : [prop]
        }
    })

    return a;
} 


// group by prop, get count of distinct values
export const get_count  = async (model_id: string, prop: string | "id",  group_by?: string) => {


    const a = await get_aggregate({
        model_id,
        group_by,
        aggregates: {
            "count" : [prop]
        }
    })

    return a;

    // { count_p1: [{__id: "hyderabad", count: 20}, {__id: "delhi", count: 40}, ], sum_p1: [{__id: "hyderabad", sum: 20}, {__id: "delhi", sum: 40}, ], count_p2: [{__id: "hyderabad", count: 20}, {__id: "delhi", count: 40}, ], sum_p2: [{__id: "hyderabad", sum: 20}, {__id: "delhi", sum: 40}, ] }



} 

// get sum of a prop group by another prop
export const get_sum = async(model_id: string,  prop: string, group_by?: string) => {
    
    const a = await get_aggregate({
        model_id,
        group_by,
        aggregates: {
            "sum" : [prop]
        }
    })

    return a;
}

// get distinct values 
export const get_distinct_values = async (model_id: string, prop: string, group_by?: string) => {
    const a = await get_aggregate({
        model_id,
        group_by,
        aggregates: {
            "distinct_values" : [prop]
        }
    })

    return a;
}