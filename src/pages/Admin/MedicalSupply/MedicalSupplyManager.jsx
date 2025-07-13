import React, { useState } from "react";
import { Tabs } from "antd";
import MedicalSupplyLotAdmin from "./MedicalSupplyLotAdmin";
import MedicalSupplyAdmin from "./MedicalSupplyAdmin";

const MedicalSupplyManager = () => {
  const [activeKey, setActiveKey] = useState("medicalSupply");

  return (
    <Tabs
      activeKey={activeKey}
      onChange={setActiveKey}
      type="card"
      items={[
        {
          key: "medicalSupply",
          label: "Vật tư",
          children: <MedicalSupplyAdmin />,
        },
        {
          key: "lots",
          label: "Lô vật tư",
          children: <MedicalSupplyLotAdmin />,
        },
      ]}
    />
  );
};

export default MedicalSupplyManager;
