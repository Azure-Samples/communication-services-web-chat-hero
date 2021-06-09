import { mergeStyles } from '@fluentui/react';

const streamMainStyle = mergeStyles({
  height: '100%',
  width: '100%',
  maxHeight: '100%',
  background: '#d2d0ce',
  overflow: 'auto',
  display: 'flex',
  justifyContent: 'space-around',
  flexDirection: 'column',
  alignItems: 'center'
});

const streamTextStyle = mergeStyles({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-evenly',
  alignItems: 'center',
})

const streamIconStyle = mergeStyles({
  fontSize: '2rem'
})

export {
  streamMainStyle,
  streamTextStyle,
  streamIconStyle
};
