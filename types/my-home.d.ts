import { LitElement } from 'lit';
/**
 * 有 Line Login 和 Line Notify 才可以用這頁的功能
 * 發送 notify 與看到歷史記錄
 */
export declare class MyHome extends LitElement {
    textarea?: HTMLTextAreaElement;
    private _listItems;
    isNotifyAccessTokenValid: boolean;
    isLoginAccessTokenValid: boolean;
    constructor();
    connectedCallback(): void;
    _updHist(): Promise<void>;
    render(): any;
    private _onClick;
    private _notify;
    static styles: any;
}
declare global {
    interface HTMLElementTagNameMap {
        'my-home': MyHome;
    }
}
