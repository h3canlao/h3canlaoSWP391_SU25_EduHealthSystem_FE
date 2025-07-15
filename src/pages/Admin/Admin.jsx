import React from "react";
import MainLayout from "@/layouts/MainLayout";
import { Outlet } from "react-router-dom";
import SideBar from "./SideBar";

export default function Admin() {
  return <MainLayout sidebar={<SideBar />}><Outlet /></MainLayout>;
}
