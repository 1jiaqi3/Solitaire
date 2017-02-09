import React from 'react';
import { User } from './user';

export class UserList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            users: []
        };
        this.handleJoin = this.handleJoin.bind(this);
        this.handleLeave = this.handleLeave.bind(this);
    }

    handleJoin(newEntry) {
        this.state.users.push(newEntry);
    }

    handleLeave(username) {
        for (let i = 0; i < this.state.users.length; i++) {
            if (username === this.state.users[i].name) {
                this.state.users.splice(i, 1);
            }
        }
    }

    componentWillMount() {
        $.ajax({
            url: "/v1/room/" + this.props.room + "/users",
            type: "GET",
            success: function (users) {
                this.setState({users: users});
            }
        });
        this.props.dispatcher.on('join', this.handleJoin);
        this.props.dispatcher.on('leave', this.handleLeave);
    }

    render() {
        let allUsers = [];
        for (let i = 0; i < this.state.users.length; i++) {
            allUsers.push(<User name = {this.state.users[i].name} icon = {this.state.users[i].icon}/>);
        }
        return (
            <div>
                {allUsers}
            </div>
        );
    }
}