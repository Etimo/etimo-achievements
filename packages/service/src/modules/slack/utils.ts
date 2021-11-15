import { Logger } from '@etimo-achievements/common';
import fetch from 'node-fetch';

export const openSlackView = async (view: any) => {
  const response = await fetch('https://slack.com/api/views.open', {
    method: 'POST',
    headers: getSlackHeaders(),
    body: view,
  });

  const content = (await response.json()) as any;
  Logger.log(content);
};

export const getSlackHeaders = () => {
  return {
    'Content-type': 'application/json',
    Authorization: `Bearer ${process.env['SLACK_ACCESS_TOKEN']}`,
  };
};
