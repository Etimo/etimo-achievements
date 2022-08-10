import { UserDto, uuid } from '@etimo-achievements/common';
import React, { useEffect, useState } from 'react';
import useRemoveQueryParam from '../../common/hooks/use-remove-query-param';
import { addQueryParam, queryParam } from '../../common/utils/query-helper';
import Avatar from '../../components/Avatar';
import { EditButton } from '../../components/buttons';
import { Card, CardRow } from '../../components/cards';
import Header from '../../components/Header';
import RequirePermission from '../../components/RequirePermission';
import { getMyUser } from './user-utils';
import UserProfileEditModal from './UserProfileEditModal';

const UserProfile: React.FC = () => {
  const removeQueryParam = useRemoveQueryParam();
  const [monitor, setMonitor] = useState(uuid());
  const [profile, setProfile] = useState<UserDto>();

  const getEditState = () => queryParam<string>(window.location, 'edit', '');

  useEffect(() => {
    getMyUser().then(setProfile);
  }, [monitor]);

  if (!profile) return null;

  return (
    <div className="w-1/3 mx-auto">
      <Header>Profile</Header>
      <Card>
        <div className="flex justify-center mb-10">
          <Avatar src={profile.image} size={100} />
        </div>
        <div className="relative">
          <RequirePermission update="profile">
            <EditButton
              id={profile.id}
              link={addQueryParam(window.location, 'edit', 'true')}
              className="float-right px-0 mx-0"
            />
          </RequirePermission>
        </div>
        <CardRow label="Name">{profile.name}</CardRow>
        <CardRow label="E-mail">{profile.email}</CardRow>
        <CardRow label="Slack handle">{profile.slackHandle}</CardRow>
      </Card>
      {getEditState() && (
        <RequirePermission update="profile">
          <UserProfileEditModal onClose={() => removeQueryParam('edit')} onSubmit={() => setMonitor(uuid())} />
        </RequirePermission>
      )}
    </div>
  );
};

export default UserProfile;
