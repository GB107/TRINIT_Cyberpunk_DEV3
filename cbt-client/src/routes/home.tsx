import { useEffect, useState } from 'react';
import { Outlet, Link, useNavigate } from "react-router-dom";


import { login, logout, makeApiCallWithUserToken, starterKitIsConfiguredCorrectly, authressLoginClient } from '../authressClient';
import reactLogo from './assets/react.svg';
import authressLogo from './assets/logo.svg';
import Openapi from './openapi';

import React from 'react';
import Button from '@mui/material/Button';
import TestPage from '../components/testportal';
import { Box } from '@mui/material';
import ResponsiveAppBar from '../components/appbar';
import CollapsibleTable from '../components/browsetests';

function App() {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState({});
  const [authressApiUrlIsSet, setAuthressApiUrlIsSet] = useState(true);

    const [showTestPage, setShowTestPage] = useState<boolean>(false);
  
    const handleCreateTaskClick = () => {
      setShowTestPage(true);
    };
  

  // let userProfile;
  useEffect(() => {
    async function func() {
      if (starterKitIsConfiguredCorrectly) {
        authressLoginClient.userSessionExists().then((userIsLoggedIn) => {
          setUserProfile(authressLoginClient.getUserIdentity());
          console.log('User is Logged In', userIsLoggedIn, userProfile);
          console.log('User Profile', userProfile);
        });
      }
    }

    func();
  }, []);

  useEffect(() => {
    setAuthressApiUrlIsSet(starterKitIsConfiguredCorrectly);
  }, []);


  return (
    <>
    {!userProfile && 
      <button style={{ marginRight: '1rem' }} onClick={login}>
        Login
      </button>
    }
    {userProfile && (
      <>
      <ResponsiveAppBar userProfile = {userProfile} logout = {logout} setShowTestPage = {setShowTestPage} />
          <div style={{ display: 'flex', justifyContent: 'center', }}>
            {!showTestPage ? (
              <CollapsibleTable />
            ) : (
              <TestPage />
            )}
          </div>
        </> 
    )}

    </>
  );
}

export default App;
