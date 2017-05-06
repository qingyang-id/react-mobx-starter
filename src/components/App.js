import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import { Provider, observer } from 'mobx-react';

import TopBar from './base/header/TopBar';
import Home from './Home';
import List from './page/List';
import Detail from './page/Detail';
import Login from './Login';
import NotFound from './base/NotFound';

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

            <Route exact path='/' component={Home} />
            <Route exact path='/pages' component={List} />
            <Route exact path='/pages/:id' component={Detail} />
            <Route exact path='/login' component={Login} />
            <Route exact path='/404' component={NotFound} />
            <Route exact path='*' render={() => (<Redirect to='/404' />)} />
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
