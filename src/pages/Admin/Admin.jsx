import SideBar from "./SideBar";
import './Admin.css';
import { FaBars } from 'react-icons/fa';
import { useState } from "react";
import { Outlet } from "react-router-dom";

const Admin = (props) => {
    const [collapsed, setCollapsed] = useState(false);

    const toggleSidebar = () => {
        setCollapsed(!collapsed);
    }

    return (
        <div className="admin-container">
            <div className="admin-sidebar">
                <SideBar collapsed={collapsed} toggleSidebar={toggleSidebar} />
            </div>
            <div className="admin-content">
                <div className="admin-header">
                    {!collapsed && (
                        <FaBars className="toggle-icon" onClick={toggleSidebar} style={{ cursor: 'pointer' }} />
                    )}
                </div>
                <div className="admin-main">
                    <Outlet />
                </div>             
            </div>
        </div>
    )
}
export default Admin;
