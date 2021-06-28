import { connect } from 'react-redux';

import MainArea from '../components/MainArea';
import { AcsRoom, setRoomId } from '../core/actions/EventAction';
import { getRooms, resetMessages } from '../core/sideEffects';

const mapDispatchToProps = (dispatch: any) => ({
  resetMessages: () => {
    dispatch(resetMessages());
  },
  getRooms: (): Record<string, AcsRoom> => dispatch(getRooms()),
  setActiveRoom: (roomId: string) => {
    dispatch(setRoomId(roomId));
  }
});

export default connect(undefined, mapDispatchToProps)(MainArea);
