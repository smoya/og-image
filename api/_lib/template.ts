
import { AsyncAPIDocument } from '@asyncapi/parser';
import { readFileSync } from 'fs';
import marked from 'marked';
import { sanitizeHtml } from './sanitizer';
import { ParsedRequest } from './types';

import '../_fonts/Inter-Regular.woff2';
import '../_fonts/Inter-Bold.woff2';
import '../_fonts/Vera-Mono.woff2';

const rglr = readFileSync(`${__dirname}/../_fonts/Inter-Regular.woff2`).toString('base64');
const bold = readFileSync(`${__dirname}/../_fonts/Inter-Bold.woff2`).toString('base64');
const mono = readFileSync(`${__dirname}/../_fonts/Vera-Mono.woff2`).toString('base64');

function getCss(theme: string) {
    let background = 'white';
    let foreground = 'black';
    let radial = 'lightgray';

    if (theme === 'dark') {
        background = 'black';
        foreground = 'white';
        radial = 'dimgray';
    }
    return `
    @font-face {
        font-family: 'Inter';
        font-style:  normal;
        font-weight: normal;
        src: url(data:font/woff2;charset=utf-8;base64,${rglr}) format('woff2');
    }

    @font-face {
        font-family: 'Inter';
        font-style:  normal;
        font-weight: bold;
        src: url(data:font/woff2;charset=utf-8;base64,${bold}) format('woff2');
    }

    @font-face {
        font-family: 'Vera';
        font-style: normal;
        font-weight: normal;
        src: url(data:font/woff2;charset=utf-8;base64,${mono})  format("woff2");
      }

    body {
        background: ${background};
        background-image: radial-gradient(circle at 25px 25px, ${radial} 2%, transparent 0%), radial-gradient(circle at 75px 75px, ${radial} 2%, transparent 0%);
        background-size: 100px 100px;
        height: 100vh;
        display: flex;
        text-align: center;
        align-items: center;
        justify-content: center;
    }

    code {
        color: #D400FF;
        font-family: 'Vera';
        white-space: pre-wrap;
        letter-spacing: -5px;
    }

    code:before, code:after {
        content: '\`';
    }

    .logo-wrapper {
        display: flex;
        align-items: center;
        align-content: center;
        justify-content: center;
        justify-items: center;
    }

    .logo {
        margin: 0 75px;
    }

    .plus {
        color: #BBB;
        font-family: Times New Roman, Verdana;
        font-size: 100px;
    }

    .spacer {
        margin: 150px;
    }

    .emoji {
        height: 1em;
        width: 1em;
        margin: 0 .05em 0 .1em;
        vertical-align: -0.1em;
    }
    
    .title {
        font-family: 'Inter', sans-serif;
        font-size: 100px;
        font-style: normal;
        color: ${foreground};
        line-height: 1.8;
    }
    
    .text {
        font-family: 'Inter', sans-serif;
        font-size: 50px;
        font-style: normal;
        color: ${foreground};
        line-height: 1.8;
    }
    `;
}

export function getHtml(parsedReq: ParsedRequest) {
    const { theme, images, widths, heights, asyncapi } = parsedReq;
    return `<!DOCTYPE html>
<html>
    <meta charset="utf-8">
    <title>Generated Image</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        ${getCss(theme)}
    </style>
    <body>
        <div>
            <div class="spacer">
            <div class="logo-wrapper">
                ${images.map((img, i) =>
        getImage(img, widths[i], heights[i])
    ).join('')}
            </div>
            <div class="title">${asyncapi ? asyncapi.info().title() : ''} ${asyncapi ? asyncapi.info().version() : ''}</div>
            <div class="text">${asyncapi ? 
                asyncapi.info().hasDescription() ?
                    marked(asyncapi.info().description() || '') 
                : ''
            : ''}</div>
            <div class="spacer">
            <div class="text">${getStats(asyncapi)}</div>
        </div>
    </body>
</html>`;
}

function getStats(asyncapi: AsyncAPIDocument): string {
    return `${asyncapi.hasServers() ? Object.keys(asyncapi.servers()).length : 'No'} Servers ` +
        `| ${asyncapi.hasChannels() ? Object.keys(asyncapi.channels()).length : 'No'} Channels ` +
        `| ${asyncapi.hasMessages() ? asyncapi.allMessages().size : 'No'} Messages`;
}
function getImage(src: string, width = 'auto', height = '225') {
    return `<img
        class="logo"
        alt="Generated Image"
        src="${sanitizeHtml(src)}"
        width="${sanitizeHtml(width)}"
        height="${sanitizeHtml(height)}"
    />`
}