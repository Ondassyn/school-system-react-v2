/* eslint-disable import/no-named-default, react/destructuring-assignment */

// import packages
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter as Router, Switch } from 'react-router-dom';

// import navbar
import Navbar from '../components/Navbar';

// import routes
import Landing from '../pages/Landing';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import Profile from '../pages/Profile';
import NotFound from '../pages/Not-Found';
import RecoverPassword from '../pages/RecoverPassword';
import ResetPassword from '../pages/ResetPassword';
import TestPage from '../pages/TestPage/TestPage';
import BtsKeys from '../pages/BTS/Keys/Keys';
import BtsResults from '../pages/BTS/Results/Results';
import BtsRatings from '../pages/BTS/Ratings/Ratings';
import BtsMain from '../pages/BTS/Main/Main';
import BtsSettings from '../pages/BTS/Settings/Settings';

// import Spinner
import Spinner from '../components/Spinner';

// import hoc to pass additional props to routes
import PropsRoute from '../pages/PropsRoute';

import { CurrentYear } from '../../api/academicYears/academicYears';
import { SnackbarProvider } from '../../api/notifications/snackbarProvider';
import { DialogProvider } from '../../api/dialogs/dialogProvider';
import { DrawerProvider } from '../../api/drawer/drawerProvider';
import { I18nextProvider } from 'react-i18next';
import i18n from './../../api/localization/i18n';
import Settings from '../pages/Settings/Settings';

const App = props => {
  const [navbarHeight, setNavbarHeight] = useState(0);

  return (
    <I18nextProvider i18n={i18n}>
      <DialogProvider>
        <SnackbarProvider>
          <Router>
            <div>
              <PropsRoute
                component={Navbar}
                {...props}
                setHeight={setNavbarHeight}
              />
              {props.loggingIn && <Spinner />}
              <DrawerProvider navbarHeight={navbarHeight}>
                <Switch>
                  <PropsRoute exact path="/" component={Landing} {...props} />
                  <PropsRoute path="/login" component={Login} {...props} />
                  <PropsRoute path="/signup" component={Signup} {...props} />
                  <PropsRoute
                    exact
                    path="/profile"
                    component={Profile}
                    {...props}
                  />

                  <PropsRoute
                    exact
                    path="/settings"
                    component={Settings}
                    {...props}
                  />
                  <PropsRoute
                    exact
                    path="/bts"
                    component={BtsMain}
                    {...props}
                  />
                  <PropsRoute
                    exact
                    path="/test_page"
                    component={TestPage}
                    {...props}
                  />
                  <PropsRoute
                    exact
                    path="/bts/keys"
                    component={BtsKeys}
                    {...props}
                  />
                  <PropsRoute
                    exact
                    path="/bts/results"
                    component={BtsResults}
                    {...props}
                  />
                  <PropsRoute
                    exact
                    path="/bts/ratings"
                    component={BtsRatings}
                    {...props}
                  />

                  <PropsRoute
                    exact
                    path="/bts/settings"
                    component={BtsSettings}
                    {...props}
                  />

                  <PropsRoute
                    exact
                    path="/profile/:_id"
                    component={Profile}
                    {...props}
                  />
                  <PropsRoute
                    path="/recover-password"
                    component={RecoverPassword}
                    {...props}
                  />
                  <PropsRoute
                    path="/reset-password/:token"
                    component={ResetPassword}
                    {...props}
                  />
                  <PropsRoute component={NotFound} {...props} />
                </Switch>
              </DrawerProvider>
            </div>
          </Router>
        </SnackbarProvider>
      </DialogProvider>
    </I18nextProvider>
  );
};

App.propTypes = {
  loggingIn: PropTypes.bool.isRequired,
  userReady: PropTypes.bool.isRequired,
  loggedIn: PropTypes.bool.isRequired,
  currentYear: PropTypes.string.isRequired,
};

export default withTracker(() => {
  const userSub = Meteor.subscribe('user');
  const user = Meteor.user();
  const userReady = userSub.ready() && !!user;
  const loggingIn = Meteor.loggingIn();
  const loggedIn = !loggingIn && userReady;
  const currentYear = CurrentYear;
  const rolesSub = Meteor.subscribe('roles.all');

  return {
    loggingIn,
    userReady,
    loggedIn,
    currentYear,
    i18n,
  };
})(App);
