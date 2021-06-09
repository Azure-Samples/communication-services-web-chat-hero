import { connect } from 'react-redux';

import Room from '../components/Room';
import { createThread } from '../core/sideEffects';

const mapStateToProps = () => ({
    createThreadHandler: () => {
        createThread();
    }
});

export default connect(mapStateToProps)(Room);
