import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import LanguageIcon from '@material-ui/icons/Language';
import Typography from '@material-ui/core/Typography';

export default function LanguageSelector({ i18n }) {
  const [anchorEl, setAnchorEl] = useState(null);

  const [language, setLanguage] = useState('en');

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = event => {
    setAnchorEl(null);
    const { myValue } = event.currentTarget.dataset;
    setLanguage(myValue);
    i18n.changeLanguage(myValue);
  };

  return (
    <div>
      <Button
        aria-controls="simple-menu"
        aria-haspopup="true"
        onClick={handleClick}
        color="inherit"
      >
        <LanguageIcon color="inherit" />
        <Typography color="inherit">{i18n.language}</Typography>
      </Button>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem
          data-my-value={'en'}
          onClick={handleClose}
          selected={language === 'en'}
        >
          <Typography color="primary">EN</Typography>
        </MenuItem>
        <MenuItem
          data-my-value={'ru'}
          onClick={handleClose}
          selected={language === 'ru'}
        >
          <Typography color="primary">RU</Typography>
        </MenuItem>
        <MenuItem
          data-my-value={'kz'}
          onClick={handleClose}
          selected={language === 'kz'}
        >
          <Typography color="primary">KZ</Typography>
        </MenuItem>
      </Menu>
    </div>
  );
}
