import { Logger } from '@etimo-achievements/common';
import fetch from 'node-fetch';

export const openSlackView = async (view: any) => {
  const response = await fetch('https://slack.com/api/views.open', {
    method: 'POST',
    headers: getSlackHeaders(),
    body: view,
  });

  const content = JSON.parse((await response.json()) as string);
  Logger.log(content);

  return response;
};

export const getSlackHeaders = () => {
  return {
    'Content-type': 'application/json; charset:utf-8',
    Authorization: `Bearer ${process.env['SLACK_ACCESS_TOKEN']}`,
  };
};
