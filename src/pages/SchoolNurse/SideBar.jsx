import 'react-pro-sidebar/dist/css/styles.css';
import {
    ProSidebar,
    Menu,
    MenuItem,
    SubMenu,
    SidebarHeader,
    SidebarContent,
    SidebarFooter,
} from 'react-pro-sidebar';

import {
    FaUsers,
    FaHeartbeat,
    FaBell,
    FaBars,
    FaSignOutAlt,
    FaBriefcaseMedical,
    FaShieldAlt,
    FaUserMd,
    FaCalendarCheck,
    FaSyringe,
    FaClock
} from 'react-icons/fa';
import { useLocation, NavLink } from 'react-router-dom';

import './SideBar.css';

const user = {
    name: 'Michael Smith',
    email: 'michaelsmith12@gmail.com',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
};

const SideBar = ({ collapsed, toggleSidebar }) => {
    const location = useLocation();
    const { pathname } = location;
    return (
        <div className={`sidebar-container ${collapsed ? 'collapsed' : ''}`}>
            <ProSidebar collapsed={collapsed}>
                <SidebarHeader>
                    <div className="sidebar-header">
                        <span className="sidebar-logo" onClick={toggleSidebar}>
                            <FaBars />
                        </span>
                        {!collapsed && <span className="sidebar-title">School Nurse Portal</span>}
                    </div>
                </SidebarHeader>

                <SidebarContent>
                    <Menu iconShape="circle">
                        <MenuItem
                            icon={<FaSyringe />}
                            active={pathname === '/nurse/create-vaccine-schedule'}
                        >
                            <NavLink to="/nurse/create-vaccine-schedule">Create Vaccine Schedule</NavLink>
                        </MenuItem>
                        <MenuItem
                            icon={<FaCalendarCheck />}
                            active={pathname === '/nurse/create-checkup-schedule'}
                        >
                            <NavLink to="/nurse/create-checkup-schedule">Create Checkup Schedule</NavLink>
                        </MenuItem>
                        <MenuItem
                            icon={<FaClock />}
                            active={pathname === '/nurse/pending-medications'}
                        >
                            <NavLink to="/nurse/pending-medications">Pending Medications</NavLink>
                        </MenuItem>
                    </Menu>
                </SidebarContent>

                <SidebarFooter>
                    <div className="sidebar-footer-content">
                        <div className="user-info">
                            <img src={user.avatar} alt="avatar" className="user-avatar" />
                            {!collapsed && (
                                <div className="user-details">
                                    <div className="user-name">{user.name}</div>
                                    <div className="user-email">{user.email}</div>
                                </div>
                            )}
                        </div>
                        {!collapsed && (
                            <span className="logout-icon">
                                <FaSignOutAlt />
                            </span>
                        )}
                    </div>
                </SidebarFooter>
            </ProSidebar>
        </div>
    )
}

export default SideBar;