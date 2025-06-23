import React, { useState, useEffect } from 'react';
import TableUser from './TableUser';
import ModalNurse from './Modals/ModalNurse';
import ModalUser from './Modals/ModalUser';
import './ManageUser.css';
    const ManageUser = () => 
        {
        const [listUsers, setListUser] = useState([]);
        const [showModalUser, setShowModalUser] = useState(false);
        const [showModalNurse, setShowModalNurse] = useState(false);
        const [dataUserView, setDataUserView] = useState({});

        useEffect(() => {
            fetchAllUsers();
        }, []);


    const fetchAllUsers = async () => {
        const sampleUsers = [
            { id: 1, fullName: "Nguyễn Thị Mai", roles: ["Nurse"], email: "mai.nurse@gmail.com", username: "nguyenthimai", password: "123", dateCreated: "04/10/2023", status: "Active", avatar: "https://cdn11.dienmaycholon.vn/filewebdmclnew/public/userupload/files/Image%20FP_2024/avatar-dep-8.jpg", theme: "dark" },
            { id: 2, fullName: "Trần Văn An", roles: ["Student"], email: "an.student@gmail.com", username: "tranvanan", password: "456", dateCreated: "06/03/2022", status: "Active", avatar: "https://cdn11.dienmaycholon.vn/filewebdmclnew/public/userupload/files/Image%20FP_2024/avatar-dep-8.jpg", theme: "light" },
            { id: 3, fullName: "Lê Thị Hồng", roles: ["Nurse"], email: "hong.nurse@gmail.com", username: "lethihong", password: "789", dateCreated: "01/12/2021", status: "Suspended", avatar: "https://cdn11.dienmaycholon.vn/filewebdmclnew/public/userupload/files/Image%20FP_2024/avatar-dep-8.jpg", theme: "dark" },
            { id: 4, fullName: "Phạm Minh Tuấn", roles: ["Student"], email: "tuan.student@gmail.com", username: "phamminhtuan", password: "abc", dateCreated: "08/09/2020", status: "Inactive", avatar: "https://cdn11.dienmaycholon.vn/filewebdmclnew/public/userupload/files/Image%20FP_2024/avatar-dep-8.jpg", theme: "light" },
            { id: 5, fullName: "Hoàng Lan", roles: ["Nurse", "Student"], email: "lan.multirole@gmail.com", username: "hoanglan", password: "def", dateCreated: "12/08/2019", status: "Active", avatar: "https://cdn11.dienmaycholon.vn/filewebdmclnew/public/userupload/files/Image%20FP_2024/avatar-dep-8.jpg", theme: "dark" },
            { id: 6, fullName: "Vũ Minh Châu", roles: ["Student"], email: "chau.student@gmail.com", username: "vuminhchau", password: "ghi", dateCreated: "02/05/2021", status: "Active", avatar: "https://cdn11.dienmaycholon.vn/filewebdmclnew/public/userupload/files/Image%20FP_2024/avatar-dep-8.jpg", theme: "light" },
            { id: 7, fullName: "Đặng Quốc Bảo", roles: ["Nurse"], email: "bao.nurse@gmail.com", username: "dangquocbao", password: "jkl", dateCreated: "11/11/2022", status: "Active", avatar: "https://cdn11.dienmaycholon.vn/filewebdmclnew/public/userupload/files/Image%20FP_2024/avatar-dep-8.jpg", theme: "dark" },
            { id: 8, fullName: "Ngô Thị Thu", roles: ["Student"], email: "thu.student@gmail.com", username: "ngothithu", password: "mno", dateCreated: "07/07/2020", status: "Inactive", avatar: "https://cdn11.dienmaycholon.vn/filewebdmclnew/public/userupload/files/Image%20FP_2024/avatar-dep-8.jpg", theme: "light" },
            { id: 9, fullName: "Phan Văn Hùng", roles: ["Nurse"], email: "hung.nurse@gmail.com", username: "phanvanhung", password: "pqr", dateCreated: "03/03/2023", status: "Suspended", avatar: "https://cdn11.dienmaycholon.vn/filewebdmclnew/public/userupload/files/Image%20FP_2024/avatar-dep-8.jpg", theme: "dark" },
            { id: 10, fullName: "Lý Thị Kim", roles: ["Student"], email: "kim.student@gmail.com", username: "lythikim", password: "stu", dateCreated: "09/09/2021", status: "Active", avatar: "https://cdn11.dienmaycholon.vn/filewebdmclnew/public/userupload/files/Image%20FP_2024/avatar-dep-8.jpg", theme: "light" },
            { id: 11, fullName: "Trịnh Văn Sơn", roles: ["Nurse"], email: "son.nurse@gmail.com", username: "trinhvanson", password: "vwx", dateCreated: "05/05/2022", status: "Active", avatar: "https://cdn11.dienmaycholon.vn/filewebdmclnew/public/userupload/files/Image%20FP_2024/avatar-dep-8.jpg", theme: "dark" },
            { id: 12, fullName: "Đỗ Thị Hạnh", roles: ["Student"], email: "hanh.student@gmail.com", username: "dothihanh", password: "yz1", dateCreated: "10/10/2020", status: "Inactive", avatar: "https://cdn11.dienmaycholon.vn/filewebdmclnew/public/userupload/files/Image%20FP_2024/avatar-dep-8.jpg", theme: "light" },
            { id: 13, fullName: "Nguyễn Văn Cường", roles: ["Nurse", "Student"], email: "cuong.multirole@gmail.com", username: "nguyenvancuong", password: "234", dateCreated: "01/01/2019", status: "Active", avatar: "https://cdn11.dienmaycholon.vn/filewebdmclnew/public/userupload/files/Image%20FP_2024/avatar-dep-8.jpg", theme: "dark" },
            { id: 14, fullName: "Phạm Thị Hoa", roles: ["Student"], email: "hoa.student@gmail.com", username: "phamthihoa", password: "567", dateCreated: "12/12/2022", status: "Active", avatar: "https://cdn11.dienmaycholon.vn/filewebdmclnew/public/userupload/files/Image%20FP_2024/avatar-dep-8.jpg", theme: "light" },
            { id: 15, fullName: "Trần Quốc Toàn", roles: ["Nurse"], email: "toan.nurse@gmail.com", username: "tranquoctoan", password: "890", dateCreated: "06/06/2021", status: "Suspended", avatar: "https://cdn11.dienmaycholon.vn/filewebdmclnew/public/userupload/files/Image%20FP_2024/avatar-dep-8.jpg", theme: "dark" },
            { id: 16, fullName: "Lê Thị Bích", roles: ["Student"], email: "bich.student@gmail.com", username: "lethibich", password: "abc1", dateCreated: "03/03/2020", status: "Inactive", avatar: "https://cdn11.dienmaycholon.vn/filewebdmclnew/public/userupload/files/Image%20FP_2024/avatar-dep-8.jpg", theme: "light" },
            { id: 17, fullName: "Hoàng Văn Phúc", roles: ["Nurse", "Student"], email: "phuc.multirole@gmail.com", username: "hoangvanphuc", password: "def2", dateCreated: "08/08/2019", status: "Active", avatar: "https://cdn11.dienmaycholon.vn/filewebdmclnew/public/userupload/files/Image%20FP_2024/avatar-dep-8.jpg", theme: "dark" }
        ];

        setListUser(sampleUsers);
    };


    const handleClickBtnView = (user) => {
        setDataUserView(user);
        if (user.roles.includes("Nurse")) {
            setShowModalNurse(true);
        } else if (user.roles.includes("Student")) {
            setShowModalUser(true);
        }
    };

    return (
        <div className='manage-user-container'>
            <div className='table-user-container'>
                <TableUser
                    listUsers={listUsers}
                    handleClickBtnView={handleClickBtnView}
                    handleClickBtnUpdate={() => {}}
                    handleClickBtnDelete={() => {}}
                />
            </div>

            <ModalNurse
                show={showModalNurse}
                setShow={setShowModalNurse}
                dataUpdate={dataUserView}
            />

            <ModalUser
                show={showModalUser}
                setShow={setShowModalUser}
                dataUpdate={dataUserView}
            />
        </div>
    );
};

export default ManageUser;
