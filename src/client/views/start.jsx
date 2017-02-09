import React from 'react';
import {hashHistory, Link} from 'react-router';

export class Start extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: ''
        };
        this.handleName = this.handleName.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }


    handleName(e) {
        this.setState({name: e.target.value});
    }

    handleSubmit(e) {
        e.preventDefault();
        if (sessionStorage.getItem("status") !== "loggedin") {
            hashHistory.push("/login");
        }
        let form = $("#form");
            $.ajax({
                url: "http://localhost:8080/v1/game",
                type: "POST",
                data: form.serialize(),
                success: function () {
                    let formData = form.serializeArray();
                    localStorage.setItem('reloaded', 'no');
                    localStorage.setItem("difficulty", formData[1].value);
                    localStorage.setItem("newGame", "yes");
                    localStorage.setItem("gameName", formData[4].value);
                    hashHistory.push("/game");
                },
                error: function () {
                    alert("Game name already existed!");
                },
                statusCode: {
                    401: function () {
                        sessionStorage.setItem('status', 'out');
                        hashHistory.push("/login");
                    }
                },
            });
    }
    render() {
        return (
            <div className="container" style={{marginTop: 30}}>
                <form id="form" onSubmit={this.handleSubmit}>
                    <div className="form-group">
                        <label>Solitaire mode: </label>
                        <select className="form-control" id="myType" name="Type" >
                            <option>Klondike</option>
                            <option>Pyramid</option>
                            <option>Canfield</option>
                            <option>Golf</option>
                            <option>Yukon</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>How many cards do you want to draw per time</label>
                        <select className="form-control" id="myDrawNum" name="draw_num">
                            <option>1</option>
                            <option>3</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Number of Players</label>
                        <select className="form-control" id="myNumPlayer" name="num_players">
                            <option>1</option>
                            <option>2</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Deck type</label>
                        <select className="form-control" id="myDeckType" name="Deck">
                            <option>1</option>
                            <option>2</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Game Name</label>
                        <input type="text" className="form-control" placeholder="Game Name" name="name" value={this.state.name} onChange={this.handleName}/>
                    </div>
                    <div>
                        <button className="btn btn-primary" id="submitButton" type="submit">
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        );
    }
}