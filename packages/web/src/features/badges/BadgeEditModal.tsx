import { BadgeDto, updateBadge } from '@etimo-achievements/common';
import React, { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toastResponse } from '../../common/utils/toast-response';
import { Form, FormSubmitButton, FormTextInput } from '../../components/form';
import Modal from '../../components/Modal';
import { getSingleBadge } from './badge-utils';

type Props = {
  badgeId: string;
  onClose: () => void;
  onSubmit: () => void;
};

const BadgeEditModal: React.FC<Props> = ({ badgeId, onClose, onSubmit }) => {
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<BadgeDto>();
  const [loading, setLoading] = useState(false);
  const [badge, setBadge] = useState<BadgeDto>();

  useEffect(() => {
    getSingleBadge(badgeId).then(setBadge);
  }, []);

  const onSubmitForm: SubmitHandler<BadgeDto> = async (updatedBadge) => {
    setLoading(true);
    const response = await updateBadge(badgeId, updatedBadge).wait();
    setLoading(false);
    toastResponse(response, 'Badge edited successfully', 'Badge could not be updated', () => {
      reset();
      onSubmit();
      setTimeout(onClose, 1);
    });
  };

  return badge ? (
    <Modal title="Edit Badge" showModal={true} onRequestClose={onClose}>
      <Form onSubmit={handleSubmit(onSubmitForm)}>
        <FormTextInput
          label="Name"
          defaultValue={badge.name}
          register={register('name', { required: true, maxLength: 255 })}
          error={errors.name}
        />
        <FormTextInput
          label="Description"
          defaultValue={badge.description}
          register={register('description', { required: true, maxLength: 255 })}
          error={errors.description}
        />
        <FormSubmitButton label="Update" loading={loading} />
      </Form>
    </Modal>
  ) : null;
};

export default BadgeEditModal;
