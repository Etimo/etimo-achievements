import { RoleDto, updateUser, UserDto } from '@etimo-achievements/common';
import { Role } from '@etimo-achievements/types';
import React, { useEffect, useMemo, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useAppSelector } from '../../app/store';
import { toastResponse } from '../../common/utils/toast-response';
import { CardRow } from '../../components/cards';
import { Form, FormSelectRow, FormSubmitButton, FormTextInput } from '../../components/form';
import Modal from '../../components/Modal';
import RequirePermission from '../../components/RequirePermission';
import { userIdSelector } from '../auth/auth-slice';
import { getSingleUser } from './user-utils';

type Props = {
  userId: string;
  onClose: () => void;
  onSubmit: () => void;
  roles: RoleDto[];
};

const UserEditModal: React.FC<Props> = ({ userId, onClose, onSubmit, roles }) => {
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<UserDto>();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<UserDto>();
  const [role, setRole] = useState<Role | undefined>();
  const authenticatedUser = useAppSelector(userIdSelector);

  useEffect(() => {
    getSingleUser(userId).then((user) => {
      setUser(user);
      setRole(user?.role);
    });
  }, []);

  const onSubmitForm: SubmitHandler<UserDto> = async (updatedUser) => {
    setLoading(true);
    const response = await updateUser(userId, { ...updatedUser, role: role as Role }).wait();
    toastResponse(response, 'User edited successfully', 'User could not be updated', () => {
      reset();
      onSubmit();
      setTimeout(onClose, 1);
    });
    setLoading(false);
  };

  const mappedRoles = useMemo(() => {
    return roles.map((r) => ({ label: r.name, value: r.key, subtitle: r.description }));
  }, [roles]);

  return user ? (
    <RequirePermission update="users">
      <Modal title="Edit User" showModal={true} onRequestClose={onClose}>
        <Form onSubmit={handleSubmit(onSubmitForm)}>
          <FormTextInput
            label="Name"
            defaultValue={user.name}
            register={register('name', { required: true, maxLength: 255 })}
            error={errors.name}
          />
          <FormTextInput
            label="E-mail"
            defaultValue={user.email}
            register={register('email', { required: true, maxLength: 255 })}
            error={errors.email}
          />
          <FormSelectRow
            label="Role"
            onChange={setRole}
            options={mappedRoles}
            nothingFound="No roles found"
            value={role}
            type="multiline"
          />
          {user.role !== role && authenticatedUser == user.id && (
            <CardRow>
              <span className="text-red-500">You are about to change your own role. Are you sure?</span>
            </CardRow>
          )}
          <FormSubmitButton label="Update" loading={loading} />
        </Form>
      </Modal>
    </RequirePermission>
  ) : null;
};

export default UserEditModal;
