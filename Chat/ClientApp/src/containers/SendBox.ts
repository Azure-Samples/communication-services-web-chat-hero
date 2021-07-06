import { connect } from 'react-redux';
import { Dispatch } from 'react';

import SendBox from '../components/SendBox';
import { sendMessage, sendTypingNotification } from '../core/sideEffects';
import { Constants } from '../core/constants';
import { State } from '../core/reducers';

const mapStateToProps = (state: State) => ({
  user: state.contosoClient.user
});

const mapDispatchToProps = (dispatch: any) => ({
  onSendMessage: (messageContent: string) => dispatch(sendMessage(messageContent)),
  onSendTypingNotification: (
    lastSentTypingNotificationDate: number,
    setLastSentTypingNotificationDate: Dispatch<number>
  ) => {
    let currentDate = new Date();
    let timeSinceLastSentTypingNotificationMs = currentDate.getTime() - lastSentTypingNotificationDate;
    if (timeSinceLastSentTypingNotificationMs >= Constants.MINIMUM_TYPING_INTERVAL_IN_MILLISECONDS) {
      dispatch(sendTypingNotification());
      setLastSentTypingNotificationDate(currentDate.getTime());
    }
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(SendBox);
