'use strict';

import React from 'react';
import { Link, hashHistory } from 'react-router';

export class Profile extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        let url = window.location.href;

        let entries = url.split("/");
        let username = entries[entries.length - 1];

        if (sessionStorage.getItem('status') !== 'loggedin') {
            console.log(sessionStorage.getItem('status'));
            $("#startNew").hide();
            $("#buttonDiv").show();

            $("#loginBtn").click(function () {
                hashHistory.push("/login")
            });
            $("#signupBtn").click(function () {
                hashHistory.push("/register");
            });
        } else {
            let gravatar = $('<img style="width: 10%; height: 10%">').attr({src: 'http://www.gravatar.com/avatar/' + md5(sessionStorage.getItem('email'))});
            $("#firstRow").before(gravatar);

            $("#buttonDiv").hide();
            let startNew = $("#startNew");
            startNew.after("<a id = 'logout'></a>");
            //let edit = $("#edit");
            let logout = $("#logout");
            logout.addClass("btn btn-danger");
            logout.text("Log out");

            logout.click(function () {

                $.ajax({
                    url: "http://localhost:8080/logout",
                    type: "GET",
                    success: function () {
                        sessionStorage.setItem('status', 'out');
                        sessionStorage.removeItem('username');
                        hashHistory.push("/login");
                    },
                });
            });
            startNew.click(function () {
                hashHistory.push("/start");
            });
        }

        if (entries.length > 3) {

            $.ajax({
                url: "http://localhost:8080/games/" + username,
                type: "GET",
                data: "json",
                success: function (data) {

                    let datas = JSON.parse(data);
                    console.log(datas);
                    let tmpl = _.template(
                        '<div class = "panel panel-primary">' +
                        '<% _.each(datas, function(game) { %>' +
                        '    <div class = "panel-heading">  ' +
                        '        <h3 class = "panel-title"><%= game.name %></h3> ' +
                        '    </div> ' +
                        '    <div class = "panel-body"> ' +
                        '        Type: <%= game.Type %>,   Date: <%= game.startDate %>,   Duration: 3 minutes,   Number of Moves: 20 ' +
                        '        <button class="btn btn-success review-buttons" id=<%= game.name + \'+\' + game.draw_num %>>Review</button> ' +
                        '    </div> ' +
                        '<% }) %>'
                    );
                    let toAppend = tmpl({datas: datas});
                    $("#myContainer").append(toAppend);

                    $(".review-buttons").click(function () {
                        localStorage.setItem('newGame', 'no');
                        localStorage.setItem('reloaded', 'no');
                        let id = this.id.split("+");
                        localStorage.setItem('gameName', id[0]);
                        localStorage.setItem('difficulty', parseInt(id[1]));
                        hashHistory.push('/game');
                    });
                }
            });

            $.ajax({
                url: "http://localhost:8080/v1/user/" + username,
                type: "GET",
                dataType: "json",
                success: function (data) {
                    //console.log(sessionStorage.getItem('username'));
                    //console.log(username);
                    if (username === sessionStorage.getItem('username')) {
                        $("#startNew").after("<button id = 'edit'></button>");
                        let edit = $("#edit");
                        edit.addClass("btn btn-primary");
                        edit.text("Edit Profile");
                        edit.click(function () {
                            hashHistory.push("/edit");
                        });
                    }
                    console.log("data.username is ");
                    console.log(data.username);
                    $("#username").text(data.username);
                    $("#first_name").text(data.first_name);
                    $("#last_name").text(data.last_name);
                    $("#email").text(data.primary_email);
                    if (sessionStorage.getItem('status') === 'loggedin') {
                        let gravatar = $('<img style="width: 40%; height: 40%">').attr({src: 'http://www.gravatar.com/avatar/' + md5(data.primary_email)});
                        $("#myContainer").append(gravatar);
                    }
                },
                statusCode: {
                    404: function () {
                        alert("User does not exist!");
                    },
                    401: function () {
                        sessionStorage.setItem('status', 'out');
                    }
                },
            });
        }
    }

    render() {
        let btnStyle = {
            marginTop: 30,
            marginLeft: 70
        };

        let rowStyle = {
            marginTop: 20,
            marginBotton: 20
        };
        return (
            <div>
                <div className="container" id="myContainer">
                    <div className="row" id="firstRow" style={rowStyle}>
                        <div className="col-md-3"> Username:</div>
                        <div className="col-md-3" id="username">Default_User</div>
                    </div>
                    <div className="row" style={rowStyle}>
                        <div className="col-md-3"> First Name:</div>
                        <div className="col-md-3" id="first_name">Default_First</div>
                    </div>
                    <div className="row" style={rowStyle}>
                        <div className="col-md-3"> Last Name:</div>
                        <div className="col-md-3" id="last_name">Default_Last</div>
                    </div>
                    <div className="row" style={rowStyle}>
                        <div className="col-md-3"> Email Address:</div>
                        <div className="col-md-3" id="email">Default_Email</div>
                    </div>
                    <div className="row" style={rowStyle}>
                        <div className="col-md-3"> Time Played:</div>
                        <div className="col-md-3">5</div>
                    </div>
                    <div className="row" style={rowStyle}>
                        <div className="col-md-3"> Win Ratio:</div>
                        <div className="col-md-3">40%</div>
                    </div>
                    <div className="row topBuffer" style={rowStyle}>
                        <div className="col-md-3"> Highest Score:</div>
                        <div className="col-md-3">200</div>
                    </div>
                </div>
                <div id="buttonDiv">
                    <Link className="btn btn-primary" id="loginBtn" style={btnStyle} to="/login"> You have not logged in. Go to login page</Link>
                    <Link className="btn btn-danger" id="signupBtn" style={btnStyle} to="/register"> Don't have an account? Go to register page</Link>
                </div>
                <div>
                    <button className="btn bg-success" id="startNew">start a new game!</button>
                </div>
            </div>
        );
    }
}