export interface FUNCTIONS {
    name: string,
    description: string,
    function: Function,
    arguments: {name: string, type: string, description?: string}[],
    return_type: string,
    return_description?: string,
    icon?: string,
}