import _ from 'lodash';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './App.css';
import HomePage from './views/public/HomePage';

const routes = {
  public: {
    root: '/',
  },
};

const publicRoutes = _.values(routes.public);

const Router = (): JSX.Element => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path={publicRoutes}>
          <Route exact path={routes.public.root} component={HomePage} />
        </Route>
      </Switch>
    </BrowserRouter>
  );
};

export default Router;
