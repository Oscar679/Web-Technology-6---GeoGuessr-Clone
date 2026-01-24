

import { Routes, Route } from "react-router-dom"

import Home from "./pages/Home"
import Game from "./pages/Game"
import Result from "./pages/Result"
import Layout from "./Layout"
import LeaderBoard from "./pages/LeaderBoard"
import Login from "./pages/Login"
import SignUp from "./pages/SignUp"

function App() {
    return (
        <>
            <Routes>
                <Route element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="/Home" element={<Home />} />
                    <Route path="/Game" element={<Game />} />
                    <Route path="/Result" element={<Result />} />
                    <Route path="/Leaderboard" element={<LeaderBoard />} />
                    <Route path="/Login" element={<Login />} />
                    <Route path="/SignUp" element={<SignUp />} />
                </Route>
            </Routes>
        </>
    )
}

export default App