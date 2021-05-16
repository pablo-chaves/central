/* eslint-disable no-shadow */
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { deleteUser, getAdminUsersData, getPanelFilteredProperties } from '../../../../Redux/Actions/index';
import TablePage from '../../TablePage/TablePage';

function PostsAdmin({
  panelAdmin, getAdminData, deleteUser, getPanelFilteredProperties,
}) {
  const {
    render, count, currentPage, selfEndpoint,
  } = panelAdmin;
  const { users } = render;
  useEffect(() => {
    getAdminData();
  }, []);
  const list = () => {
    const data = [];
    users?.forEach((e) => {
      data.push({
        column1: e.email,
        displayLink: true,
        link: e.userId,
        column2: e.name,
        column3: e.phone,
        id: e.id,
      });
    });
    return data;
  };
  return (
    <div>
      <TablePage
        tableName="users"
        columns={['E-mail', 'User name', 'Phone']}
        data={list()}
        path="user"
        buttonPath="user"
        count={count}
        paginaActual={currentPage}
        limit={10}
        functionNext={getPanelFilteredProperties}
        self={selfEndpoint}
        pagsPath="/panel/admin/users"
        deleteAction={deleteUser}/// arreglar!!!
      />
    </div>
  );
}
const mapStateToProps = (state) => ({
  panelAdmin: state.panelAdmin,
});

const mapDispatchToProps = (dispatch) => ({
  deleteUser: () => dispatch(deleteUser()),
  getAdminData: () => dispatch(getAdminUsersData()),
  getPanelFilteredProperties: () => dispatch(getPanelFilteredProperties()),
});

export default connect(mapStateToProps, mapDispatchToProps)(PostsAdmin);
