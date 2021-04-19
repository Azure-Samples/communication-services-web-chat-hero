import { connect } from 'react-redux';

import ConfigurationScreen from '../components/ConfigurationScreen';
import { addUserToThread, isValidThread } from '../core/sideEffects';

const mapDispatchToProps = (dispatch: any) => ({
  setup: async (displayName: string, emoji: string) => {
    dispatch(addUserToThread(displayName, emoji));
  },
  isValidThread: async (threadId: string) => dispatch(isValidThread(threadId))
});

export default connect(undefined, mapDispatchToProps)(ConfigurationScreen);
