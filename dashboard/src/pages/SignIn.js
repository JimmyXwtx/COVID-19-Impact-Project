import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import {
  Button,
  Form,
  Grid,
  Segment,
  Transition,
  Icon,
  Label,
} from 'semantic-ui-react';
import { connect } from 'react-redux';

import { history } from '../history';
import { signIn } from '../actions';

const SignIn = (props) => {
  const { isSignedIn, loginFailed, lockout_message, admin } = props;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const nlockout_message = lockout_message || '';

  useEffect(() => {
    if (lockout_message && !admin) {
      showFailure(1);
    } else if (isSignedIn) {
      // history.push('/dashboard');
      // history.push('/dash');
      history.push('/');
    }
  }, [isSignedIn, lockout_message, admin]);

  useEffect(() => {
    if (loginFailed) showFailure();
  }, [loginFailed]);

  const handleForm = (e) => {
    e.preventDefault();
    props.signIn(email, password, loginFailed);
  };

  const showFailure = (hold) => {
    setFeedbackVisible(true);
    if (hold) return;
    setTimeout(() => {
      setFeedbackVisible(false);
    }, 3000);
  };

  return (
    <Stage>
      <Grid
        textAlign="center"
        style={{ height: '100vh' }}
        verticalAlign="middle"
      >
        <Grid.Column style={{ maxWidth: 450 }}>
          <Form
            size="large"
            onSubmit={(e) => {
              handleForm(e);
            }}
          >
            <Segment stacked>
              {/* <Brand>
                <Image
                  src={`${process.env.PUBLIC_URL}/ui/DPS_jj_hrz_RGB.svg`}
                />
              </Brand> */}
              <Form.Input
                fluid
                icon="user"
                iconPosition="left"
                placeholder="E-mail address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Form.Input
                fluid
                icon="lock"
                iconPosition="left"
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button primary fluid size="large">
                Sign in
              </Button>
            </Segment>
            <Transition
              visible={feedbackVisible}
              animation="scale"
              duration={500}
            >
              <Label color="red" size="massive">
                <Icon name="thumbs down" /> Login Failed <br />
                {nlockout_message}
              </Label>
            </Transition>
          </Form>
        </Grid.Column>
      </Grid>
    </Stage>
  );
};

const Stage = styled.div`
  background-color: #d5d6d2;
`;

// const Brand = styled.div`
//   background-color: #fff;
//   margin: 0 auto 1.5rem;
//   max-width: 18.125rem;
// `;

const mapStateToProps = (state) => {
  return {
    admin: state.auth.admin,
    isSignedIn: state.auth.isSignedIn,
    loginFailed: state.auth.loginFailed,
    lockout_message: state.auth.lockout_message,
  };
};
export default connect(mapStateToProps, { signIn })(SignIn);
