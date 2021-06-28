import { connect } from 'react-redux';

import ChatScreen from '../components/ChatScreen';
import { State } from '../core/reducers';
import { setRoomThreadId, addUserToRoomThread } from '../core/sideEffects';

const mapStateToProps = (state: State) => ({
  isRemoved: state.threadMembers.isRemoved,
  hasThreadId: !!state.thread.threadId
});

const mapDispatchToProps = (dispatch: any) => ({
  setRoomThreadId: async (roomId: string) => dispatch(setRoomThreadId(roomId)),
  setupRoom: async () => {
    dispatch(addUserToRoomThread());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(ChatScreen);
