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
          fontSize: '16px',
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
    MultiSelect: {
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
        searchInput: {
          fontSize: '16px',
          margin: '0',
          padding: '0',
        },
        values: {
          padding: '0 16px',
          margin: '0',
        },
        input: {
          padding: '0',
          backgroundColor: 'rgb(226 232 240)',
          color: 'rgb(51 65 85)',
          border: 'solid 2px rgb(203 213 225)',
          outline: 'none',
          ':focus-within': {
            backgroundColor: 'white',
            border: '2px solid rgb(203 213 225)',
            outlineOffset: '2px',
            borderColor: 'rgb(100 116 139)',
          },
        },
      },
    },
  },
};
