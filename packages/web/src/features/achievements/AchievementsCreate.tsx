import React from 'react';
import { FieldError, SubmitHandler, useForm, UseFormRegisterReturn } from 'react-hook-form';
import { AchievementDto } from '../../common/dtos/achievement-dto';
import { AchievementApi } from './achievement-api';

const AchievementsCreate = (): JSX.Element => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AchievementDto>();
  const achievementApi = new AchievementApi();

  const onSubmit: SubmitHandler<AchievementDto> = (achievement) => {
    achievementApi.create(achievement);
  };

  const textInput = (label: string, register: UseFormRegisterReturn, error: FieldError | undefined) => {
    return (
      <div className="md:flex md:items-center mb-6">
        <div className="md:w-1/3">
          <label className="block text-slate-500 font-bold md:text-right mb-1 md:mb-0 pr-4">{label}</label>
        </div>
        <div className="md:w-2/3">
          <input
            {...register}
            className="bg-slate-200 appearance-none border-2 border-slate-300 rounded w-full py-2 px-4 text-slate-700 leading-tight focus:outline-none focus:bg-white focus:border-slate-500"
          />
          {error?.message && <span className="text-sm text-red-400">{error.message}</span>}
        </div>
      </div>
    );
  };

  const submitButton = (label: string) => {
    return (
      <div className="md:flex md:items-center">
        <div className="md:w-1/3"></div>
        <div className="md:w-2/3">
          <input
            type="submit"
            value={label}
            className="shadow bg-slate-500 hover:bg-slate-600 hover:cursor-pointer focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
          />
        </div>
      </div>
    );
  };

  return (
    <>
      <h1 className="font-sans text-2xl font-bold text-center pb-6">Create Achievement</h1>
      <div className="w-full border-2 border-slate-200 rounded p-6 bg-slate-100">
        <form onSubmit={handleSubmit(onSubmit)}>
          {textInput('Name', register('name', { required: true }), errors.name)}
          {textInput('Description', register('description'), errors.description)}
          {textInput(
            'Points',
            register('achievementPoints', {
              required: true,
              pattern: { value: /^[0-9]+$/, message: 'Points can only be numbers' },
              valueAsNumber: true,
            }),
            errors.achievementPoints
          )}
          {textInput(
            'Cooldown minutes',
            register('cooldownMinutes', {
              required: true,
              pattern: { value: /^[0-9]+$/, message: 'Cooldown minutes can only be numbers' },
              valueAsNumber: true,
            }),
            errors.cooldownMinutes
          )}
          {submitButton('Create')}
        </form>
      </div>
    </>
  );
};

export default AchievementsCreate;
