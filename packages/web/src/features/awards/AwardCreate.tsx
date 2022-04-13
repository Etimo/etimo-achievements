import { AwardDto } from '@etimo-achievements/common';
import React, { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import Header from '../../components/Header';
import { AwardApi } from './award-api';

const AwardsCreate: React.FC = () => {
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<AwardDto>();
  const [loading, setLoading] = useState(false);
  const awardApi = new AwardApi();

  const onSubmit: SubmitHandler<AwardDto> = (award) => {
    setLoading(true);
    awardApi
      .create(award)
      .wait()
      .then((response) => {
        setLoading(false);
        if (response.success) {
          reset();
          toast.success('Award created successfully.');
        } else {
          toast.error('Award could not be created: ' + response.message);
        }
      });
  };

  return (
    <div className="w-1/3 mx-auto">
      <Header>Create Award</Header>
    </div>
  );
};

export default AwardsCreate;
