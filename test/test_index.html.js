const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

describe('index.html', () => {
    let dom;
    let document;

    beforeAll(() => {
        const filePath = path.join(__dirname, '../index.html');
        const html = fs.readFileSync(filePath, 'utf8');
        dom = new JSDOM(html);
        document = dom.window.document;
    });

    test('should have a title "Barjak Keyboard"', () => {
        const title = document.querySelector('title');
        expect(title.textContent).toBe('Barjak Keyboard');
    });

    test('should have a meta charset set to UTF-8', () => {
        const metaCharset = document.querySelector('meta[charset="UTF-8"]');
        expect(metaCharset).not.toBeNull();
    });

    test('should have a viewport meta tag', () => {
        const metaViewport = document.querySelector('meta[name="viewport"]');
        expect(metaViewport).not.toBeNull();
        expect(metaViewport.getAttribute('content')).toBe('width=device-width, initial-scale=1, maximum-scale=1');
    });

    test('should have a link to apple-touch-icon', () => {
        const appleTouchIcon = document.querySelector('link[rel="apple-touch-icon"]');
        expect(appleTouchIcon).not.toBeNull();
        expect(appleTouchIcon.getAttribute('sizes')).toBe('144x144');
        expect(appleTouchIcon.getAttribute('href')).toBe('/apple-touch-icon.png');
    });

    test('should have a link to favicon-32x32', () => {
        const favicon32 = document.querySelector('link[rel="icon"][sizes="32x32"]');
        expect(favicon32).not.toBeNull();
        expect(favicon32.getAttribute('type')).toBe('image/png');
        expect(favicon32.getAttribute('href')).toBe('/favicon-32x32.png');
    });

    test('should have a link to favicon-16x16', () => {
        const favicon16 = document.querySelector('link[rel="icon"][sizes="16x16"]');
        expect(favicon16).not.toBeNull();
        expect(favicon16.getAttribute('type')).toBe('image/png');
        expect(favicon16.getAttribute('href')).toBe('/favicon-16x16.png');
    });

    test('should have a manifest link', () => {
        const manifest = document.querySelector('link[rel="manifest"]');
        expect(manifest).not.toBeNull();
        expect(manifest.getAttribute('href')).toBe('/site.webmanifest');
    });

    test('should have a mask-icon link', () => {
        const maskIcon = document.querySelector('link[rel="mask-icon"]');
        expect(maskIcon).not.toBeNull();
        expect(maskIcon.getAttribute('href')).toBe('/safari-pinned-tab.svg');
        expect(maskIcon.getAttribute('color')).toBe('#5bbad5');
    });

    test('should have a meta msapplication-TileColor', () => {
        const metaTileColor = document.querySelector('meta[name="msapplication-TileColor"]');
        expect(metaTileColor).not.toBeNull();
        expect(metaTileColor.getAttribute('content')).toBe('#da532c');
    });

    test('should have a meta theme-color', () => {
        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        expect(metaThemeColor).not.toBeNull();
        expect(metaThemeColor.getAttribute('content')).toBe('#ffffff');
    });

    test('should have a script for svg.min.js', () => {
        const scriptSvg = document.querySelector('script[src="./svg.min.js"]');
        expect(scriptSvg).not.toBeNull();
    });

    test('should have a module script for menu.js', () => {
        const scriptModule = document.querySelector('script[type="module"]');
        expect(scriptModule).not.toBeNull();
        //expect(scriptModule.getAttribute('src')).toBe('./src/menu.js');
        expect(scriptModule.textContent).toContain("import Menu from './src/menu.js'");
    });
});