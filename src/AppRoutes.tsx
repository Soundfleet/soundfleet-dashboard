import { Route, Routes } from "react-router-dom";
import LoginRequired from "./auth/components/LoginRequired";
import LoginView from "./auth/views/LoginView";
import Layout from "./components/Layout";
import HomePage from "./views/HomePage";
import * as mediaViews from "./media/views";
import * as deviceViews from "./devices/views";
import * as calendarViews from "./calendars/views";
import * as musicPlaylistViews from "./music/views/playlist";
import * as musicScheduleViews from "./music/views/schedule";
import * as adPlaylistViews from "./ads/views/playlist";
import * as adScheduleViews from "./ads/views/schedule";


export default function AppRoutes() {
  return (
    <Routes>
      <Route 
        path="/auth/login/"
        element={<LoginView />}
      />
      <Route
        element={
          <Layout />
        }
      >
        <Route 
          path="/"
          element={
            <LoginRequired>
              <HomePage />
            </LoginRequired>
          }
        />
        <Route 
          path="/devices/"
          element={
            <LoginRequired>
              <deviceViews.ListView />
            </LoginRequired>
          }
        />
        <Route 
          path="/devices/:uuid/"
          element={
            <LoginRequired>
              <deviceViews.DetailView />
            </LoginRequired>
          }
        />
        <Route 
          path="/calendars/"
          element={
            <LoginRequired>
              <calendarViews.ListView />
            </LoginRequired>
          }
        />
        <Route 
          path="/calendars/:uuid/"
          element={
            <LoginRequired>
              <calendarViews.DetailView />
            </LoginRequired>
          }
        />
        <Route 
          path="/media/upload/"
          element={
            <LoginRequired>
              <mediaViews.UploadView />
            </LoginRequired>
          }
        />
        <Route 
          path="/media/audio-tracks/"
          element={
            <LoginRequired>
              <mediaViews.ListView />
            </LoginRequired>
          }
        />
        <Route 
          path="/music/playlists/"
          element={
            <LoginRequired>
              <musicPlaylistViews.ListView />
            </LoginRequired>
          }
        />
        <Route 
          path="/music/playlists/:id/"
          element={
            <LoginRequired>
              <musicPlaylistViews.DetailView />
            </LoginRequired>
          }
        />
        <Route 
          path="/music/playlists/:id/add-tracks/"
          element={
            <LoginRequired>
              <musicPlaylistViews.AddTracksView />
            </LoginRequired>
          }
        />
        <Route 
          path="/music/schedules/"
          element={
            <LoginRequired>
              <musicScheduleViews.ListView />
            </LoginRequired>
          }
        />
        <Route 
          path="/music/schedules/:id/"
          element={
            <LoginRequired>
              <musicScheduleViews.DetailView />
            </LoginRequired>
          }
        />
        <Route 
          path="/ads/playlists/"
          element={
            <LoginRequired>
              <adPlaylistViews.ListView />
            </LoginRequired>
          }
        />
        <Route 
          path="/ads/playlists/:id/"
          element={
            <LoginRequired>
              <adPlaylistViews.DetailView />
            </LoginRequired>
          }
        />
        <Route 
          path="/ads/playlists/:id/add-tracks/"
          element={
            <LoginRequired>
              <adPlaylistViews.AddTracksView />
            </LoginRequired>
          }
        />
        <Route 
          path="/ads/schedules/"
          element={
            <LoginRequired>
              <adScheduleViews.ListView />
            </LoginRequired>
          }
        />
        <Route 
          path="/ads/schedules/:id/"
          element={
            <LoginRequired>
              <adScheduleViews.DetailView />
            </LoginRequired>
          }
        />
      </Route>
    </Routes>
  )
}