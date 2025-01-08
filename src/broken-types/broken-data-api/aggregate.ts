import { z} from "zod"
import { z_filters_v2 } from "./query"


const allowed_aggregates = ["sum", "avg", "min", "max", "count", "count_distinct", "sum_distinct", "avg_distinct"]
const sum_aggregate = z.object({"sum" : z.string()})

const avg_aggregate = z.object({"avg" : z.string()})

const min_aggregate = z.object({"min" : z.string()})

const max_aggregate = z.object({"max" : z.string()})

const count_aggregate = z.object({"count" : z.string()})

const count_distinct_aggregate = z.object({"count_distinct" : z.string()})  

const sum_distinct_aggregate = z.object({"sum_distinct" : z.string()})

const avg_distinct_aggregate = z.object({"avg_distinct" : z.string()})

const distinct_values = z.object({"distinct_values" : z.string()})


const z_aggr = z.union([sum_aggregate, avg_aggregate, min_aggregate, max_aggregate, count_aggregate, count_distinct_aggregate, sum_distinct_aggregate, avg_distinct_aggregate, distinct_values])




const z_group_by = z.object({__id: z.string().optional(), props: z.record(z_aggr)})


const z_aggregate = z.object({
    app_id      :   z.string().optional(), 
    token       :   z.string().optional(),
    apikey      :   z.string().optional(),

    query       :   z.object({
      model_id    :   z.string().optional(),
      filters     :   z_filters_v2.optional(),
      group_by    :   z_group_by,
      having      :   z_filters_v2.optional(),
    })
})


export type t_aggregate        =   z.infer<typeof z_aggregate>
export type t_aggregate_query  =   t_aggregate["query"]

export { z_aggregate}