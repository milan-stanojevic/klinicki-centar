import React, { Component } from 'react';
import {
    BrowserRouter as Router,
    Route,
    Switch
} from 'react-router-dom';

import AdminLoginPage from './views/admin/login';
import ClinicList from './views/admin/clinicList';
import Clinic from './views/admin/clinic';
import HomePage from './views/homePage';
import ClinicAdmin from './views/admin/clinicAdmin';
import ClinicAdminList from './views/admin/clinicAdminList';

import PatientLoginPage from './views/patient/login';
import PatientRegisterPage from './views/patient/register';


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
                            path="/admin/login"
                            exact
                            render={(...renderProps) => (
                                <AdminLoginPage {...renderProps} {...this.props} />
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
                                <Clinic {...renderProps} {...this.props} />
                            )}
                        />
                        <Route
                            path="/admin/clinic/:cid/admins"
                            exact
                            render={(...renderProps) => (
                                <ClinicAdminList {...renderProps} {...this.props} />
                            )}
                        />

                        <Route
                            path="/admin/clinic/:cid/admins/:id"
                            exact
                            render={(...renderProps) => (
                                <ClinicAdmin {...renderProps} {...this.props} />
                            )}
                        />


                        <Route
                            path="/patient/register"
                            exact
                            render={(...renderProps) => (
                                <PatientRegisterPage {...renderProps} {...this.props} />
                            )}
                        />

                        
                        <Route
                            path="/patient/login"
                            exact
                            render={(...renderProps) => (
                                <PatientLoginPage {...renderProps} {...this.props} />
                            )}
                        />

                    </Switch>
                </div>
            </Router >
        );
    }
}

export default Routes;