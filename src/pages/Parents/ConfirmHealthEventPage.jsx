import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Spin, Result, Button, message } from "antd";
import { confirmHealthEventByParent } from "@/services/apiServices";

const ConfirmHealthEventPage = () => {
  const { id } = useParams(); // Lấy 'id' từ path
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const processConfirmation = async () => {
      // Dựa trên URL mới: ...?token=...
      const queryParams = new URLSearchParams(location.search);
      const token = queryParams.get("token"); // <-- THAY ĐỔI Ở ĐÂY
      if (!id || !token) {
        setError("URL không hợp lệ hoặc thiếu thông tin xác nhận.");
        setLoading(false);
        return;
      }

      try {
        // Gọi service API, endpoint của API vẫn là /api/health-events/{id}/confirm-health-event
        await confirmHealthEventByParent(id, token);

        message.success("Xác nhận thông báo thành công!");
      } catch (err) {
        console.error("Lỗi khi xác nhận:", err);
        const errorMessage =
          err.response?.data?.message || "Xác nhận không thành công. Vui lòng thử lại hoặc liên hệ với nhà trường.";
        setError(errorMessage);
        setLoading(false);
      }
    };

    processConfirmation();
  }, [id, location.search, navigate]);

  // if (loading) {
  //   return (
  //     <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
  //       <Spin tip="Đang xử lý xác nhận, vui lòng chờ..." size="large" />
  //     </div>
  //   );
  // }

  if (error) {
    return (
      <Result
        status="error"
        title="Xác nhận thất bại"
        subTitle={error}
        extra={[
          <Button type="primary" key="dashboard" onClick={() => navigate("/")}>
            Về Trang chủ
          </Button>,
        ]}
      />
    );
  }

  return (
    <Result
      status="success"
      title="Đã xác nhận thông báo thành công!"
      extra={[
        <Button type="primary" key="dashboard" onClick={() => navigate("/")}>
          Về Trang chủ
        </Button>,
      ]}
    />
  );
};

export default ConfirmHealthEventPage;
