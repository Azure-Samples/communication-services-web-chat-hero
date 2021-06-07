import { mergeStyles } from '@fluentui/react';

const chatScreenContainerStyle = mergeStyles({
  height: '100%',
  width: '100%'
});

const chatScreenBottomContainerStyle = mergeStyles({
  height: '100%',
  width: '100%',
  maxHeight: '100%',
  overflow: 'auto'
});

const leftPaneStyle = mergeStyles({
  height: '100%',
  minWidth: "55px",
  maxWidth: '7%',
  maxHeight: '100%',
  overflow: 'auto'
});

const paneButtonStyle = mergeStyles({
  width: "50px",
  minWidth: "50px",
  minHeight: "50px",
  padding: "5px",
  fontSize: "large",
  border: 'none'
});

const staticAreaStyle = mergeStyles({
  height: '100%',
  width: '100%',
  maxHeight: '100%',
  background: '#f7f8fa',
  padding: '32px 28px',
  overflow: 'auto'
});

const staticImageStyle = mergeStyles({
  height: "316px",
  width: "100%"
});

export { paneButtonStyle, staticImageStyle, chatScreenContainerStyle, chatScreenBottomContainerStyle, staticAreaStyle, leftPaneStyle };
