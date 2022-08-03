import { syncSlack } from '@etimo-achievements/common';
import React, { useState } from 'react';
import { toastResponse } from '../../common/utils/toast-response';
import { Form, FormSubmitButton } from '../../components/form';
import Header from '../../components/Header';

const UserSlackSync: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    const response = await syncSlack().wait();
    toastResponse(response, 'Database synced successfully', 'Could not sync');
    setLoading(false);
  };

  return (
    <div className="w-1/3 mx-auto">
      <Header>Manual Slack Sync</Header>
      <Form onSubmit={(e) => onSubmit(e)}>
        <p className="pb-5">
          Sync Slack-uids with the slack handle field in the user database. This makes it possible for the system to tag
          people in Slack messages. Synchronization is automatically performed upon user creation.
        </p>
        <FormSubmitButton label="Sync" loading={loading} />
      </Form>
    </div>
  );
};

export default UserSlackSync;
