import { observer } from 'mobx-react-lite';
import { PAGE_TYPE } from "@/broken-types/g_fn";
import { find_path_from_page } from "@/gfn/page";
import UTILS from "@/utils";
import { Link, NavLink, NavLinkProps } from "react-router-dom";

const BroLink = (props: NavLinkProps & {page?: PAGE_TYPE}) => {

    const lcn = (isActive: boolean, className?: string) => {
        // active:text-blue-600
        const classes = className ? className.split(' ') : [];
        const base:string[] = [];
        const active:string[] = [];
        classes.forEach(c=>{
            if(c.startsWith('active:')){
                const b = c.replace('active:', '');
                return active.push(b);
            }
            if(c.startsWith('selected:')){
                const b = c.replace('selected:', '');
                return active.push(b);
            }
            return base.push(c);
        });

        const baseclass = base.join(' ');
        const activeclass = active.join(' ');
        return UTILS.cn(baseclass, {[activeclass]: isActive});
    }

    // if page is sent use that
    const to = props.to || (props.page ? find_path_from_page(props.page): "");
    // @note: if path => product/:id => we will go to product/:id and not product/id. Because we are using path as to

    
    return (
        <NavLink {...props} to={to}  className={({isActive})=>{
            if(typeof(props.className) === "string"){
                return lcn(isActive, props.className);
            }
            return ""
        }}>
            {props.children}
        </NavLink>

    )
}

export default observer(BroLink);