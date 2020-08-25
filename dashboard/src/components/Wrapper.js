import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import { Normalize } from 'styled-normalize';
import GlobalStyle from '../styles/GlobalStyle';

import { history } from '../history';
import ScrollToTop from './ScrollToTop';
import Navbar from './Navbar';

import Admin from '../pages/Admin';
import Graph from '../pages/Graph';
import NotFound from '../pages/NotFound';
import SignIn from '../pages/SignIn';
import Contact from '../pages/Contact';
import Gallery from '../pages/Gallery';

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
          <Route path="/" exact component={Graph} />
          <Route component={NotFound} />
        </Switch>
      </ScrollToTop>
    </Router>
  </>
);

export default Wrapper;
