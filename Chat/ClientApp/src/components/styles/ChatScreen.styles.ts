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
  backgroundImage: 'url("https://by6atq.dm.files.1drv.com/y4pNYmywUwShGjLKVSQ9F8f_rdmCvPdFzVyn4GbLnzsDHmQMINQ_sjsbez4am8iGl1jFBURSlKxHQnd-eFcE-BASwp0iSUAhJlo8Tv5wEqWhi0_I7i6YBuHOEwrvjwL3_u2EQajEKi8szo4_3Lzui2UXLYJx3L6qAlwqfLWQiP3v3rlvghd_p0OEdk3n3GErbyBc-20fRCv_ToaALEdC8LvYA/default.png?psid=1");',
  width: "100%"
});

export { paneButtonStyle, staticImageStyle, chatScreenContainerStyle, chatScreenBottomContainerStyle, staticAreaStyle, leftPaneStyle };
