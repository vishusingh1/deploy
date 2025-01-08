import { t_sort } from "@/broken-types/broken-data-api/query";
import { T_QUERY_PARAMS, T_QUERY_PARAMS_LEVEL_2 } from "@/broken-types/fe-query/query";
import AS from "@/gfn/AS";
import { generate_query_id } from "@/utils/draft";
import { useEffect, useState } from "react";


const add_sorts_to_current = (query: T_QUERY_PARAMS, sorts: t_sort[]): T_QUERY_PARAMS => {

	if(query?.type !== "QP_LEVEL2") return query;
	query.sorts = [...sorts];
	return query;

}

const apply_sorts = (mid: string, cid: string,  idx: number, sorts: t_sort[]) => {
	
	// const curr_query = AS.GSTORE.get_query(mid, cid) || {
	// 	type: "QP_LEVEL2",
	// 	qid: generate_query_id(cid, idx),
	// 	filters : {},
	// 	limit : 16
	// };
	// const new_query = add_sorts_to_current(curr_query,sorts);
	
	// console.log("EMITTING SORTS : ", new_query);
	// AS.GSTORE.remove_cached_list(mid, new_query.qid);
	// console.log("getting cached list : ", AS.GSTORE.get_cached_list(mid, new_query.qid));

	// AS.GSTORE.emit_filter({
	// 	type	: 	"QUERY_PARAMS_EVENT",
	// 	qid 	: 	cid,
	// 	data 	: 	new_query,
	// 	mid 	: 	mid,
	// 	name 	: 	"changed",
	// });
	
}



export const SortComponent = (props: { mid: string, cid: string, idx: number }) => {

	const model = AS.APP.models.find(m => m.id === props.mid);
	if (!model) return <div></div>;

	const model_props = model.props;
	const [sorts, setSorts] = useState<t_sort[]>([{id: "", attr: '', order: 'ASC' }]);

	const handleAddSort = () => {
		setSorts([...sorts, {id:"", attr: '', order: 'ASC' }]);
	};

	const handleAttributeChange = (index, value) => {
		const newSorts = [...sorts];
		newSorts[index].attr = value;
		setSorts(newSorts);
	};

	const handleOrderChange = (index, value) => {
		const newSorts = [...sorts];
		newSorts[index].order = value;
		setSorts(newSorts);
	};

	const handleRemoveSort = (index) => {
		const newSorts = [...sorts];
		newSorts.splice(index, 1);
		setSorts(newSorts);
	};


	useEffect(() =>{
		if(!sorts) return;
		apply_sorts(props.mid, props.cid, props.idx, sorts);
	}, [sorts])

	return (
		<div className="space-y-4">
			{sorts.map((sort, index) => (
				<div key={index} className="flex items-center space-x-2">
					<select
						value={sort.attr}
						onChange={(e) => handleAttributeChange(index, e.target.value)}
						className="px-3 py-2 border rounded-md outline-none focus:border-blue-500"
					>
						<option value="">Select Attribute</option>
						{model.props.map(p => {
							if (p.is_relation) return;
							return <option value={p.name}>{p.name}</option>
						})}

						{/* Add more options as needed */}
					</select>
					<select
						value={sort.order}
						onChange={(e) => handleOrderChange(index, e.target.value)}
						className="px-3 py-2 border rounded-md outline-none focus:border-blue-500"
					>
						<option value="ASC">Ascending</option>
						<option value="DESC">Descending</option>
					</select>
					<button
						onClick={() => handleRemoveSort(index)}
						className="px-3 py-2 text-red-500 hover:text-red-700 focus:outline-none"
					>
						Remove
					</button>
				</div>
			))}
			<button
				onClick={handleAddSort}
				className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none"
			>
				Add Sort
			</button>
		</div>
	);
};