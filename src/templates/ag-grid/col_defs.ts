import { model_prop_type } from "@/broken-types/app";
import { OBJECT_TYPE } from "@/broken-types/default_res";





export const get_column_defs = (prop: model_prop_type) => {

	const headerName  = prop.name.toLocaleUpperCase();
	const field       = prop.name;

	const columnDef : OBJECT_TYPE<any>  = {
		headerName: headerName,
		field: field,
	};

	let cell_renderer: any = undefined;

	if(prop.name === "name"){
		columnDef.pinned = "left";
	}

	if(prop.type === "url"){
		cell_renderer = function(params: any){
			return `<a href="${params.value}" target="_blank" className="text-blue-500 hover:underline">${params.value}</a>`;
		}
		columnDef.cellRenderer = cell_renderer;
	}
	if(prop.type === "image"){
		cell_renderer = function(params: any){

			const url = params.value?.url;
			const name = params.value?.name;
			return `<img src="${url}"  className="rounded-lg  object-cover w-full h-full" />`;
		}
		// columnDef.cellRendererFramework = ImageCellRenderer;
		columnDef.cellRenderer = cell_renderer;
	}
	if(prop.type === "file"){
		cell_renderer =  function(params: any){
			if(typeof params.value === "object"){
				const name 	= 	params.value?.name;
				const url 	= 	params.value?.url;
				return (
					`<a href=${url} target="_blank" rel="noopener noreferrer">
						${name}
					</a>`
				)

			}
            else{
                return (
                    `<div>Not Obejct</div>`
                );
            }
		}

		// columnDef.cellRendererFramework = FileRenderer;
		columnDef.cellRenderer = cell_renderer;
	}
	if(prop.type === "text"){
		columnDef.editable = true;
	}
	if(prop.is_relation){
		columnDef.cellRenderer = function(params: any){
			if(typeof params.value === "string"){
				return `<div>${params.value}</div>`
			}
			else if(params.value?.name){
				return `<div>${params.value?.name}</div>`
			}
			else{
				return `<div>${params.value?.id}</div>`
			}
		}
	}

	return columnDef;
}