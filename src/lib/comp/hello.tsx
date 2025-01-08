
const HelloComp = (props: {name?: string, [s: string]: any})=>{

    return (
        <div b-id="bmjeyj" className="bg-green-200 rounded-md p-2 border border-red-400">
            <h1>Hello {props.name || "World"}</h1>
            <div>Do more with All</div>
        </div>
    )
}
export default HelloComp;