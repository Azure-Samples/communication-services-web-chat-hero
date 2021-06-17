import { connect } from 'react-redux';

import MainArea from '../components/MainArea';
import { resetMessages } from '../core/sideEffects';

const mapDispatchToProps = (dispatch: any) => ({
  resetMessages: () => {
    dispatch(resetMessages());
  }
});

export default connect(undefined, mapDispatchToProps)(MainArea);
