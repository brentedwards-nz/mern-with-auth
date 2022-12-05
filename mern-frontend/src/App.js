import React from 'react';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import { QueryClientProvider, QueryClient } from 'react-query'

import Layout from './components/Layout';
import Register from './pages/auth/register/Register';
import Login from './pages/auth/login/Login';
import Logout from './pages/auth/logout/Logout';
import Reset from './pages/auth/reset/Reset';
import ResetPassword from './pages/auth/reset/ResetPassword';
import Unauthorised from './pages/auth/unauthorised/Unauthorised';

import SpotifyAuth from './pages/spotify/spotifyauth';
import SpotifyLocal from './pages/spotify/local-library';
import SpotifyRemote from './pages/spotify/remote-library';

import RequireAuth from './components/RequireAuth';
import Home from './pages/home/Home'
import Protected from './pages/protected/Protected'
import Tracks from './pages/protected/Tracks'
import RickAndMorty from './pages/query/rickandmorty';

import Missing from './pages/missing/Missing';

function App() {

  const client = new QueryClient({});

  return (
    <QueryClientProvider client={client}>
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

          <Route exact path='spotify/auth' element={<SpotifyAuth />} />
          <Route exact path='spotify/remote' element={<SpotifyRemote />} />

          <Route element={<RequireAuth />}>
            <Route exact path='spotify/local' element={<SpotifyLocal />} />
            <Route exact path='home' element={<Home />} />
            <Route exact path='protected' element={<Layout />}>
              <Route path='' element={<Protected />} />
              <Route path='tracks' element={<Tracks />} />
            </Route>
            <Route exact path='rm' element={<RickAndMorty />} />
          </Route>

          <Route path="*" element={<Missing />} />
        </Route>

      </Routes >
    </QueryClientProvider>
  );
}

export default App;
