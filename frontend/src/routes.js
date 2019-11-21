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
import Patients from './views/admin/patients';


import PatientLoginPage from './views/patient/login';
import PatientRegisterPage from './views/patient/register';

import ClinicAdminLogin from './views/clinic/login';
import ClinicEdit from './views/clinic/editClinic';
import DocHomePage from './views/doctor/docHomePage'
import PatientsList from './views/doctor/patientsList'
import EditProfile from './views/doctor/editProfile'
import PatientHomePage from './views/patient/patientHomePage'


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
                            path="/admin/patients"
                            exact
                            render={(...renderProps) => (
                                <Patients {...renderProps} {...this.props} />
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

                        <Route
                            path="/clinic/admin/login"
                            exact
                            render={(...renderProps) => (
                                <ClinicAdminLogin {...renderProps} {...this.props} />
                            )}
                        />

                                                <Route
                            path="/clinic/admin/edit"
                            exact
                            render={(...renderProps) => (
                                <ClinicEdit {...renderProps} {...this.props} />
                            )}
                        />

                        
                        <Route
                            path="/doctor"
                            exact
                            render={(...renderProps) => (
                                <DocHomePage {...renderProps} {...this.props} />
                            )}
                        />
                        <Route
                            path="/doctor/edit"
                            exact
                            render={(...renderProps) => (
                                <EditProfile {...renderProps} {...this.props} />
                            )}
                        />
                        <Route
                            path="/patient"
                            exact
                            render={(...renderProps) => (
                                <PatientHomePage {...renderProps} {...this.props} />
                            )}
                        />
                        <Route
                            path="/doctor/patientsList"
                            exact
                            render={(...renderProps) => (
                                <PatientsList {...renderProps} {...this.props} />
                            )}
                        />


                    </Switch>
                </div>
            </Router >
        );
    }
}

export default Routes;