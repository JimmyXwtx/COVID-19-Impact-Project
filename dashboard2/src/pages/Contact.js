import React, { useState } from 'react';
import { connect } from 'react-redux';
// import styled from 'styled-components';
import {
  Button,
  Container,
  Form,
  Grid,
  Message,
  Segment,
  Transition,
} from 'semantic-ui-react';
import uuid from 'uuid';
import { submitContact } from '../actions';
import useInterval from '../hooks/useInterval';
import useLocalStorage from '../hooks/useLocalStorage';

// import { history } from '../history';

function getDateTime() {
  return new Date().toISOString();
}

const Contact = (props) => {
  const { submitContact } = props;
  const [loaderActive, setLoaderActive] = useState(false);
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState();
  const [contactNameError, setContactNameError] = useState();
  const [message, setMessage] = useState('');
  const [feedbackText, setFeedbackText] = useState('');
  const [token, setToken] = useLocalStorage('co-token');

  useInterval(
    () => {
      // console.log('useInterval playIndex', playIndex, 'isLoading', isLoading);
      setFeedbackText('');
    },
    feedbackText ? 3000 : null
  );

  const validateForm = () => {
    if (!contactName) {
      setContactNameError({
        content: 'Please enter a name',
        pointing: 'below',
      });
      return false;
    } else {
      setContactNameError(null);
    }
    if (email && email.indexOf('@') < 0) {
      // setEmailError('Invalid email');
      setEmailError({
        content: 'Please enter a valid email address',
        pointing: 'below',
      });
      return false;
    } else {
      setEmailError(null);
    }
    return true;
  };

  const handleForm = async (event) => {
    // console.log('handleForm event', event);
    event.preventDefault();
    if (!validateForm) return;
    setLoaderActive(true);
    const created = getDateTime();
    const opt = { email, contactName, message, created, token };
    if (token) {
      // Server issued token is returned to server for id tracking and throttling
      opt.token = token;
    } else {
      // No token, ask server for one
      const uid = uuid.v4();
      const resp = await submitContact({ uid });
      if (resp.token) {
        opt.token = resp.token;
        setToken(opt.token);
      } else {
        const msg = resp.msg || 'Submit Contact missing token';
        setFeedbackText(msg);
        setLoaderActive(false);
        return;
      }
    }
    const resp = await submitContact(opt);
    const msg = resp.msg || 'Submit Contact Error';
    setFeedbackText(msg);
    setLoaderActive(false);
  };

  return (
    // <Stage>
    <Container style={{ marginTop: '3rem' }}>
      {/* <Loader active={loaderActive} inline></Loader> */}
      <Grid
      // textAlign="center"
      // style={{ height: '100vh' }}
      // verticalAlign="middle"
      >
        <Grid.Column>
          {/* <h3>Fill out to provide message or give feedback.</h3> */}
          {/* <Grid.Column style={{ maxWidth: 450, leftPadding: 40 }}> */}
          {/* <Grid.Column> */}
          <Form onSubmit={handleForm}>
            <Segment stacked style={{ backgroundColor: '#d5d6d2' }}>
              <Form.Input
                fluid
                // iconPosition="left"
                label="Name"
                placeholder="name"
                value={contactName}
                error={contactNameError}
                onChange={(evt) => setContactName(evt.target.value)}
              />
              <Form.Input
                fluid
                // icon="user"
                // iconPosition="left"
                label="E-mail address"
                placeholder="E-mail address"
                value={email}
                onChange={(evt) => setEmail(evt.target.value)}
                error={emailError}
                // error={{
                //   content: 'Please enter a valid email address',
                //   pointing: 'below',
                // }}
              />
              <Form.TextArea
                label="Message"
                placeholder="Message..."
                value={message}
                onChange={(evt) => setMessage(evt.target.value)}
              />
              <Transition
                visible={feedbackText !== ''}
                animation="scale"
                duration={500}
              >
                <Message success header={feedbackText} content="" />
              </Transition>
              <Button primary loading={loaderActive}>
                Submit
              </Button>
            </Segment>
          </Form>
        </Grid.Column>
        {/* <Grid.Column></Grid.Column> */}
      </Grid>
    </Container>
    //{' '}
    // </Stage>
  );
};

// const Stage = styled.div`
//   background-color: #d5d6d2;
// `;

// const Brand = styled.div`
//   background-color: #fff;
//   margin: 0 auto 1.5rem;
//   max-width: 18.125rem;
// `;

const mapStateToProps = (state) => {
  return {
    admin: state.auth.admin,
  };
};
// export default connect(mapStateToProps, { signIn })(Contact);
export default connect(mapStateToProps, { submitContact })(Contact);
