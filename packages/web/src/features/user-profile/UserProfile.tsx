import { UserDto, uuid } from '@etimo-achievements/common';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useAppSelector } from '../../app/store';
import useRemoveQueryParam from '../../common/hooks/use-remove-query-param';
import { addQueryParam, queryParam } from '../../common/utils/query-helper';
import Avatar from '../../components/Avatar';
import AwardListComponent from '../../components/AwardList/AwardList';
import { EditButton } from '../../components/buttons';
import { Card } from '../../components/cards';
import Header from '../../components/Header';
import PageSpinner from '../../components/PageSpinner';
import RequirePermission from '../../components/RequirePermission';
import { userIdSelector } from '../auth/auth-slice';
import { getSingleUser } from '../users/user-utils';
import UserProfileEditModal from '../users/UserProfileEditModal';

const UserProfile = () => {
  const removeQueryParam = useRemoveQueryParam();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [monitor, setMonitor] = useState<string>(uuid());
  const [user, setUser] = useState<UserDto | undefined>(undefined);

  const authenticatedUserId = useAppSelector(userIdSelector);

  const getEditState = () => queryParam<string>(window.location, 'edit', '');

  useEffect(() => {
    const getUser = getSingleUser(id!).then(setUser);

    Promise.all([getUser]).finally(() => setLoading(false));
  }, []);

  if (loading) return <PageSpinner />;
  else if (!user)
    return (
      <div>
        <Header>User not found</Header>
      </div>
    );

  return (
    <div className="w-2/3 mx-auto">
      <Card className="flex flex-col">
        <div className="w-full flex justify-center p-5 relative">
          {authenticatedUserId === id && (
            <div className="absolute top-0 right-0">
              <RequirePermission update="profile">
                <EditButton
                  id={authenticatedUserId}
                  link={addQueryParam(window.location, 'edit', 'true')}
                  className="float-right px-0 mx-0"
                />
              </RequirePermission>
            </div>
          )}
          <div className="flex items-center">
            <Avatar src={user?.image} size={100} />
            <Header className="pb-0 mx-5">{user?.name}</Header>
          </div>
        </div>
        <div className="flex items-start flex-col last:w-full pb-6">
          <Header>Achievements</Header>
          <AwardListComponent filter={(award) => award.awardedTo.id === id} />
        </div>
        {/* <div className="flex justify-start">
          <Header>Badges</Header>
        </div>
        <div className="flex justify-start">
          <Header>Trophies</Header>
        </div> */}
        {getEditState() && (
          <RequirePermission update="profile">
            <UserProfileEditModal onClose={() => removeQueryParam('edit')} onSubmit={() => setMonitor(uuid())} />
          </RequirePermission>
        )}
      </Card>
    </div>
  );
};

export default UserProfile;
