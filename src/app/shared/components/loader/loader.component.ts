import { Component } from '@angular/core';

@Component({
    selector: 'app-loader',
    template: `<div class="loader"></div>`,
    styles: [
        `.loader {
            display: inline-block;
            width: 60px;
            height: 60px;
        }
        .loader:after {
            content: " ";
            display: block;
            width: 44px;
            height: 44px;
            margin: 8px;
            border-radius: 50%;
            border: 6px solid #990000;
            border-color: #990000 transparent #990000 transparent;
            animation: loading 1.2s linear infinite;
        }
        @keyframes loading {
            0% {
                transform: rotate(0deg);
            }
            100% {
                transform: rotate(360deg);
            }
        }`
    ]
})
export class LoaderComponent {}
