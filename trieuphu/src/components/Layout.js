import React from "react";
import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";

const Layout = () => (
    <div>
        <NavBar />
        <main style={{padding: '20px'}}>
            <Outlet />
        </main>
    </div>
);

export default Layout;