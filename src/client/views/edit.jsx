import React from 'react';
import { hashHistory } from 'react-router';

export class Edit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            first_name: '',
            last_name: '',
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleUsername = this.handleUsername.bind(this);
        this.handlePassword = this.handlePassword.bind(this);
        this.handleFirstName = this.handleFirstName.bind(this);
        this.handleLastName = this.handleLastName.bind(this);
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

    handleSubmit(e) {
        e.preventDefault();
        let form = $("#editForm");
        $.ajax({
            url: "http://localhost:8080/edit",
            type: "POST",
            data: form.serialize(),
            success: function (data) {
                sessionStorage.setItem('status', 'notloggedin');
                hashHistory.push("/login");
            },
            error: function () {
                alert("Ain't working!!!");
            }
        });
    }
    render() {
        return (
            <div className="container">
                <h1>Edit Profile</h1>
                <hr/>
                <div className="row">
                    <div className="col-md-3">
                        <div className="text-center"></div>
                    </div>
                    <div className="col-md-9">
                        <div className="alert alert-info alert-dismissable">Every field is required
                            <a className="panel-close.close"> × </a>
                        </div>
                        <h3>Player Info</h3>
                        <form className="form-horizontal" id="editForm" role="form" onSubmit={this.handleSubmit}>
                            <div className="form-group">
                                <label className="col-lg-3 control-label">Username: </label>
                                <div className="col-lg-8">
                                    <input className="form-control" type="text" placeholder="Username" name="username" onChange={this.handleUsername}/>
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="col-lg-3 control-label">Password: </label>
                                <div className="col-lg-8">
                                    <input className="form-control" type="password" placeholder="Password" name="password" onChange={this.handlePassword}/>
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="col-lg-3 control-label">First name: </label>
                                <div className="col-lg-8">
                                    <input className="form-control" type="text" placeholder="First name" name="first_name" onChange={this.handleFirstName}/>
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="col-lg-3 control-label">Last name: </label>
                                <div className="col-lg-8">
                                    <input className="form-control" type="text" placeholder="Last name" name="last_name" onChange={this.handleLastName}/>
                                </div>
                            </div>
                            <div>
                                <label className="col-lg-3 control-label"></label>
                                <div className="col-lg-8">
                                    <button className="btn btn-primary" id="save" type="submit">Save Changes</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}