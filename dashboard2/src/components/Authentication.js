import { useEffect } from 'react';
import { connect } from 'react-redux';

import { signOut } from '../actions';
import { history } from '../history';

const Authentication = props => {
  useEffect(() => {
    if (!props.isSignedIn) {
      props.signOut();
      history.push('/');
    }
  });

  return null;
};

const mapStateToProps = state => {
  return {
    isSignedIn: state.auth.isSignedIn,
  };
};

export default connect(mapStateToProps, { signOut })(Authentication);
