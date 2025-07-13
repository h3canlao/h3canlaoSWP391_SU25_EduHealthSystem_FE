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
    FaFileMedical,
    FaComments
} from 'react-icons/fa';
import { Link, useLocation, NavLink } from 'react-router-dom';

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
                        {!collapsed && <span className="sidebar-title">Parent Portal</span>}
                    </div>
                </SidebarHeader>

                <SidebarContent>
                    <Menu iconShape="circle">
                        <MenuItem
                            icon={<FaUsers />}
                            active={pathname === '/parents/student-profiles'}
                        >
                            <NavLink to="/parents/student-profiles">Student Profiles</NavLink>
                        </MenuItem>
                        <SubMenu title="Health" icon={<FaHeartbeat />}>
                            <MenuItem
                                icon={<FaBriefcaseMedical />}
                                active={pathname === '/parents/send-medication'}
                            >
                                <NavLink to="/parents/send-medication">Send Medication</NavLink>
                            </MenuItem>
                        </SubMenu>
                        <SubMenu title="Vắc xin" icon={<FaShieldAlt />}>
                            <MenuItem
                                icon={<FaShieldAlt />}
                                active={pathname === '/parents/vaccine-overview'}
                            >
                                <NavLink to="/parents/vaccine-overview">Overview</NavLink>
                            </MenuItem>
                            <MenuItem
                                icon={<FaShieldAlt />}
                                active={pathname === '/parents/vaccine-history'}
                            >
                                <NavLink to="/parents/vaccine-history">History</NavLink>
                            </MenuItem>
                        </SubMenu>
                        <SubMenu title="Medical" icon={<FaUserMd />}>
                            <MenuItem
                                icon={<FaFileMedical />}
                                active={pathname === '/parents/checkup-records'}>
                                <NavLink to="/parents/checkup-records">Theo dõi hồ sơ khám sức khỏe</NavLink>
                            </MenuItem>
                            <MenuItem
                                icon={<FaHeartbeat />}
                                active={pathname === '/parents/checkup-schedules'}>
                                <NavLink to="/parents/checkup-schedules">Lịch khám sức khỏe</NavLink>
                            </MenuItem>
                        </SubMenu>
                        <MenuItem
                            icon={<FaComments />}
                            active={pathname === '/parents/counseling-records'}
                        >
                            <NavLink to="/parents/counseling-records">Theo dõi lịch tư vấn sức khỏe</NavLink>
                        </MenuItem>
                        <MenuItem className='notification-menu-item'
                            icon={<FaBell />}
                            active={pathname === '/parents/notifications'}
                        >
                            <NavLink to="/parents/notifications">Notifications</NavLink>
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