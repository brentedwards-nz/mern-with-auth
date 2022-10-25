import React from 'react';
import './App.css';
import { Route, Routes } from 'react-router-dom';

import Layout from './components/Layout';
import Register from './pages/auth/register/Register';
import Login from './pages/auth/login/Login';
import Logout from './pages/auth/logout/Logout';
import Reset from './pages/auth/reset/Reset';
import ResetPassword from './pages/auth/reset/ResetPassword';
import Unauthorised from './pages/auth/unauthorised/Unauthorised';

import RequireAuth from './components/RequireAuth';
import Home from './pages/home/Home'
import Protected from './pages/protected/Protected'

import Missing from './pages/missing/Missing';

function App() {
  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        <Route exact path='/' element={<Login />} />
        <Route exact path='register' element={<Register />} />
        <Route exact path='login' element={<Login />} />
        <Route exact path='logout' element={<Logout />} />
        <Route exact path='reset' element={<Reset />} />
        <Route exact path='reset-password' element={<ResetPassword />}>
          <Route path=":token" element={<ResetPassword />} />
        </Route>

        <Route exact path='unauthorised' element={<Unauthorised />} />

        <Route element={<RequireAuth />}>
          <Route exact path='home' element={<Home />} />
          <Route exact path='protected' element={<Protected />} />
        </Route>

        <Route path="*" element={<Missing />} />
      </Route>

    </Routes >
  );
}

export default App;
