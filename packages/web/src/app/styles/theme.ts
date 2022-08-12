import { MantineThemeOverride } from '@mantine/core';

export const theme: MantineThemeOverride = {
  fontFamily: 'Segoe UI, sans-serif',
  fontFamilyMonospace: 'Segoe UI, sans-serif',
  components: {
    Select: {
      styles: {
        root: {
          border: 'none',
        },
        wrapper: {
          border: 'none',
        },
        item: {
          fontFamily: 'Segoe UI, sans-serif',
        },
        input: {
          backgroundColor: 'rgb(226 232 240)',
          color: 'rgb(51 65 85)',
          padding: '8px 16px',
          fontSize: '100%',
          border: 'solid 2px rgb(203 213 225)',
          outline: 'none',
          ':focus': {
            backgroundColor: 'white',
            outline: '2px solid transparent',
            outlineOffset: '2px',
            borderColor: 'rgb(100 116 139)',
          },
        },
      },
    },
  },
};
