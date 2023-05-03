import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Header } from 'semantic-ui-react';

const NotFound = () => (
  <>
    <Container style={{ marginTop: '3rem' }}>
      <Header as="h1">Page Not Found</Header>
      <p>
        The page you're looking for does not exist. Would you like to{' '}
        <Link to="/">return to the dashboard</Link>?
      </p>
    </Container>
  </>
);

export default NotFound;
