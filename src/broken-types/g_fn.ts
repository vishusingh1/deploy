declare global {
    namespace JSX {
        interface IntrinisicElements {
            react: { },
        }
    }
    interface Window {
        init_relay: () => void;
        EN_BROKEN_COMP_LOGS: any;
        EN_BROKEN_G_FN_LOGS: any;

        broken_on_login_success: (token: any, user: any) => void;

    }
}

export type PAGE_TYPE = {
    bid: string,
    name: string,
    icon: string,
    path: string
    findex: string
}
