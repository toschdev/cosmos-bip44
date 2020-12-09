import React from 'react';
import Bip44 from "./Bip44";
import Button from 'react-bootstrap/Button';
import logo from './logo.svg';

export default class Home extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            clicked: false,
        };

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        this.setState({
            clicked: true,
        });
    }
      
  render() {
    return (
        <div>
            {this.state.clicked ? <Bip44 /> : <header className="App-header">
            <h1>Cosmos SDK BIP44</h1>
            <img src={logo} className="App-logo" alt="logo" />
            <p>
            This page will not save any content. Any time reloaded, the application will start new.
            </p>
            <p>
            Please make sure when working with passphrases, to always create backups
            </p>
            <Button onClick={this.handleClick} variant="primary" size="lg">Get Started</Button>{' '}
        </header>}
        </div>
    );
  }
}