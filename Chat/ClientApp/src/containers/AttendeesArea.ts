import { connect } from 'react-redux';
import AttendeesArea from '../components/AttendeesArea';
import { State } from '../core/reducers';

const mapStateToProps = (state: State) => ({
  eventAttendees: state.threadMembers.threadMembers
});

export default connect(mapStateToProps)(AttendeesArea);
