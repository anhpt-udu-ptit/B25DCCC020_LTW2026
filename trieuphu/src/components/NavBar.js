import React from "react";
import { NavLink } from "react-router-dom";

const NavBar = () => {
    const navStyle = ({ isActive }) => ({
    color: isActive ? 'red' : 'black',
    fontWeight: isActive ? 'bold' : 'normal',
    marginRight: '15px'
    });

    return (
        <nav>
            <NavLink to="/" end style={navStyle}>Trang chủ</NavLink>
            <NavLink to="/questions" style={navStyle}>Ngân hàng câu hỏi</NavLink>
            <NavLink to="/history" style={navStyle}>Lịch sử</NavLink>
        </nav>
    )
};
export default NavBar;