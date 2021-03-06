import { Meteor } from 'meteor/meteor';
import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

import './Navbar.scss';

const PublicNav = () => [
  <li key="login" className="nav-item">
    <span className="nav-link">
      <NavLink to="/login">Login</NavLink>
    </span>
  </li>,
  <li key="signup" className="nav-item">
    <span className="nav-link">
      <NavLink to="/signup">Signup</NavLink>
    </span>
  </li>,
];

const SearchBar = () => (
  <form className="form-inline my-2 my-lg-0">
    <input
      className="form-control mr-sm-2"
      type="search"
      placeholder="Search"
      aria-label="Search"
    />
    <button className="btn btn-outline-secondary my-2 my-sm-0" type="submit">
      <i className="fa fa-search" />
    </button>
  </form>
);

const LoggedInNav = () => (
  <>
    {/* <SearchBar key="searchbar" /> */}
    <li className="nav-item">
      <NavLink to="/profile">
        <button type="button" className="dropdown-item">
          Profile
        </button>
      </NavLink>
    </li>
    <li className="nav-item">
      <div className="dropdown-divider" />
    </li>
    <li>
      <NavLink to="/login" onClick={() => Meteor.logout()}>
        <button type="button" className="dropdown-item">
          Logout
        </button>
      </NavLink>
    </li>
  </>
);

const Status = ({ loggedIn }) => (
  <div className="my-2 mr-3">
    {loggedIn ? (
      <span className="text-success">
        <i className="fa fa-circle" />
      </span>
    ) : (
      <span className="text-secondary">
        <i className="fa fa-circle" />
      </span>
    )}
  </div>
);

Status.propTypes = {
  loggedIn: PropTypes.bool.isRequired,
};

const Navbar = ({ loggedIn, setHeight, i18n }) => {
  const ref = useRef(null);

  const [language, setLanguage] = useState('en');

  const onLanguageHandle = event => {
    let newLang = event.target.value;
    setLanguage(newLang);
    i18n.changeLanguage(newLang);
  };

  useEffect(() => {
    setHeight(ref.current.clientHeight);
  });

  return (
    <nav ref={ref} className="navbar navbar-expand-lg navbar-light bg-light">
      <Status loggedIn={loggedIn} />
      <span className="navbar-brand" href="#">
        <NavLink to="/">TESTS.BILIK</NavLink>
      </span>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon" />
      </button>
      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul className="navbar-nav ml-auto">
          {loggedIn ? <LoggedInNav /> : <PublicNav />}
        </ul>
      </div>
      <div>
        <input
          checked={language === 'en'}
          name="language"
          onChange={onLanguageHandle}
          value="en"
          type="radio"
        />
        English &nbsp;
        <input
          name="language"
          value="ru"
          checked={language === 'ru'}
          type="radio"
          onChange={onLanguageHandle}
        />
        Russian
        <input
          name="language"
          value="kz"
          checked={language === 'kz'}
          type="radio"
          onChange={onLanguageHandle}
        />
        Kazakh
      </div>
    </nav>
  );
};

Navbar.propTypes = {
  loggedIn: PropTypes.bool.isRequired,
  setHeight: PropTypes.func.isRequired,
};

export default Navbar;
