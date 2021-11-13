export const CreateAchievementModal = {
  trigger_id: '',
  view: {
    type: 'modal',
    title: {
      type: 'plain_text',
      text: 'Etimo Achievements',
      emoji: true,
    },
    submit: {
      type: 'plain_text',
      text: 'Submit',
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
          text: 'Create a new achievement.',
          emoji: true,
        },
      },
      {
        type: 'input',
        element: {
          type: 'plain_text_input',
          action_id: 'plain_text_input-action',
        },
        label: {
          type: 'plain_text',
          text: 'Achievement',
          emoji: true,
        },
      },
      {
        type: 'input',
        element: {
          type: 'plain_text_input',
          multiline: true,
          action_id: 'plain_text_input-action',
        },
        label: {
          type: 'plain_text',
          text: 'Description',
          emoji: true,
        },
      },
    ],
  },
};
