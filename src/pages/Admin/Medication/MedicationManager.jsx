import React, { useState } from "react";
import { Tabs } from "antd";
import MedicationAdmin from ".";
import MedicationLotAdmin from "./MedicationLotAdmin";

const MedicationManager = () => {
  const [activeKey, setActiveKey] = useState("medications");

  return (
    <Tabs
      activeKey={activeKey}
      onChange={setActiveKey}
      type="card"
      items={[
        {
          key: "medications",
          label: "Thuốc",
          children: <MedicationAdmin />,
        },
        {
          key: "lots",
          label: "Lô thuốc",
          children: <MedicationLotAdmin />,
        },
      ]}
    />
  );
};

export default MedicationManager;
