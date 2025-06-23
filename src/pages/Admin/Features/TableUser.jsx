import React, { useState } from "react";
import ReactPaginate from "react-paginate";
import './TableUser.css';

const TableUser = ({
  listUsers,
  handleClickBtnUpdate,
  handleClickBtnView,
  handleClickBtnDelete,
  handleManageStudent,
  handleManageNurse,
  handleManageAccount
}) => {
  const itemsPerPage = 6;
  const [itemOffset, setItemOffset] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchField, setSearchField] = useState("fullName");
  const [roleFilter, setRoleFilter] = useState("");


  const filteredUsers = listUsers.filter( user => {
    const searchValue = user[searchField]?.toString().toLowerCase() || "";
    const matchesSearch = searchQuery ? searchValue.includes(searchQuery.toLowerCase()) : true;
    const matchesRole = roleFilter ? user.roles?.includes(roleFilter) : true;
    return matchesRole && matchesSearch;
  })


  const endOffset = itemOffset + itemsPerPage;
  const currentUsers = filteredUsers.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(filteredUsers.length / itemsPerPage);

  const handlePageClick = (event) => {
    const newOffset = event.selected * itemsPerPage;
    setItemOffset(newOffset);
  };

  // Handle management button clicks
  const handleStudentClick = () => {
    setRoleFilter("Student");
    setItemOffset(0); // Reset pagination
    handleManageStudent();
  };

  const handleNurseClick = () => {
    setRoleFilter("Nurse");
    setItemOffset(0); // Reset pagination
    handleManageNurse();
  };

  const handleAccountClick = () => {
    setRoleFilter(""); // Clear role filter to show all accounts
    setItemOffset(0); // Reset pagination
    handleManageAccount();
  };

  return (
    <>
      <div className="card">
        <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <h5 className="mb-0 me-3">User Management</h5>
            <select
              className="form-select me-2"
              value={searchField}
              onChange={(e) => setSearchField(e.target.value)}
              style={{ maxWidth: "100px", fontSize: "0.9rem", padding: "0.2rem 0.5rem" }}
            >
              <option value="fullName">Name</option>
              <option value="roles">Role</option>
              <option value="status">Status</option>
              <option value="dateCreated">Date Created</option>
            </select>
            <input
              type="text"
              className="form-control"
              placeholder={`Search by ${searchField}...`}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setItemOffset(0); // Reset pagination on search
              }}
              style={{ maxWidth: "200px", fontSize: "0.9rem", padding: "0.2rem 0.5rem" }}
            />
          </div>
          <div className="d-flex gap-2">
            <button
              className="btn btn-light btn-sm square-btn me-2"
              style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
              onClick={handleStudentClick}
            >
              <i className="fa fa-user-graduate" aria-hidden="true"></i> Manage Student
            </button>
            <button
              className="btn btn-light btn-sm square-btn me-2"
              style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
              onClick={handleNurseClick}
            >
              <i className="fa fa-user-md" aria-hidden="true"></i> Manage Nurse
            </button>
            <button
              className="btn btn-light btn-sm square-btn me-2"
              style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
              onClick={handleAccountClick}
            >
              <i className="fa fa-user-cog" aria-hidden="true"></i> Manage Account
            </button>
            <button
              className="btn btn-light btn-sm square-btn me-2"
              style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
            >
              <i className="fa fa-plus-circle" aria-hidden="true"></i> Create User
            </button>
          </div>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover table-bordered align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th scope="col" className="col-1 text-center">#</th>
                  <th scope="col" className="col-3 text-center">Name</th>
                  <th scope="col" className="col-2">Date Created</th>
                  <th scope="col" className="col-2">Role</th>
                  <th scope="col" className="col-2">Status</th>
                  <th scope="col" className="col-2 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.length > 0 ? (
                  currentUsers.map((item, index) => (
                    <tr key={`table-user-${item.id || index}`}>
                      <td className="text-center">{itemOffset + index + 1}</td>
                      <td className="text-center">
                        <div className="d-flex align-items-center">
                          <img
                            src={item.avatar || "https://via.placeholder.com/40"}
                            alt="avatar"
                            className="rounded-circle me-2"
                            style={{ width: "40px", height: "40px" }}
                          />
                          {item.fullName || "N/A"}
                        </div>
                      </td>
                      <td>{item.dateCreated || "N/A"}</td>
                      <td>{item.roles ? item.roles.join(", ") : "N/A"}</td>
                      <td>
                        <span
                          className={`badge rounded-pill ${
                            item.status === "Active"
                              ? "bg-success"
                              : item.status === "Suspended"
                              ? "bg-danger"
                              : "bg-warning"
                          }`}
                        >
                          {item.status || "N/A"}
                        </span>
                      </td>
                      <td className="text-center">
                        <div className="d-flex gap-2 justify-content-center" role="group" aria-label="Action buttons">
                          <button
                            onClick={() => handleClickBtnView(item)}
                            className="btn btn-sm rounded-circle"
                            style={{ backgroundColor: '#28a745', color: '#ffffff' }}
                            title="View"
                          >
                            <i className="fas fa-eye"></i>
                          </button>
                          <button
                            onClick={() => handleClickBtnUpdate(item)}
                            className="btn btn-sm btn-outline-primary rounded-circle"
                            title="Edit"
                          >
                            <i className="fas fa-cog"></i>
                          </button>
                          <button
                            onClick={() => handleClickBtnDelete(item.id)}
                            className="btn btn-sm btn-outline-danger rounded-circle"
                            title="Delete"
                          >
                            <i className="fas fa-trash-alt"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center">
                      No data
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="card-footer d-flex justify-content-between align-items-center">
          <span>
            Showing {currentUsers.length} out of {filteredUsers.length} entries
          </span>
          {pageCount > 1 && (
            <ReactPaginate
              breakLabel="..."
              nextLabel="Next"
              onPageChange={handlePageClick}
              pageRangeDisplayed={3}
              pageCount={pageCount}
              previousLabel="Previous"
              containerClassName="pagination mb-0"
              pageClassName="page-item"
              pageLinkClassName="page-link"
              previousClassName="page-item"
              previousLinkClassName="page-link"
              nextClassName="page-item"
              nextLinkClassName="page-link"
              activeClassName="active"
            />
          )}
        </div>
      </div>
    </>
  );
};

export default TableUser;