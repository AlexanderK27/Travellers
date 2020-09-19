import { Component } from '@angular/core';

@Component({
    selector: 'app-loader',
    template: `<div class="loader">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
    </div>`,
    styles: [
        `
            .loader {
                width: fit-content;
                margin: auto;
            }
            .loader div {
                display: inline-block;
                height: 30px;
                width: 30px;
                border: 2px solid #000;
                border-bottom-width: 4px;
                margin: 4px;
                animation: loading 1.2s linear infinite;
            }
            .loader div:nth-of-type(1) {
                transform: rotate(-25deg);
                animation-delay: 0.1s;
            }
            .loader div:nth-of-type(2) {
                transform: rotate(20deg);
                animation-delay: 0.3s;
            }
            .loader div:nth-of-type(3) {
                animation-delay: 0.5s;
            }
            .loader div:nth-of-type(4) {
                transform: rotate(-15deg);
                animation-delay: 0.7s;
            }
            .loader div:nth-of-type(5) {
                transform: rotate(30deg);
                animation-delay: 0.9s;
            }
            @keyframes loading {
                0% {
                    opacity: 0;
                }
                100% {
                    opacity: 1;
                }
            }
        `,
    ],
})
export class LoaderComponent {}
