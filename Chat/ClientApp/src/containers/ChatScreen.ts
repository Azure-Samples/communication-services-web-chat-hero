import { connect } from 'react-redux';

import ChatScreen from '../components/ChatScreen';
import { State } from '../core/reducers';

const mapStateToProps = (state: State) => ({
  isRemoved: state.threadMembers.isRemoved
});

export default connect(mapStateToProps)(ChatScreen);
