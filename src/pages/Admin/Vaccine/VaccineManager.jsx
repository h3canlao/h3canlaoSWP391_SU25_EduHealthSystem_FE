import React, { useEffect, useState } from "react";
import { Tabs, message } from "antd";
import VaccineTypeTab from "./VaccineTypeTab";
import VaccineLotTab from "./VaccineLotTab";
import VaccineDoseInfoTab from "./VaccineDoseInfoTab";
import { getVaccineTypes } from "@/services/vaccineManagerApi";

const { TabPane } = Tabs;

const VaccineManager = () => {
  const [vaccineTypes, setVaccineTypes] = useState([]);

  // Lấy danh sách loại vaccine dùng chung cho Lot/DoseInfo
  const fetchTypes = async () => {
    try {
      const res = await getVaccineTypes();
      setVaccineTypes(res.data.data || res.data || []);
    } catch {
      message.error("Không tải được danh sách loại vaccine");
    }
  };

  useEffect(() => {
    fetchTypes();
  }, []);

  return (
    <Tabs defaultActiveKey="type">
      <TabPane tab="Loại Vaccine" key="type">
        <VaccineTypeTab />
      </TabPane>
      <TabPane tab="Lô Vaccine" key="lot">
        <VaccineLotTab vaccineTypes={vaccineTypes} />
      </TabPane>
      <TabPane tab="Thông tin liều tiêm" key="dose">
        <VaccineDoseInfoTab vaccineTypes={vaccineTypes} />
      </TabPane>
    </Tabs>
  );
};

export default VaccineManager;
