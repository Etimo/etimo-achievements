import { getClient } from '@etimo-achievements/common';
import React, { useEffect } from 'react';
import { Card, CardRow } from '../../components/cards';
import Header from '../../components/Header';

const UserSettings: React.FC = () => {
  useEffect(() => {
    const getUser = getClient(id!).then(setUser);

    Promise.all([getUser]).finally(() => setLoading(false));
  }, []);

  return (
    <div className="w-1/3 mx-auto">
      <Header>Settings</Header>
      <Card>
        <CardRow label="OAuth2 Client">Hello</CardRow>
      </Card>
    </div>
  );
};

export default UserSettings;
