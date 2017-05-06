import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Provider, observer } from 'mobx-react';
import LazyRoute from 'lazy-route';

import TopBar from './base/header/TopBar';

@observer
export default class App extends Component {
  constructor(props) {
    super(props);
    this.store = this.props.store;
  }

  componentDidMount() {
    this.authenticate();
  }

  authenticate(e) {
    if (e) e.preventDefault();
    this.props.store.authenticate();
  }

  render() {
    const { timeToRefresh } = this.store;
    return (
      <Router>
        <Provider store={this.store}>
          <div className='wrapper'>
            <TopBar />

            <Route
              exact
              path='/'
              render={props => <LazyRoute {...props} component={import('./Home')} />}
            />
            <Route
              exact
              path='/pages'
              render={props => <LazyRoute {...props} component={import('./page/List')} />}
            />
            <Route
              exact
              path='/pages/:id'
              render={props => <LazyRoute {...props} component={import('./page/Detail')} />}
            />
            <Route
              exact
              path='/login'
              render={props => <LazyRoute {...props} component={import('./Login')} />}
            />
            {!!(timeToRefresh && timeToRefresh <= 4) && this.store.refreshToken()}
            <footer>
              Cobbled together by <a href='https://github.com/Sailor20' target='_blank'>@Sailor20</a> | github:
              <a href='https://github.com/Sailor20' target='_blank'>Sailor20</a>
            </footer>
          </div>
        </Provider>
      </Router>
    );
  }
}
