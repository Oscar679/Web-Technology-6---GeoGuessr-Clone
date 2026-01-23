import { jsx as _jsx } from "react/jsx-runtime";
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { Theme } from "@radix-ui/themes";
import { BrowserRouter } from "react-router-dom";
createRoot(document.getElementById('root')).render(_jsx(BrowserRouter, { basename: '/oe222ia/geoguessr_frontend', children: _jsx(Theme, { appearance: 'dark', children: _jsx(App, {}) }) }));
