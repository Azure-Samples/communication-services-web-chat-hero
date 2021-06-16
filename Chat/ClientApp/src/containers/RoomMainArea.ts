import { connect } from 'react-redux';

import RoomMainArea from '../components/RoomMainArea';
import { State } from '../core/reducers/index';
import { addUserToRoomThread, setRoomThreadId, removeThreadMemberByUserId } from '../core/sideEffects';

export type RoomMainAreaProps = {
  userId: string;
};

const mapDispatchToProps = (dispatch: any) => ({
  setupRoom: async () => {
    dispatch(addUserToRoomThread());
  },
  setRoomThreadId: async (roomId: string) => dispatch(setRoomThreadId(roomId)),
  removeChatParticipantById: (userId: string) => dispatch(removeThreadMemberByUserId(userId))
});

const mapStateToProps = (state: State): RoomMainAreaProps => ({
  userId: state.contosoClient.user.identity
});

export default connect(mapStateToProps, mapDispatchToProps)(RoomMainArea);
