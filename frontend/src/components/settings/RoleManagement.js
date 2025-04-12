import React, { useState } from 'react';
import styled from 'styled-components';

const RoleManagement = ({ roles, onAddRole, onEditRole, onDeleteRole }) => {
  const [roleName, setRoleName] = useState('');
  const [permissions, setPermissions] = useState([]);

  const handleAddRole = () => {
    onAddRole({ name: roleName, permissions });
    setRoleName('');
    setPermissions([]);
  };

  return (
    <RoleContainer>
      <h2>Roller</h2>
      <RoleList>
        {roles.map((role) => (
          <RoleItem key={role._id}>
            <span>{role.name}</span>
            <button onClick={() => onEditRole(role)}>Düzenle</button>
            <button onClick={() => onDeleteRole(role._id)}>Sil</button>
          </RoleItem>
        ))}
      </RoleList>
      <AddRoleForm>
        <input
          type="text"
          placeholder="Rol adı"
          value={roleName}
          onChange={(e) => setRoleName(e.target.value)}
        />
        <button onClick={handleAddRole}>Ekle</button>
      </AddRoleForm>
    </RoleContainer>
  );
};

const RoleContainer = styled.div`
  padding: 1rem;
  background-color: #2f3136;
  color: #fff;
`;

const RoleList = styled.ul`
  list-style: none;
  padding: 0;
`;

const RoleItem = styled.li`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
`;

const AddRoleForm = styled.div`
  margin-top: 1rem;
  display: flex;
  gap: 0.5rem;

  input {
    flex: 1;
    padding: 0.5rem;
  }

  button {
    padding: 0.5rem 1rem;
  }
`;

export default RoleManagement;