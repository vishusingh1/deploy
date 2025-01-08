
import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Drawer } from "vaul"
import AS from '@/gfn/AS';


const DrawerComp = (props: { children: React.ReactNode[],direction:'right' | 'left' | 'top' | 'bottom' , content_class:string, gskey?: string,}) => {
    const [open, set_open] = useState(false);

    const { children, direction, content_class } = props;

    let Trigger: React.ReactNode = <div>Open</div>
    let Content: React.ReactNode = <div>Content</div>
    let Title: React.ReactNode = <div></div>
    let Footer = <div></div>

    if (children.length === 2) {
        Trigger = children[0]
        Content = children[1]
    }



    const GS_SHOW = AS.GSTORE.GLOBAL_STATE.get(props.gskey || "DEFAULT"); // make sure to not use this if it's default
    // @remember you can't have useEffect inside a condition. So we are using a DEFAULT GS when not required

    // use this to control this drawer from outside
    useEffect(()=>{
        if(!props.gskey) return; // no key don't control this drawer. Only local controll using set_open
        if(GS_SHOW.value === open) return;
        set_open(GS_SHOW.value);
    }, [GS_SHOW.value]);

    // use this to update GS when local open state changes
    useEffect(()=>{
        if(!props.gskey) return; // no key don't control this drawer. Only local controll using set_open
        const prev = GS_SHOW.value;
        if(prev === open) return;

        GS_SHOW.set(open);
    }, [open])


    return (
        <Drawer.Root direction={direction || 'right'} open={open} onOpenChange={set_open}>
            <Drawer.Trigger asChild>
                {Trigger}
            </Drawer.Trigger>
            <Drawer.Portal>
                <Drawer.Overlay className="fixed inset-0 bg-black/40 " />
                <Drawer.Content className={`${content_class || ' bg-zinc-100 flex flex-col rounded-t-[10px] w-96 h-full fixed bottom-0  right-0'}`}>
                    <div className="p-4 bg-white rounded-t-[10px] flex-1">
                        <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-zinc-300 mb-8" />
                        <div className="max-w-md mx-auto">
                            <Drawer.Title className="font-medium mb-4">
                                {Title}
                            </Drawer.Title>
                            {Content}
                        </div>
                    </div>
                    <div className="p-4 bg-zinc-100 border-t border-zinc-200 mt-auto">
                        <div className="flex gap-6 justify-end max-w-md mx-auto">
                            {Footer}
                        </div>
                    </div>
                </Drawer.Content>
            </Drawer.Portal>
        </Drawer.Root>
    )
}




export default observer(DrawerComp);