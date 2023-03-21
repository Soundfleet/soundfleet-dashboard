import { Route, Routes } from "react-router-dom"
import LoginView from "./auth/views/LoginView"
import Layout from "./components/Layout"
import UploadView from "./media/views/UploadView"
import HomePage from "./views/HomePage"

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
            <HomePage />
          }
        />
        <Route 
          path="/media/upload/"
          element={
            <UploadView />
          }
        />
      </Route>
    </Routes>
  )
}