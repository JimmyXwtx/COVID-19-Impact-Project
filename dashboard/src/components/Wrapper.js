import React from 'react';
import { Route, Router, Switch } from 'react-router-dom';
import { Normalize } from 'styled-normalize';
import { history } from '../history';
import Admin from '../pages/Admin';
import Contact from '../pages/Contact';
import Dashboard from '../pages/Dashboard';
import Gallery from '../pages/Gallery';
import NotFound from '../pages/NotFound';
import SignIn from '../pages/SignIn';
import GlobalStyle from '../styles/GlobalStyle';
import Navbar from './Navbar';
import ScrollToTop from './ScrollToTop';

const Wrapper = () => (
  <>
    <Normalize />
    <GlobalStyle />
    <Router history={history} basename="/covid19-dashboard">
      <ScrollToTop>
        <Navbar />
        <Switch>
          <Route path="/signin" exact component={SignIn} />
          {/*  
            <Route path="/wp/edit/:id" exact component={WPEdit} /> 
            <Route path="/wp/duplicate/:id" exact component={WPDup} />  
            */}
          <Route path="/gallery" exact component={Gallery} />
          <Route path="/contact" exact component={Contact} />
          <Route path="/admin" exact component={Admin} />
          <Route path="/" exact component={Dashboard} />
          <Route component={NotFound} />
        </Switch>
      </ScrollToTop>
    </Router>
  </>
);

export default Wrapper;
