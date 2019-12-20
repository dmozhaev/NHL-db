import React, { Component } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import BaseRouter from './routes';
import 'antd/dist/antd.css';
import './App.css';

import store from './store';

import CustomLayout from './components/Layout';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Provider store={store}>
          <Router>
            <CustomLayout {...this.props}>
                <BaseRouter />
            </CustomLayout>
          </Router>
        </Provider>
      </div>
    );
  }
}

export default App;
