import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { Icon, Menu, Select } from 'semantic-ui-react';
import { version } from '../../package.json';
// import Authentication from '../components/Authentication';
import { setApp, setTrends, signOut } from '../actions';
import { history } from '../history';

const Navbar = (props) => {
  const {
    admin,
    app,
    isSignedIn,
    admin_lockout_message,
    setApp,
    signOut,
    email,
    // trends,
    // setTrends,
  } = props;

  // function trendsAction() {
  //   console.log('trendsAction trends', trends);
  //   setTrends(!trends);
  // }

  const handleGallery = () => {
    history.push('/gallery');
  };

  const handleContact = () => {
    history.push('/contact');
  };

  const handleDash = () => {
    history.push('/');
  };

  const handleAdmin = () => {
    history.push('/admin');
  };

  const handleSignOut = () => {
    console.log('handleSignOut');
    signOut();
    history.push('/signin');
    // history.push('/');
  };

  const handleSignIn = () => {
    console.log('handleSignIn');
    history.push('/signin');
  };

  const RenderAdminButton = () => {
    console.log('admin:', admin);
    if (admin) {
      return (
        <>
          <Menu.Item name="admin" onClick={handleAdmin} />
          {admin_lockout_message ? (
            <Menu.Item>
              <Icon name="lock" />
            </Menu.Item>
          ) : (
            ''
          )}
        </>
      );
    }
    return null;
  };

  const SignMenu = () => {
    if (isSignedIn) {
      return (
        <>
          <Menu.Item name="Sign Out" onClick={handleSignOut} />
        </>
      );
    } else {
      return (
        <>
          <Menu.Item name="Sign In" onClick={handleSignIn} />
        </>
      );
    }
  };

  const Version = () => {
    return (
      <span>
        <small>({version})</small>
      </span>
    );
  };

  const RenderAppSelect = () => {
    const options = ['a0', 'a1', 'a2'].map((it) => {
      const kk = 'covid19/' + it;
      return { key: kk, value: kk, text: kk };
    });
    // { key: 'covid19/a0', value: 'covid19/a0', text: 'covid19/a0' },
    // { key: 'covid19/a1', value: 'covid19/a1', text: 'covid19/a1' },
    // { key: 'covid19/a1', value: 'covid19/a1', text: 'covid19/a1' },
    if (admin) {
      return (
        <Menu.Item>
          <Select
            onChange={(param, data) => {
              setApp(data.value);
            }}
            options={options}
            value={app}
          />
        </Menu.Item>
      );
    }
    return null;
  };

  return (
    <>
      <Menu inverted style={{ borderRadius: '0', marginTop: '0' }}>
        <Menu.Item name="dash" onClick={handleDash}>
          COVID-19 Dashboard &nbsp;
          <Version />
        </Menu.Item>
        {/* <Menu.Item name="trends" onClick={trendsAction}>
          Trends
        </Menu.Item> */}
        {process.env.REACT_APP_C19_CONTACT && (
          <>
            <Menu.Item name="contact" onClick={handleContact}>
              Contact
            </Menu.Item>
            <Menu.Item name="gallery" onClick={handleGallery}>
              Gallery
            </Menu.Item>
          </>
        )}
        {isSignedIn && <RenderAdminButton />}
        <Menu.Menu position="right">
          <RenderAppSelect />
          {email && <Menu.Item>{email}</Menu.Item>}
          <SignMenu />
        </Menu.Menu>
      </Menu>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    admin: state.auth.admin,
    app: state.auth.app,
    email: state.auth.email,
    isSignedIn: state.auth.isSignedIn,
    admin_lockout_message: state.auth.admin_lockout_message,
    trends: state.trends.trends,
  };
};

Navbar.propTypes = {
  showCreateButton: PropTypes.bool,
};

export default connect(mapStateToProps, { setApp, signOut, setTrends })(Navbar);
