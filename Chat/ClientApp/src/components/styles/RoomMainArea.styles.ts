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

const callAreaStyle = mergeStyles({
  width: '75%',
  maxHeight: '30%',
  margin: '30px auto',
  display: 'flex',
  justifyContent: 'center',
});

const joinCallButtonStyle = mergeStyles({
  fontWeight: 600,
  fontSize: '0.875rem', // 14px
  width: 'fit-content',
  height: '2.5rem',
  borderRadius: 3,
  selectors: {
    '@media (max-width: 53.438rem)': {
      padding: '0.625rem'
    }
  }
});

const joinCallTextStyle = mergeStyles({
  fontSize: '0.875rem' // 14px
});


export {
  backButtonStyle,
  calendarIconStyle,
  headerTextStyle,
  roomMainAreaStackStyles,
  timeIconStyle,
  joinCallButtonStyle,
  callAreaStyle,
  joinCallTextStyle,
};
