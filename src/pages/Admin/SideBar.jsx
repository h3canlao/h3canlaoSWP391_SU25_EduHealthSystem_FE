import "react-pro-sidebar/dist/css/styles.css";
import {
  ProSidebar,
  Menu,
  MenuItem,
  SubMenu,
  SidebarHeader,
  SidebarContent,
  SidebarFooter
} from "react-pro-sidebar";

import {
  FaUserCircle,
  FaTachometerAlt,
  FaGem,
  FaBars,
  FaSyringe,
  FaFirstAid,
  FaPills,
  FaClinicMedical,
  FaVial,
  FaRegClipboard,
  FaRegCheckCircle,
  FaChevronRight,
  FaChevronDown,
  FaList,
} from "react-icons/fa";
import { useLocation, NavLink } from "react-router-dom";

import "./SideBar.css";

const SideBar = ({ collapsed, toggleSidebar }) => {
  const location = useLocation();
  const { pathname } = location;

  return (
    <ProSidebar
      collapsed={collapsed}
      className={collapsed ? "collapsed" : ""}
      width={320}
      collapsedWidth={60}
      style={{ minHeight: "100vh" }}
    >
      <SidebarHeader
        className="sidebar-header"
        style={{
          padding: "24px",
          fontWeight: "bold",
          fontSize: "1.2rem",
          textAlign: "center",
          background: "#fff"
        }}
      >
        {collapsed ? (
          <FaBars style={{ cursor: "pointer" }} onClick={toggleSidebar} />
        ) : (
          <div>
            <div style={{ fontWeight: "bold", fontSize: "1.2rem" }}>SMMS</div>
            <div style={{ fontSize: "0.8rem", color: "#888" }}>Quản lý trường học</div>
          </div>
        )}
      </SidebarHeader>

      <SidebarContent className="sidebar-content">
        <Menu iconShape="circle">
          <MenuItem icon={<FaTachometerAlt />}>
            <NavLink to="/admin/dashboard">Tổng quan & Báo cáo</NavLink>
          </MenuItem>

          {/* Quản lý người dùng & vật tư */}
          <SubMenu
            icon={<FaGem />}
            title="Quản lý"
            defaultOpen={true}
            open={true} // luôn mở
            suffix={collapsed ? <FaChevronRight /> : <FaChevronDown />}
          >
            <MenuItem icon={<FaUserCircle />} active={pathname === "/admin/manage-users"}>
              <NavLink to="/admin/manage-users">Người dùng</NavLink>
            </MenuItem>
            <MenuItem icon={<FaClinicMedical />} active={pathname === "/admin/manage-medicalSupply"}>
              <NavLink to="/admin/manage-medicalSupply">Vật tư y tế</NavLink>
            </MenuItem>
            <MenuItem icon={<FaPills />} active={pathname === "/admin/manage-medication"}>
              <NavLink to="/admin/manage-medication">Thuốc</NavLink>
            </MenuItem>
            <MenuItem icon={<FaSyringe />} active={pathname === "/admin/manage-vaccinationCampaign"}>
              <NavLink to="/admin/manage-vaccinationCampaign">Chiến dịch tiêm chủng</NavLink>
            </MenuItem>
            <MenuItem icon={<FaList />} active={pathname === "/admin/manage-vaccinationSchedule"}>
              <NavLink to="/admin/manage-vaccinationSchedule">Lịch tiêm chủng</NavLink>
            </MenuItem>
            <MenuItem icon={<FaVial />} active={pathname === "/admin/manage-vaccine"}>
              <NavLink to="/admin/manage-vaccine">Quản lý vắc xin</NavLink>
            </MenuItem>
          </SubMenu>
      </SidebarContent>
      <SidebarFooter
        className="sidebar-footer"
        style={{
          textAlign: "center",
          padding: "10px 0",
          fontWeight: "bold",
          color: "#666",
          background: "#fafafa"
        }}
      >
        SWP391
      </SidebarFooter>
    </ProSidebar>
  );
};

export default SideBar;
