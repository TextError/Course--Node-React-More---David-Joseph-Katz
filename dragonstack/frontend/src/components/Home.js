import React, { Component } from 'react';
import { Button } from 'react-bootstrap';

// Redux
import { connect } from 'react-redux';
import { logout } from '../actions/account';

// Components
import Generation from './Generation';
import Dragon from './Dragon';

class Home extends Component {
  render() {
    return (
      <div>
        <Button onClick={this.props.logout} className='logout-button'>Log out</Button>
        <h2>Dragon Stack test</h2>
        <Generation />
        <Dragon />
    </div>
    );
  }
};

export default connect(null, { logout })(Home);