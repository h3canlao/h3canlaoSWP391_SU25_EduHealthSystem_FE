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
    FaUsers, // Icon cho Manage Users
    FaShoppingCart, // Icon cho Manage Medications
    FaCheckCircle, // Icon cho Confirm Immunization
    FaPrescription, // Icon cho Confirm Medications
    FaHeartbeat, // Icon cho Medical Events
    FaBell, // Icon cho Notifications
    FaBars,
} from 'react-icons/fa';
import { useLocation, NavLink } from 'react-router-dom';

import './SideBar.css';

const SideBar = ({ collapsed, toggleSidebar }) => {
    const location = useLocation();
    const { pathname } = location;
    return (
        <ProSidebar collapsed={collapsed} className={collapsed ? 'collapsed' : ''}>

            <SidebarHeader className='sidebar-header' style={{ padding: '24px', fontWeight: 'bold', fontSize: '1.2rem', textAlign: 'center' }}>
                {collapsed ? (
                    <FaBars 
                        style={{ cursor: 'pointer' }} 
                        onClick={toggleSidebar} 
                    />
                ) : (
                    <div>
                        <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>Parent Portal</div>
                        <div style={{ fontSize: '0.8rem', color: '#888' }}>Dashboard</div>
                    </div>
                )}
            </SidebarHeader>

            <SidebarContent className='sidebar-content'>
                <Menu iconShape="circle">

                    {/* Manage Users and Medications */}
                    <SubMenu icon={<FaUsers />} title="Manage">
                        <MenuItem icon={<FaUsers />} active={pathname === '/parents/student-profiles'}>
                            <NavLink to="/parents/student-profiles">Student Profiles</NavLink>
                        </MenuItem>
                        <MenuItem icon={<FaShoppingCart />}>
                            <NavLink to="/parents/send-medication">Send Medication</NavLink>
                        </MenuItem>
                    </SubMenu>

                    {/* Confirmations */}
                    <SubMenu icon={<FaCheckCircle />} title="Confirmations">
                        <MenuItem icon={<FaCheckCircle />}>
                            <NavLink to="/parents/immunization">Confirm Immunization</NavLink>
                        </MenuItem>
                        <MenuItem icon={<FaPrescription />}>
                            <NavLink to="/parents/send-medication">Confirm Medications</NavLink>
                        </MenuItem>
                    </SubMenu>

                    {/* Medical Events */}
                    <MenuItem icon={<FaHeartbeat />}>
                        <NavLink to="/parents/medical-checkups">Medical Events</NavLink>
                    </MenuItem>

                    {/* Notifications */}
                    <MenuItem icon={<FaBell />}>
                        <NavLink to="/parents/notifications">Notifications</NavLink>
                    </MenuItem>

                </Menu>
            </SidebarContent>
            <SidebarFooter className='sidebar-footer' style={{ textAlign: 'center', padding: '10px 0', fontWeight: 'bold', color: '#666' }}>
                SWP391
            </SidebarFooter>
        </ProSidebar>
    )
}

export default SideBar;