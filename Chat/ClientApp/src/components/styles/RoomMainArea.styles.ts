import { IStackStyles, IStackTokens, mergeStyles } from '@fluentui/react';

const backButtonStyle = mergeStyles({
  fontSize: '15px',
  color: '#0078d4',
});

const calendarIconStyle = mergeStyles({
  fontSize: '18px',
  paddingRight: '5px',
});

const timeIconStyle = mergeStyles({
  fontSize: '20px',
  paddingRight: '5px',
  marginTop: '16.38px',
});

const headerTextStyle = mergeStyles({
  paddingRight: '40px',
});

const roomMainAreaStackStyles: IStackStyles = {
  root: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row', 
  },
}


export {
  backButtonStyle,
  calendarIconStyle,
  headerTextStyle,
  roomMainAreaStackStyles,
  timeIconStyle,
};
