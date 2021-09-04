import React, { useEffect, useState } from 'react';
import { Meteor } from 'meteor/meteor';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import Button from '@material-ui/core/Button';
import SettingsOutlinedIcon from '@material-ui/icons/SettingsOutlined';

import Popper from '../Popper/Popper';

import ExitToAppOutlinedIcon from '@material-ui/icons/ExitToAppOutlined';

import { useTranslation } from 'react-i18next';

import { Router, Route, Link, useHistory } from 'react-router-dom';

import LanguageSelector from './LanguageSelector/LanguageSelector';

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9) + 1,
    },
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing(0, 1, 0, 2),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  mainToolbar: {
    justifyContent: 'space-between',
  },
  mainTitle: {
    display: 'flex',
    alignItems: 'center',
  },
  toolbarItems: {
    display: 'flex',
    alignItems: 'center',
  },
  categories: {
    display: 'flex',
  },
}));

export default function MiniDrawer({ children, mainTitle, items }) {
  const classes = useStyles();
  const theme = useTheme();
  const history = useHistory();
  const [t, i18n] = useTranslation();
  const [drawerIsOpen, setDrawerIsOpen] = useState(false);
  const [selected, setSelected] = useState(0);

  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);

  const handleToggle = () => {
    setOpen(prevOpen => !prevOpen);
  };

  const handleClose = event => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  function handleListKeyDown(event) {
    if (event.key === 'Tab') {
      event.preventDefault();
      setOpen(false);
    }
  }

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = React.useRef(open);
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

  const handleDrawerOpen = () => {
    setDrawerIsOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerIsOpen(false);
  };

  return (
    <div className={classes.root}>
      <CssBaseline />

      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: drawerIsOpen,
        })}
      >
        <Toolbar className={classes.mainToolbar}>
          <div className={classes.mainTitle}>
            {!!items?.length && (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerOpen}
                edge="start"
                className={clsx(classes.menuButton, {
                  [classes.hide]: drawerIsOpen,
                })}
              >
                <MenuIcon />
              </IconButton>
            )}
            <Button color="inherit" onClick={() => history.push('/')}>
              <Typography variant="h6" noWrap>
                TESTS.BILIK
              </Typography>
            </Button>
          </div>
          {Meteor.user() && (
            <div className={classes.categories}>
              {Roles.userIsInRole(Meteor.userId(), 'admin') && (
                <Button
                  color="inherit"
                  onClick={() => history.push('/schools')}
                >
                  <Typography>{t('schools')}</Typography>
                </Button>
              )}
              <Button color="inherit" onClick={() => history.push('/teachers')}>
                <Typography>{t('teachers')}</Typography>
              </Button>
              <Button color="inherit" onClick={() => history.push('/students')}>
                <Typography>{t('students')}</Typography>
              </Button>
              <Popper
                title={t('exams')}
                items={[
                  { title: t('bts'), link: '/bts' },
                  { title: t('turkishA1'), link: '/turkishA1' },
                  { title: t('sat'), link: '/sat' },
                  { title: t('ielts'), link: '/ielts' },
                  { title: t('kbo'), link: '/kbo' },
                ]}
              />
            </div>
          )}
          <div className={classes.toolbarItems}>
            <LanguageSelector i18n={i18n} />

            {Roles.userIsInRole(Meteor.user(), 'admin') && (
              <IconButton
                color="inherit"
                onClick={() => history.push('/settings')}
              >
                <SettingsOutlinedIcon />
              </IconButton>
            )}
            {Meteor.user() ? (
              <IconButton color="inherit" onClick={() => Meteor.logout()}>
                <ExitToAppOutlinedIcon />
              </IconButton>
            ) : (
              <Button color="inherit" onClick={() => history.push('/signin')}>
                {t('login')}
              </Button>
            )}
          </div>
        </Toolbar>
      </AppBar>
      {!!items?.length && (
        <Drawer
          variant="permanent"
          className={clsx(classes.drawer, {
            [classes.drawerOpen]: drawerIsOpen,
            [classes.drawerClose]: !drawerIsOpen,
          })}
          classes={{
            paper: clsx({
              [classes.drawerOpen]: drawerIsOpen,
              [classes.drawerClose]: !drawerIsOpen,
            }),
          }}
        >
          <div className={classes.toolbar}>
            {drawerIsOpen && (
              <Button>
                <Typography
                  id="drawer-title"
                  style={{ textDecoration: 'none' }}
                  onClick={() => setSelected(-1)}
                  component={Link}
                  to={mainTitle.link}
                  variant="h6"
                  noWrap
                >
                  {mainTitle.title}
                </Typography>
              </Button>
            )}
            {drawerIsOpen && (
              <IconButton onClick={handleDrawerClose}>
                {theme.direction === 'rtl' ? (
                  <ChevronRightIcon />
                ) : (
                  <ChevronLeftIcon />
                )}
              </IconButton>
            )}
          </div>
          <Divider />
          <List>
            {items.map((item, index) => (
              <ListItem
                button
                key={item.title}
                component={Link}
                to={item.link}
                onClick={() => setSelected(index)}
                selected={selected === index}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.title} />
              </ListItem>
            ))}
          </List>
          <Divider />
        </Drawer>
      )}
      <main className={classes.content}>
        <div className={classes.toolbar} />
        {children}
      </main>
    </div>
  );
}
