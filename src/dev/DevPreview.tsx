import AS from "@/gfn/AS";
import { observer } from "mobx-react-lite";


// This component is only for showing suggestion during development 
// It has no other purpose or effect on the app other than during the dev time 
// on press of S we will show and hide dev mode


const BROKEN_JSX = () => <div className="flex items-center justify-center text-gray-500 font-semibold bg-gray-100 p-8 rounded-md"> DEV PREVIEW </div>


const DevPreview = () => {

    const devpreview = AS.GSTORE.devpreview;
    if (!devpreview) return null;

    return (
        <div className="z-50 fixed top-0 left-0 w-full h-full bg-slate-400 ">
            <div className="flex flex-col items-center justify-center h-full">
                <div className="text-white text-2xl">
                    <div><div className="flex flex-col w-full gap-6"><div className="flex flex-row items-center justify-center w-full gap-4"><div className="flex flex-col gap-1.5"><p className="label">Select a file</p><div className="mb-1 size-24 bg-gray-100 text-xl text-red-600 font-bold">hidden when no file.</div><label className="flex cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-gray-400 bg-gray-100 hover:bg-gray-200"><div className="flex flex-col items-center justify-center px-6 py-5"><svg className="mb-4 h-8 w-8 text-gray-500"><path></path></svg><p className="pb-1"><span className="font-semibold">Click to upload</span></p><p className="helper-text">SVG, PNG, JPG or GIF (MAX. 800x400px)</p></div><input className="hidden" /></label></div><button className=" bro:var:delete-btn-file "><svg><path></path><path></path></svg></button></div></div>
                        <div className="w-full">
                            <div className="flex flex-col gap-2 justify-start items-start">
                                <label className="inline-flex cursor-pointer items-center label">
                                    <input className="size-5 rounded border-gray-300 bg-gray-100 text-violet-600 accent-violet-600 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-violet-500" />
                                    <span className="bro:var:label-class ms-3">D</span></label><label className="inline-flex cursor-pointer items-center label"><input className="size-5 rounded border-gray-300 bg-gray-100 text-violet-600 accent-violet-600 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-violet-500" /><span className="bro:var:label-class ms-3">E</span></label><label className="inline-flex cursor-pointer items-center label"><input className="size-5 rounded border-gray-300 bg-gray-100 text-violet-600 accent-violet-600 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-violet-500" /><span className="bro:var:label-class ms-3">F</span></label></div></div>
                        <div className="w-full"><div className="flex flex-col gap-2 justify-start items-start "><label className="inline-flex cursor-pointer items-center label"><input className="size-5 rounded border-gray-300 bg-gray-100 text-violet-600 accent-violet-600 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-violet-500" /><span className="bro:var:label-class ms-3">A</span></label><label className="inline-flex cursor-pointer items-center label"><input className="size-5 rounded border-gray-300 bg-gray-100 text-violet-600 accent-violet-600 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-violet-500" /><span className="bro:var:label-class ms-3">B</span></label><label className="inline-flex cursor-pointer items-center label"><input className="size-5 rounded border-gray-300 bg-gray-100 text-violet-600 accent-violet-600 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-violet-500" /><span className="bro:var:label-class ms-3">C</span></label></div></div>
                        <div className="w-full">
                            <input className=" w-full rounded-md border-[1.4px] border-gray-200 bg-white px-3 py-2 leading-6 transition-all selection:bg-violet-400 selection:text-white placeholder:text-base placeholder:font-normal placeholder:text-gray-400 hover:border-gray-400 focus:border-gray-200 focus:outline-2 focus:outline-offset-2 focus:outline-violet-600" /></div>
                        <div className="w-full"></div>
                        <div><div className="flex flex-col gap-1.5"><p className="label">Select an image</p><div className="w-32 h-32 flex flex-shrink-0 bg-no-repeat bg-gray-200 bg-center bg-cover rounded-md"></div><div className="mb-1 size-24 bg-gray-100 text-xl text-red-600 font-bold">hidden when no image.</div><label className="flex cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-gray-400 bg-gray-100 hover:bg-gray-200"><div className="flex flex-col items-center justify-center px-6 py-5"><svg className="mb-4 h-8 w-8 text-gray-500"><path></path></svg><p className="pb-1"><span className="font-semibold">Click to upload</span></p><p className="helper-text">SVG, PNG, JPG or GIF (MAX. 800x400px)</p></div><input className="hidden" /></label></div></div></div>
                </div>
            </div>
        </div>
    )
}

export default observer(DevPreview);