import React from 'react';
import {
  AppBar, 
  Box, 
  Container, 
  Divider, 
  Drawer, 
  IconButton, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  ListSubheader, 
  Toolbar 
} from '@mui/material';
import AudiotrackIcon from '@mui/icons-material/Audiotrack';
import MenuIcon from '@mui/icons-material/Menu';
import QueueMusicIcon from '@mui/icons-material/QueueMusic';
import TodayIcon from '@mui/icons-material/Today';
import UploadIcon from '@mui/icons-material/Upload';
import LaptopIcon from '@mui/icons-material/Laptop';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { Link, Outlet } from 'react-router-dom';
import Player from '../../player/components/Player';

const drawerWidth = 240;


export default function Layout() {
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = () => {
    setOpen((open) => {
      return !open;
    });
  };

  return (
    <Box display="flex">
      <AppBar
        position="fixed"
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={toggleDrawer}
            sx={{
              marginRight: 2,
            }}
          >
            <MenuIcon />
          </IconButton>
          <div><Link to="/" className={"white"}>Soundfleet Dashboard</Link></div>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
        }}
        onClose={() => setOpen(false)}
        variant="temporary"
        anchor="left"
        open={open}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={toggleDrawer}
            sx={{
              marginRight: 2,
            }}
          >
            <MenuIcon />
          </IconButton>
          <div><Link to="/">Soundfleet Dashboard</Link></div>
        </Toolbar>
        <Divider />
        <List>
          <ListItem disablePadding>
            <ListItemButton component={Link} to="/devices/">
              <ListItemIcon>
                <LaptopIcon />
              </ListItemIcon>
              <ListItemText primary="Devices" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton component={Link} to="/calendars/">
              <ListItemIcon>
                <CalendarMonthIcon />
              </ListItemIcon>
              <ListItemText primary="Calendars" />
            </ListItemButton>
          </ListItem>
          <Divider />
        </List>
        <List subheader={
          <ListSubheader component="div" id="media-list">
            MEDIA
          </ListSubheader>
        }>
          <ListItem disablePadding>
            <ListItemButton component={Link} to="/media/audio-tracks/">
              <ListItemIcon>
                <AudiotrackIcon />
              </ListItemIcon>
              <ListItemText primary="Audio Tracks" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton component={Link} to="/media/upload/">
              <ListItemIcon>
                <UploadIcon />
              </ListItemIcon>
              <ListItemText primary="Upload" />
            </ListItemButton>
          </ListItem>
          <Divider />
        </List>
        <List subheader={
          <ListSubheader component="div" id="music-list">
            MUSIC
          </ListSubheader>
        }>
          <ListItem disablePadding>
            <ListItemButton component={Link} to="/music/playlists/">
              <ListItemIcon>
                <QueueMusicIcon />
              </ListItemIcon>
              <ListItemText primary="Playlists" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton component={Link} to="/music/schedules/">
              <ListItemIcon>
                <TodayIcon />
              </ListItemIcon>
              <ListItemText primary="Schedules" />
            </ListItemButton>
          </ListItem>
        </List>
        <List subheader={
          <ListSubheader component="div" id="ads-list">
            ADS
          </ListSubheader>
        }>
          <ListItem disablePadding>
            <ListItemButton component={Link} to="/ads/playlists/">
              <ListItemIcon>
                <QueueMusicIcon />
              </ListItemIcon>
              <ListItemText primary="Playlists" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton component={Link} to="/ads/schedules/">
              <ListItemIcon>
                <TodayIcon />
              </ListItemIcon>
              <ListItemText primary="Schedules" />
            </ListItemButton>
          </ListItem>
        </List>
        <Divider />
      </Drawer>
      <Container
        component="main"
        maxWidth="xl"
        sx={{marginTop: 3}}
      >
        <Toolbar />
        <Player />
        <Outlet />
      </Container>
    </Box>
  );
}
