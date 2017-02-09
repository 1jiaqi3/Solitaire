import React from 'react';
import {hashHistory} from 'react-router';

export class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
        };
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleUsername(event) {
        this.setState({username: event.target.value});
    }

    handlePassword(event) {
        this.setState({password: event.target.value});
    }

    handleSubmit(e) {
        e.preventDefault();
        $.ajax({
            url: "http://localhost:8080/v1/session",
            type: "POST",
            data: $("#loginform").serialize(),
            success: function (data) {
                sessionStorage.setItem('status', 'loggedin');
                sessionStorage.setItem('username', data.username);
                sessionStorage.setItem('email', data.primary_email);
                hashHistory.push('/start');
            },
            error: function () {
                alert("Invalid username or password!");
            }
        });
    }
    render() {
        return (
            <div className="container">
                <div id="loginbox" style={{marginTop: 50}} className="mainbox col-md-6 col-md-offset-3 col-sm-8 col-sm-offset-2">
                    <div className="panel panel-info" >
                        <div className="panel-heading">
                            <div className="panel-title">Sign In</div>
                        </div>

                        <div style={{paddingTop: 30}} className="panel-body" >

                            <form id="loginform" className="form-horizontal" role="form" onSubmit={this.handleSubmit}>

                                <div style={{marginBottom: 40}} className="input-group">
                                    <span className="input-group-addon"></span>
                                    <input id="login-username" type="text" className="form-control" name="username" placeholder="username or email" value={this.state.username} onChange={this.handleUsername}/>
                                </div>

                                <div style={{marginBottom: 40}} className="input-group">
                                    <span className="input-group-addon"></span>
                                    <input id="login-password" type="password" className="form-control" name="password" placeholder="password" value={this.state.password} onChange={this.handlePassword}/>
                                </div>


                                <div style={{marginTop:10}} className="form-group">

                                    <div className="col-sm-12 controls">
                                        <button id="btn-login" className="btn btn-success" type="submit">Login  </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}