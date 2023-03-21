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
import AddIcon from '@mui/icons-material/Add';
import AudiotrackIcon from '@mui/icons-material/Audiotrack';
import MenuIcon from '@mui/icons-material/Menu';
import QueueMusicIcon from '@mui/icons-material/QueueMusic';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import TodayIcon from '@mui/icons-material/Today';
import UploadIcon from '@mui/icons-material/Upload';
import LaptopIcon from '@mui/icons-material/Laptop';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { Link, Outlet } from 'react-router-dom';

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
          <div>Soundfleet Dashboard</div>
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
          <div>Soundfleet Dashboard</div>
        </Toolbar>
        <Divider />
        <List subheader={
          <ListSubheader component="div" id="device-list">
            DEVICES
          </ListSubheader>
        }>
          <ListItem disablePadding>
            <ListItemButton component={Link} to="/devices/">
            <ListItemIcon>
              <LaptopIcon />
            </ListItemIcon>
            <ListItemText primary="Devices" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemIcon>
              <AddIcon />
            </ListItemIcon>
            <ListItemText primary="Add Device" />
          </ListItem>
          <ListItem disablePadding>
            <ListItemIcon>
              <CalendarMonthIcon />
            </ListItemIcon>
            <ListItemText primary="Calendars" />
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
            <ListItemIcon>
              <QueueMusicIcon />
            </ListItemIcon>
            <ListItemText primary="Playlists" />
          </ListItem>
          <ListItem disablePadding>
            <ListItemIcon>
              <PlaylistAddIcon />
            </ListItemIcon>
            <ListItemText primary="Add Playlist" />
          </ListItem>
          <ListItem disablePadding>
            <ListItemIcon>
              <TodayIcon />
            </ListItemIcon>
            <ListItemText primary="Schedules" />
          </ListItem>
          <ListItem disablePadding>
            <ListItemIcon>
              <AddIcon />
            </ListItemIcon>
            <ListItemText primary="Add Schedule" />
          </ListItem>
        </List>
        <List subheader={
          <ListSubheader component="div" id="ads-list">
            ADS
          </ListSubheader>
        }>
          <ListItem disablePadding>
            <ListItemIcon>
              <QueueMusicIcon />
            </ListItemIcon>
            <ListItemText primary="Playlists" />
          </ListItem>
          <ListItem disablePadding>
            <ListItemIcon>
              <PlaylistAddIcon />
            </ListItemIcon>
            <ListItemText primary="Add Playlist" />
          </ListItem>
          <ListItem disablePadding>
            <ListItemIcon>
              <TodayIcon />
            </ListItemIcon>
            <ListItemText primary="Schedules" />
          </ListItem>
          <ListItem disablePadding>
            <ListItemIcon>
              <AddIcon />
            </ListItemIcon>
            <ListItemText primary="Add Schedule" />
          </ListItem>
        </List>
      </Drawer>
      <Container
        component="main"
        maxWidth="xl"
      >
        <Toolbar />
        <Outlet />
      </Container>
    </Box>
  );
}
