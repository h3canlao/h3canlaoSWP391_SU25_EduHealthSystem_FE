import SideBar from "./SideBar";
import './SchoolNurse.css';
import { FaBars } from 'react-icons/fa';
import { useState } from "react";
import { Outlet } from "react-router-dom";

const SchoolNurse = (props) => {
    const [collapsed, setCollapsed] = useState(false);

    const toggleSidebar = () => {
        setCollapsed(!collapsed);
    }

    return (
        <div className="schoolnurse-container">
            <div className="schoolnurse-sidebar">
                <SideBar collapsed={collapsed} toggleSidebar={toggleSidebar} />
            </div>
            <div className="schoolnurse-content">

                <div className="schoolnurse-main">
                    <Outlet />
                </div>             
            </div>
        </div>
    )
}
export default SchoolNurse;
