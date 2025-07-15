import React from "react";
import MainLayout from "@/layouts/MainLayout";
import { Outlet } from "react-router-dom";
import SideBar from "./SideBar";

export default function Parents() {
  return <MainLayout sidebar={<SideBar />}><Outlet /></MainLayout>;
}
