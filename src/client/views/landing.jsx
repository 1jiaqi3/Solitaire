'use strict';

import React from 'react';
import { Link } from 'react-router';

export class Landing extends React.Component {
    render() {
        let welcomeStyle = {
            backgroundColor: '#00bfff',
            width: '100%',
            height: 600
        };

        let txtStyle = {
            marginLeft: '25%',
            paddingTop: 150,
            color: '#d54d7b',
            fontFamily: "Great Vibes",
            fontSize: 65
        };

        let loginButtonStyle = {
            marginLeft: '10%',
            marginTop: '10%',
            height: 40,
            width: 120
        };

        let registerButtonStyle = {
            marginRight: '10%',
            marginTop: '10%',
            float: 'right',
            height: 40,
            width: 120
        };

        return (
            <div style={welcomeStyle}>
                <div style={txtStyle}>
                    Welcome to Solitaire!
                </div>
                <div>
                    <Link className="btn btn-success" style={registerButtonStyle} to="/register">Register</Link>
                    <Link className="btn btn-danger" style={loginButtonStyle} to="/login">Login</Link>
                </div>
            </div>
        );
    }
}
