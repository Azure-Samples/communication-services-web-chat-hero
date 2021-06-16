import { mergeStyles } from '@fluentui/react';

const chatAreaContainerStyle = mergeStyles({
  height: '100%',
  minWidth: '340px',
  borderLeft: '0.063rem solid rgb(221, 221, 221)',
  paddingBottom: '1rem',
  paddingLeft: '1rem',
  paddingRight: '1rem',
  overflow: 'auto'
});

export { chatAreaContainerStyle };
