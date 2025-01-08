
import * as Dialog from '@radix-ui/react-dialog';
import { observer } from 'mobx-react-lite';
import { ReactNode, useState } from 'react';

import BROKENGLOBAL from "@/BROKENGLOBAL";



const DefaultTrigger = ({trigger}) => (
    <div className="rounded-lg p-2 px-4 border bg-teal-200 hover:bg-teal-600 hover:text-white cursor-pointer"> 
        <div className="text-sm flex items-center gap-2">
            <iconify-icon icon="file-icons:templatetoolkit" width="18" height="18"></iconify-icon>
            <span className="text-nowrap">
                {trigger || "Open"}
            </span>
        </div>
    </div>
);


const DefaultTitle = ({title}) => (
    <div className="text-mauve12 m-0 text-[17px] font-medium">
        {title || ""}
    </div>
);

const DefaultDescription = ({description}) => (
    <div className="mt-[10px] mb-5 text-[15px] leading-normal">
        {description || ""}
    </div>
);

const DefaultContent = ({content}) => (
    <div className="mt-[10px] mb-5 text-[15px] leading-normal">
        <p>{content || "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."}</p>
    </div>
);

const DefaultCloseButton = () => (
    <button
        className="text-violet11 hover:bg-violet4 focus:shadow-violet7 absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
        aria-label="Close"
    >
        <iconify-icon icon="lucide:x"></iconify-icon>
    </button>
)



const Modal = (props: { children: React.ReactNode[],overlay_class?:string,content_class?:string, trigger?: string, title?: string, description?: string, content?: string}) => {
    const [open, set_open] = useState(false);

    const { trigger, title, description, content, children,overlay_class,content_class } = props;


    let Trigger:ReactNode         = DefaultTrigger({trigger})
    let Title:ReactNode           = DefaultTitle({title})
    let Description:ReactNode     = DefaultDescription({description})
    let Content:ReactNode         = DefaultContent({content})
    let CloseButton:ReactNode     = DefaultCloseButton()
    let Overlay_class:string      = overlay_class || "bg-blackA6 data-[state=open]:animate-overlayShow fixed inset-0 bg-slate-100/10"
    let Content_class:string      = content_class || "z-50 data-[state=open]:animate-contentShow fixed top-[33%] left-[33%] max-h-[85vh] w-[75vw]  translate-x-[-25%] translate-y-[-25%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none"


    if(children.length === 1){}
    else if(children.length === 2){
        Trigger         = children[0]
        Content           = children[1]
    }

    // const Trigger       = props.children[0]     || DefaultTrigger({trigger});
    // const Title         = props.children[1]     || DefaultTitle({title});
    // const Description   = props.children[2]     || DefaultDescription({description});
    // const Content       = props.children[3]     || DefaultContent({content});
    // const CloseButton   = props.children[4]     || DefaultCloseButton();



    return (
        <Dialog.Root open={open} onOpenChange={set_open}>
            <Dialog.Trigger asChild>
                {Trigger}
            </Dialog.Trigger>

            <Dialog.Portal>
                <Dialog.Overlay className={Overlay_class} />
                <Dialog.Content className={Content_class}>
                    <Dialog.Title className="">
                        {Title}
                    </Dialog.Title>

                    <Dialog.Description>
                        {Description}
                    </Dialog.Description>

                    {Content}

                    <Dialog.Close asChild>
                        {CloseButton}
                    </Dialog.Close>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    )
}



export default observer(Modal);