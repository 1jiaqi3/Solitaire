import React from 'react'
import ReactDom from 'react-dom'
// First we import some modules...
import { Router, Route, IndexRoute, Link, hashHistory } from 'react-router';

import { Landing } from './views/landing';
import { Register } from './views/register';
import { Login } from './views/login';
import { Profile } from './views/profile';
import { Start } from './views/start';
import { Game } from './views/game';
import { Edit } from './views/edit';
import { Fireworks } from './views/fireworks';

class App extends React.Component {
    render() {
        return (
            <div>
                {this.props.children}
            </div>
        );
    }
}


// Finally, render with some routes
ReactDom.render((
    <Router history={hashHistory}>
        <Route path="/" component={App} >
            <IndexRoute component={Landing}/>
            <Route path="register" component={Register}/>
            <Route path="login" component={Login}/>
            <Route path="profile/:username" component={Profile}/>
            <Route path="start" component={Start}/>
            <Route path="game" component={Game}/>
            <Route path="edit" component={Edit}/>
            <Route path="fireworks" component={Fireworks}/>
        </Route>
    </Router>
), document.getElementById('mainDiv'));