import React, { Component } from 'react';
import {
    BrowserRouter as Router,
    Route,
    Switch
} from 'react-router-dom';

import LoginPage from './views/loginPage';
import ClinicList from './views/admin/clinicListPage';
import ClinicPage from './views/admin/clinicPage';
import HomePage from './views/homePage';


class Routes extends Component {

    componentDidMount() {

    }

    render() {
        return (
            <Router >
                <div>
                    <Switch className="react-switch">
                        <Route
                            path="/"
                            exact
                            render={(...renderProps) => (
                                <HomePage {...renderProps} {...this.props} />
                            )}
                        />

                        <Route
                            path="/login"
                            exact
                            render={(...renderProps) => (
                                <LoginPage {...renderProps} {...this.props} />
                            )}
                        />

                        <Route
                            path="/admin/clinic"
                            exact
                            render={(...renderProps) => (
                                <ClinicList {...renderProps} {...this.props} />
                            )}
                        />
                        <Route
                            path="/admin/clinic/:id"
                            exact
                            render={(...renderProps) => (
                                <ClinicPage {...renderProps} {...this.props} />
                            )}
                        />



                    </Switch>
                </div>
            </Router >
        );
    }
}

export default Routes;