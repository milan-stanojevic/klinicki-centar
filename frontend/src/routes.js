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
import PatientEdit from './views/patient/editProfile';
import PatientClinicList from './views/patient/clinicList';
import DoctorsList from './views/patient/doctorsList'
import ClinicView from './views/patient/clinicView'
import ClinicAppointments from './views/patient/clinicAppointments'


import ClinicAdminLogin from './views/clinic/login';
import ClinicEdit from './views/clinic/editClinic';
import DocHomePage from './views/doctor/home'
import PatientsList from './views/doctor/patientsList'
import EditProfile from './views/doctor/editProfile'
import PatientPage from './views/doctor/patientPage'
import PatientHomePage from './views/patient/patientHomePage'


import ClinicUser from './views/clinic/user'
import ClinicUsers from './views/clinic/users'
import Ordinations from './views/clinic/ordinations'
import Types from './views/clinic/types'
import Type from './views/clinic/type'
import Appointments from './views/clinic/appointments'
import Appointment from './views/clinic/appointment'




import Ordination from './views/clinic/ordination'
import EditProfileCA from './views/admin/editProfileCA'
import ClinicUserLogin from './views/patient/login'
import editProfileCA from './views/admin/editProfileCA';
import Admin from './views/admin/admin';
import Admins from './views/admin/admins';

import ChangePassword from './views/admin/changePassword';
import Vacation from './views/doctor/vacation'
import VacationRequest from './views/clinic/vacationRequest';
import AppointmentRequest from './views/clinic/appointmentRequest';
import MedicationsList from './views/admin/medicationsList';
import Medication from './views/admin/medication';
import DiagnosesList from './views/admin/diagnosesList';
import Diagnose from './views/admin/diagnose';
import MedicalRecord from './views/patient/medicalRecord';
import Calendar from './views/doctor/calendar';

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
                            path="/clinic/vacationRequests"
                            exact
                            render={(...renderProps) => (
                                <VacationRequest {...renderProps} {...this.props} />
                            )}
                        />
                        
                        <Route
                            path="/clinic/appointmentRequest"
                            exact
                            render={(...renderProps) => (
                                <AppointmentRequest {...renderProps} {...this.props} />
                            )}
                        />

                        <Route
                            path="/admin/changePassword"
                            exact
                            render={(...renderProps) => (
                                <ChangePassword {...renderProps} {...this.props} />
                            )}
                        />


                        <Route
                            path="/admin/admins"
                            exact
                            render={(...renderProps) => (
                                <Admins {...renderProps} {...this.props} />
                            )}
                        />


                        <Route
                            path="/admin/medications"
                            exact
                            render={(...renderProps) => (
                                <MedicationsList {...renderProps} {...this.props} />
                            )}
                        />

                        <Route
                            path="/admin/medications/:id"
                            exact
                            render={(...renderProps) => (
                                <Medication {...renderProps} {...this.props} />
                            )}
                        />


                        <Route
                            path="/admin/diagnoses"
                            exact
                            render={(...renderProps) => (
                                <DiagnosesList {...renderProps} {...this.props} />
                            )}
                        />

                        <Route
                            path="/admin/diagnoses/:id"
                            exact
                            render={(...renderProps) => (
                                <Diagnose {...renderProps} {...this.props} />
                            )}
                        />


                        <Route
                            path="/admin/admins/:id"
                            exact
                            render={(...renderProps) => (
                                <Admin {...renderProps} {...this.props} />
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
                            path="/doctor/patient/:id"
                            exact
                            render={(...renderProps) => (
                                <PatientPage {...renderProps} {...this.props} />
                            )}
                        />

                        <Route
                            path="/doctor/vacation"
                            exact
                            render={(...renderProps) => (
                                <Vacation {...renderProps} {...this.props} />
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
                            path="/patient/clinics"
                            exact
                            render={(...renderProps) => (
                                <PatientClinicList {...renderProps} {...this.props} />
                            )}
                        />

                        <Route
                            path="/patient/clinic/doctors"
                            exact
                            render={(...renderProps) => (
                                <DoctorsList {...renderProps} {...this.props} />
                            )}
                        />
                        
                        <Route
                            path="/patient/clinic/appointements"
                            exact
                            render={(...renderProps) => (
                                <ClinicAppointments {...renderProps} {...this.props} />
                            )}
                        />
                        
                        <Route
                            path="/patient/clinic"
                            exact
                            render={(...renderProps) => (
                                <ClinicView {...renderProps} {...this.props} />
                            )}
                        />
                        <Route
                            path="/patient/update"
                            exact
                            render={(...renderProps) => (
                                <PatientEdit {...renderProps} {...this.props} />
                            )}
                        />
                        <Route
                            path="/clinic/users/:id"
                            exact
                            render={(...renderProps) => (
                                <ClinicUser {...renderProps} {...this.props} />
                            )}
                        />
                        <Route
                            path="/clinic/users"
                            exact
                            render={(...renderProps) => (
                                <ClinicUsers {...renderProps} {...this.props} />
                            )}
                        />
                        <Route
                            path="/clinic/ordinations"
                            exact
                            render={(...renderProps) => (
                                <Ordinations {...renderProps} {...this.props} />
                            )}
                        />
                        <Route
                            path="/clinic/ordination/:id"
                            exact
                            render={(...renderProps) => (
                                <Ordination {...renderProps} {...this.props} />
                            )}
                        />
                        <Route
                            path="/clinic/types"
                            exact
                            render={(...renderProps) => (
                                <Types {...renderProps} {...this.props} />
                            )}
                        />
                        <Route
                            path="/clinic/appointments"
                            exact
                            render={(...renderProps) => (
                                <Appointments {...renderProps} {...this.props} />
                            )}
                        />
                        <Route
                            path="/clinic/appointments/:id"
                            exact
                            render={(...renderProps) => (
                                <Appointment {...renderProps} {...this.props} />
                            )}
                        />
                        <Route
                            path="/clinic/types/:id"
                            exact
                            render={(...renderProps) => (
                                <Type {...renderProps} {...this.props} />
                            )}
                        />

                        <Route
                            path="/doctor/patients"
                            exact
                            render={(...renderProps) => (
                                <PatientsList {...renderProps} {...this.props} />
                            )}
                        />
                        <Route
                            path="/clinic/admin/update"
                            exact
                            render={(...renderProps) => (
                                <EditProfileCA {...renderProps} {...this.props} />
                            )}
                        />

                        <Route
                            path="/patient/medicalRecord"
                            exact
                            render={(...renderProps) => (
                                <MedicalRecord {...renderProps} {...this.props} />
                            )}
                        />

                        <Route
                            path="/doctor/calendar"
                            exact
                            render={(...renderProps) => (
                                <Calendar {...renderProps} {...this.props} />
                            )}
                        />



                    </Switch>
                </div>
            </Router >
        );
    }
}

export default Routes;