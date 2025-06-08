import SideBar from "./SideBar";
import './Parents.css';
import { FaBars } from 'react-icons/fa';
import { useState } from "react";
import { Outlet } from "react-router-dom";

const Parents = (props) => {
    const [collapsed, setCollapsed] = useState(false);

    const toggleSidebar = () => {
        setCollapsed(!collapsed);
    }

    return (
        <div className="parents-container">
            <div className="parents-sidebar">
                <SideBar collapsed={collapsed} toggleSidebar={toggleSidebar} />
            </div>
            <div className="parents-content">
                <div className="parents-header">
                    {!collapsed && (
                        <FaBars className="toggle-icon" onClick={toggleSidebar} style={{ cursor: 'pointer' }} />
                    )}
                </div>
                <div className="parents-main">
                    <Outlet />
                </div>             
            </div>
        </div>
    )
}
export default Parents;
