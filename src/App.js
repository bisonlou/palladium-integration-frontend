// react imports
import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';

// components imports
import Main from './layout/main';
import Landing from './layout/landing';
import ResetPassword from './components/ResetPassword';


const App = () => {
  return (
    <Router>
      <Switch>
        <Route path='/' exact component={Landing} />
        <Route path='/portal' exact component={Main} />
        <Route path='/reset-password' exact component={ResetPassword} />
      </Switch>
    </Router>
  )
}

export default App;
