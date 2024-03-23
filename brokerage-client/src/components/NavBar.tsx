import { AppBar, Toolbar } from '@mui/material';
import Image from 'next/image';
import Header from './header';

export default function NavBar() {
  return (
    <AppBar position="fixed" sx={{ zIndex: 2000 }}>
      <Toolbar sx={{ backgroundColor: 'background.paper' }}>
        <Image alt="App Icon" src="/AppIcon.png" width={117} height={47} />
        <Header />
      </Toolbar>
    </AppBar>
  );
}
