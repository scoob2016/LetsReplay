"use strict";

function escapeHTML(html) {
    return ("" + html).replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");
}

function generateHTML(log) {
    return window.TemplateHTML.replace("__BATTLE_LOG__", log);
}

function setReplay(log) {
    const html = generateHTML(log);
    const url = "data:text/html;charset=utf-8," + encodeURIComponent(html);
    const container = document.querySelector(".iframe-result-container");
    container.innerHTML = '<iframe src="' + url + '" style="width:100%;height:600px;" referrerpolicy="no-referrer" allowfullscreen></iframe>';
}

function getQueryParam(name) {
    const params = new URLSearchParams(window.location.search);
    return params.get(name);
}

function initialize() {
    const logFromURL = window.location.hash.slice(1);
    if (!logFromURL) return;

    try {
        const base64 = logFromURL.replace(/-/g, '+').replace(/_/g, '/');
        const str = atob(base64);
        
        const bytes = new Uint8Array(str.length);
        for (let i = 0; i < str.length; i++) {
            bytes[i] = str.charCodeAt(i);
        }

        const log = pako.inflate(bytes, { to: 'string' });

        setReplay(log);
    } catch (e) {
        console.error("Failed to load log from URL.", e);
        alert("Invalid log URL. Please contact support!");
    }
}

if (document.readyState !== "loading") initialize();
else document.addEventListener("DOMContentLoaded", initialize);
