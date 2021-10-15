import { IAchievement } from '@etimo-achievements/data';
import fetch from 'node-fetch';

export const showModal = async (view: any) => {
  const response = await fetch('https://slack.com/api/views.open', {
    method: 'POST',
    headers: getSlackHeaders(),
    body: view,
  });

  const content = await response.json();
  console.log(content);
};

export const getSlackHeaders = () => {
  return {
    'Content-type': 'application/json',
    Authorization: `Bearer ${process.env['SLACK_ACCESS_TOKEN']}`,
  };
};

export const getAcheivementsListBody = (body: any, achievements: Array<IAchievement>) => {
  return {
    trigger_id: 'trigger_id',
    view: {
      type: 'modal',
      callback_id: 'show-acheivements',
      title: {
        type: 'plain_text',
        text: 'Obama',
        emoji: true,
      },
      close: {
        type: 'plain_text',
        text: 'Cancel',
        emoji: true,
      },
      blocks: [
        {
          type: 'section',
          text: {
            type: 'plain_text',
            text: 'A list of all achievements!',
            emoji: true,
          },
        },
        {
          type: 'divider',
        },
      ],
    },
  };
};
