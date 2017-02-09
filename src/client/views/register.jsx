import React from 'react';
import {hashHistory} from 'react-router';

export class Register extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            first_name: '',
            last_name: '',
            email: ''
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleUsername = this.handleUsername.bind(this);
        this.handlePassword = this.handlePassword.bind(this);
        this.handleFirstName = this.handleFirstName.bind(this);
        this.handleLastName = this.handleLastName.bind(this);
        this.handleEmail = this.handleEmail.bind(this);
    }

    handleUsername(event) {
        this.setState({username: event.target.value});
    }

    handlePassword(event) {
        this.setState({password: event.target.value});
    }

    handleFirstName(event) {
        this.setState({first_name: event.target.value});
    }

    handleLastName(event) {
        this.setState({last_name: event.target.value});
    }

    handleEmail(event) {
        this.setState({email: event.target.value});
    }

    handleSubmit(e) {
        e.preventDefault();
        let form = $("#signupform");
        let username = this.state.username;
        console.log(this.state);
        if (username.length > 16 || username.length < 6) {
            alert("Username must be between 6-16 characters");
            return;
        }
        $.ajax({
            url: "http://localhost:8080/v1/user",
            type: "POST",
            data: form.serialize(),
            success: function () {
                hashHistory.push('/profile/' + username);
                //window.location.replace("profile.html?username=" + username);
            },
            error: function () {
                console.log($("#signupform").serialize());
                alert("Username already existed or you did not fill in all the Information!");
            }
        });
    }
    render() {
        return (
            <div className="container">
                <div id="signupbox" style={{marginTop: 50}} className="mainbox col-md-6 col-md-offset-3 col-sm-8 col-sm-offset-2">
                    <div className="panel panel-info">
                        <div className="panel-body" >
                            <form id="signupform" className="form-horizontal" onSubmit={this.handleSubmit}>
                                <div className="form-group">
                                    <label className="col-md-3 control-label">Username</label>
                                    <div className="col-md-9">
                                        <input type="text" className="form-control" name="username" placeholder="Username" value={this.state.username} onChange={this.handleUsername}/>
                                    </div>
                                </div>

                                 <div className="form-group">
                                    <label className="col-md-3 control-label">First Name</label>
                                    <div className="col-md-9">
                                        <input type="text" className="form-control" name="first_name" placeholder="First Name" value={this.state.first_name} onChange={this.handleFirstName}/>
                                    </div>
                                 </div>
                                 <div className="form-group">
                                    <label className="col-md-3 control-label">Last Name</label>
                                    <div className="col-md-9">
                                        <input type="text" className="form-control" name="last_name" placeholder="Last Name" value={this.state.last_name} onChange={this.handleLastName}/>
                                    </div>
                                 </div>
                                 <div className="form-group">
                                    <label className="col-md-3 control-label">Password</label>
                                    <div className="col-md-9">
                                        <input type="password" className="form-control" name="password" ref="password" placeholder="Password" value={this.state.password} onChange={this.handlePassword}/>
                                    </div>
                                 </div>
                                <div className="form-group">
                                    <label className="col-md-3 control-label">Primary Email</label>
                                    <div className="col-md-9">
                                        <input type="text" className="form-control" name="primary_email" placeholder="Primary Email" value={this.state.email} onChange={this.handleEmail}/>
                                    </div>
                                 </div>

                                <div className="form-group">
                                    <div className="col-md-offset-3 col-md-9">
                                        <button id="btn-signup" type="submit" className="btn btn-info"><i className="icon-hand-right"></i>Sign up</button>
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