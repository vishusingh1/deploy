import { useEffect, useState } from "react";

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { T_INFO } from "../../broken-types/comp";
import AS from "../../gfn/AS";
import { generate_draft_id } from "../../utils/draft";
import { produce } from "structurajs";

const QuillEditor = (props: {name: string, info: T_INFO, value?:string, idx?: number,}) => {

    const [value, setValue] = useState(props.value);
    const init = () => {
        // console.log("INIT QUILL");
        // const quill = new Quill('#rich-text-editor', {
        //     modules: {
        //         toolbar: [
        //             [{ header: [1, 2, 3, 4, 5, 6, false] }],
        //             ['bold', 'italic', 'underline', 'strike'],
        //             [{ list: 'ordered' }, { list: 'bullet' }],
        //             ['blockquote', 'code-block'],
        //             [{ indent: '-1' }, { indent: '+1' }],
        //             [{ align: [] }],
        //         ],
        //     },
        // });


        // BROKENGLOBAL.actions['clear-quill'] = {
        //     name: "clear-quill",
        //     description: "Clear the quill editor",
        //     function: () => {
        //         setValue('');
        //     },
        //     arguments: [],
        //     return_type: "void",    
        // }
    }

    useEffect(()=>{
        init();
    }, []);


    useEffect(()=>{
        setValue(props.value);
    }, [props.value])


    const onChange = (value: any, delta: any, source: any, editor: any) => {
        setValue(value);

        const INFO = props.info;
        const name = props.name;
        const idx = props.idx


        const mid = INFO.mid;
        const cid = INFO.cid;

        if(!mid || !cid) return console.warn("NO MODEL ID OR COMP ID FOUND");

        const did = generate_draft_id(cid, idx);
        const D = AS.GSTORE.get_draft(mid, did);

        if(!D || !D.id) return console.warn("D || D.id not found", D);

        const ND = produce(D, (draft)=>{
            draft[name] = value;
        });

        AS.GSTORE.set_draft(mid, did, ND);
    }

    
    return (
        <div>
            <ReactQuill 
                theme="snow" value={value} onChange={onChange} />
        </div>
    )
}

export default QuillEditor;