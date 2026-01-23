import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import {
    Theme
} from "@radix-ui/themes"
import { BrowserRouter } from "react-router-dom"

createRoot(document.getElementById('root')!).render(
    <BrowserRouter basename='/'>
        <Theme appearance='dark'>
            <App />
        </Theme>
    </BrowserRouter>
)