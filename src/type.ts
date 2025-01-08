import { AriaAttributes } from "react";

declare module "react" {
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    // extends React's HTMLAttributes
    bid?: string;
    model_id?: string;
    mid?: string; // model id
    eid?: string; // entity id
    op?: string; // operation
    name?: string;
    action?: string | string[];
    findex?: string;

    b_type?: string;
    b_idx?: number | {idx: number};

  }

  interface SVGAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    // extends React's SVGAttributes
    bid?: string;
    model_id?: string;
    mid?: string; // model id
    eid?: string; // entity id
    op?: string; // operation
    name?: string;
    action?: string | string[];
    findex?: string;

    b_type?: string;
    b_idx?: number;
  }
}
