import 'react-pro-sidebar/dist/css/styles.css';
import {
    ProSidebar,
    Menu,
    MenuItem,
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
    FaClock,
    FaStethoscope,
    FaComments
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
                            icon={<FaHeartbeat />}
                            active={pathname === '/nurse' || pathname === '/nurse/dashboard'}
                        >
                            <NavLink to="/nurse/dashboard">Dashboard</NavLink>
                        </MenuItem>
                        <MenuItem
                            icon={<FaClock />}
                            active={pathname === '/nurse/pending-medications'}
                        >
                            <NavLink to="/nurse/pending-medications">Pending Medications</NavLink>
                        </MenuItem>
                        <MenuItem
                            icon={<FaStethoscope />}
                            active={pathname === '/nurse/health-checkups'}
                        >
                            <NavLink to="/nurse/health-checkups">Khám Sức Khỏe</NavLink>
                        </MenuItem>
                        <MenuItem
                            icon={<FaComments />}
                            active={pathname === '/nurse/counseling-appointments'}
                        >
                            <NavLink to="/nurse/counseling-appointments">Lịch tư vấn</NavLink>
                        </MenuItem>
                        <MenuItem
                            icon={<FaSyringe />}
                            active={pathname === '/nurse/vaccine-forms'}
                        >
                            <NavLink to="/nurse/vaccine-forms">Tạo phiếu tiêm chủng</NavLink>
                        </MenuItem>
                        <MenuItem
                            icon={<FaCalendarCheck />}
                            active={pathname === '/nurse/manage-vaccine-forms'}
                        >
                            <NavLink to="/nurse/manage-vaccine-forms">Quản lý phiếu tiêm chủng</NavLink>
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