'use client';
import { Box, ListItemIcon, ListItemText, MenuList } from '@mui/material';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useState } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import DriveEtaIcon from '@mui/icons-material/DriveEta';
import HomeIcon from '@mui/icons-material/Home';
import SettingsIcon from '@mui/icons-material/Settings';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Link from 'next/link';

export default function MenuButton() {
  type CustomMenuItemProps = {
    handleClose: () => void;
    icon: React.ReactElement;
    text: string;
    linkText: string;
  };
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const CustomMenuItem: React.FC<CustomMenuItemProps> = ({
    handleClose,
    icon,
    text,
    linkText,
  }) => (
    <MenuItem onClick={handleClose}>
      <ListItemIcon>{icon}</ListItemIcon>
      <Link href={`/${linkText}`} passHref>
        {text}
      </Link>
    </MenuItem>
  );
  return (
    <Box
      sx={{
        justifyContent: 'flex-end',
        marginLeft: { xs: '65%', sm: '75%', md: '75%', lg: '85%' },
      }}
    >
      <Button
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        <MenuIcon />
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuList>
          <CustomMenuItem
            handleClose={handleClose}
            icon={<AccountCircleIcon fontSize="small" />}
            text="Positions"
            linkText="positions"
          />
          <CustomMenuItem
            handleClose={handleClose}
            icon={<HomeIcon fontSize="small" />}
            text="Home"
            linkText=""
          />
          <CustomMenuItem
            handleClose={handleClose}
            icon={<DriveEtaIcon fontSize="small" />}
            text="Login"
            linkText="login"
          />
        </MenuList>
      </Menu>
    </Box>
  );
}
