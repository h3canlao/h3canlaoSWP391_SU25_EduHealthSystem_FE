import "react-pro-sidebar/dist/css/styles.css";
import { ProSidebar, Menu, MenuItem, SubMenu, SidebarHeader, SidebarContent, SidebarFooter } from "react-pro-sidebar";

import {
  FaArchive,
  FaUserCircle,
  FaTachometerAlt,
  FaGem,
  FaList,
  FaBars,
  FaSyringe,
  FaFirstAid,
  FaBookMedical,
  FaCreativeCommonsSamplingPlus,
  FaClinicMedical,
  FaDelicious,
  FaBoxes,
  FaPills,
  FaLayerGroup,
} from "react-icons/fa";
import { useLocation, NavLink } from "react-router-dom";

import "./SideBar.css";

const SideBar = ({ collapsed, toggleSidebar }) => {
  const location = useLocation();
  const { pathname } = location;
  return (
    <ProSidebar collapsed={collapsed} className={collapsed ? "collapsed" : ""}>
      <SidebarHeader
        className="sidebar-header"
        style={{ padding: "24px", fontWeight: "bold", fontSize: "1.2rem", textAlign: "center" }}
      >
        {collapsed ? (
          <FaBars style={{ cursor: "pointer" }} onClick={toggleSidebar} />
        ) : (
          <div>
            <div style={{ fontWeight: "bold", fontSize: "1.2rem" }}>SMMS</div>
            <div style={{ fontSize: "0.8rem", color: "#888" }}>Quản lý người dùng</div>
          </div>
        )}
      </SidebarHeader>

      <SidebarContent className="sidebar-content">
        <Menu iconShape="circle">
          <MenuItem icon={<FaTachometerAlt />}>
            <NavLink to="/admin/dashboard">Tổng quan & Báo cáo</NavLink>
          </MenuItem>

          {/* Quản lý người dùng & vật tư */}
          <SubMenu icon={<FaGem />} title="Quản lý">
            <MenuItem icon={<FaUserCircle />} active={pathname === "/admin/manage-users"}>
              <NavLink to="/admin/manage-users">Người dùng</NavLink>
            </MenuItem>
            <MenuItem icon={<FaClinicMedical />} active={pathname === "/admin/manage-medicalSupply"}>
              <NavLink to="/admin/manage-medicalSupply">Quản lý vật tư y tế</NavLink>
            </MenuItem>
            <MenuItem icon={<FaPills />} active={pathname === "/admin/manage-medication"}>
              <NavLink to="/admin/manage-medication">Quản lý thuốc</NavLink>
            </MenuItem>
            <MenuItem icon={<FaSyringe />} active={pathname === "/admin/manage-vaccinationCampaign"}>
              <NavLink to="/admin/manage-vaccinationCampaign">Chiến dịch tiêm chủng</NavLink>
            </MenuItem>
            <MenuItem icon={<FaSyringe />} active={pathname === "/admin/manage-vaccinationSchedule"}>
              <NavLink to="/admin/manage-vaccinationSchedule">Lịch tiêm chủng</NavLink>
            </MenuItem>
            <MenuItem icon={<FaSyringe />} active={pathname === "/admin/manage-vaccine"}>
              <NavLink to="/admin/manage-vaccine">Quản lý vắc xin</NavLink>
            </MenuItem>
          </SubMenu>

          {/* Xác nhận */}
          <SubMenu icon={<FaSyringe />} title="Xác nhận">
            <MenuItem>
              <NavLink to="/admin/vaccinations/confirm">Xác nhận tiêm chủng</NavLink>
            </MenuItem>
            <MenuItem>
              <NavLink to="/admin/medications/confirm">Xác nhận thuốc từ PH</NavLink>
            </MenuItem>
          </SubMenu>

          {/* Sự kiện y tế */}
          <MenuItem icon={<FaFirstAid />}>
            <NavLink to="/admin/events">Sự kiện y tế</NavLink>
          </MenuItem>
        </Menu>
      </SidebarContent>
      <SidebarFooter
        className="sidebar-footer"
        style={{ textAlign: "center", padding: "10px 0", fontWeight: "bold", color: "#666" }}
      >
        SWP391
      </SidebarFooter>
    </ProSidebar>
  );
};

export default SideBar;
