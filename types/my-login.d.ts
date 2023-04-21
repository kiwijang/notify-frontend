import { LitElement } from 'lit';
/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
export declare class MyLogin extends LitElement {
    render(): any;
    private _LineLogin;
    static styles: any;
}
declare global {
    interface HTMLElementTagNameMap {
        'my-login': MyLogin;
    }
}
