import { LitElement } from 'lit';
/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
export declare class MyNotify extends LitElement {
    /**
     * Copy for the read the docs hint.
     */
    docsHint: string;
    isLoginAccessTokenValid: boolean;
    constructor();
    connectedCallback(): void;
    render(): any;
    private _GetNotifyCode;
    private _getCode;
    private _RevokeNotify;
    static styles: any;
}
declare global {
    interface HTMLElementTagNameMap {
        'my-notify': MyNotify;
    }
}
