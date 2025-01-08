import { T_INFO } from "@/broken-types/comp";

// export type T_JS_EVENT = Event | MouseEvent | KeyboardEvent | TouchEvent;
export type T_JS_EVENT = any; // we are having issue with types so we will use any until we fix it
export type T_BRO_EVENT = {e: T_JS_EVENT, M: any, INFO: T_INFO, props: any, idx?: number};