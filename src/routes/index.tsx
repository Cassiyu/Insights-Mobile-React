import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import StackNavigation from './stack.routes';
import DrawerNavigation from './drawer.routes';

const Routes = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {

    const checkAuthentication = async () => {
      const userLoggedIn = false;
      setIsAuthenticated(userLoggedIn);
    };

    checkAuthentication();
  }, []);

  return (
    <NavigationContainer>
      {isAuthenticated ? (
        <DrawerNavigation />
      ) : (
        <StackNavigation />
      )}
    </NavigationContainer>
  );
};

export default Routes;
