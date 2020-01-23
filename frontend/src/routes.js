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
import IllnessHistory from './views/patient/illnessHistory'
import ClinicView from './views/patient/clinicView'
import ClinicAppointments from './views/patient/clinicAppointments'
import Grading from './views/patient/grading'
import GradingDoctor from './views/patient/gradingDoctor'






import ClinicAdminLogin from './views/clinic/login';
import ClinicEdit from './views/clinic/editClinic';
import DocHomePage from './views/doctor/home'
import PatientsList from './views/doctor/patientsList'
import MakingAppointment from './views/doctor/makingAppointment'
import EditProfile from './views/doctor/editProfile'
import PatientPage from './views/doctor/patientPage'
import PatientHomePage from './views/patient/patientHomePage'
import DoctorView from './views/patient/doctorView'


import DoctorsRating from './views/clinic/doctorsRating'
import BusinessReport from './views/clinic/businessReport'
import ClinicUser from './views/clinic/user'
import ClinicUsers from './views/clinic/users'
import Ordinations from './views/clinic/ordinations'
import Types from './views/clinic/types'
import Type from './views/clinic/type'
import Appointments from './views/clinic/appointments'
import Appointment from './views/clinic/appointment'
import CompletedExaminations from './views/clinic/completedExaminations'


import Ordination from './views/clinic/ordination'
import EditProfileCA from './views/admin/editProfileCA'
import ClinicUserLogin from './views/patient/login'
import editProfileCA from './views/admin/editProfileCA';
import Admin from './views/admin/admin';
import Admins from './views/admin/admins';


import ChangePasswordDoc from './views/clinic/changePasswordDoc';
import ChangePassword from './views/admin/changePassword';
import ChangePasswordCA from './views/clinic/changePasswordCA';
import Vacation from './views/doctor/vacation'
import VacationRequest from './views/clinic/vacationRequest';
import AppointmentRequest from './views/clinic/appointmentRequest';
import MedicationsList from './views/admin/medicationsList';
import Medication from './views/admin/medication';
import DiagnosesList from './views/admin/diagnosesList';
import Diagnose from './views/admin/diagnose';
import MedicalRecord from './views/patient/medicalRecord';
import Calendar from './views/doctor/calendar';
import Examination from './views/doctor/examination';
import DoctorMedicalRecord from './views/doctor/medicalRecord';
import EditMedicalRecord from './views/doctor/editMedicalRecord';
import RecipeAuth from './views/doctor/recipeAuth';

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
                            path="/admin/changePasswordCA"
                            exact
                            render={(...renderProps) => (
                                <ChangePasswordCA {...renderProps} {...this.props} />
                            )}
                        />
                        <Route
                            path="/doctor/changePassword"
                            exact
                            render={(...renderProps) => (
                                <ChangePasswordDoc {...renderProps} {...this.props} />
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
                            path="/doctor/patient/:id/medicalRecord"
                            exact
                            render={(...renderProps) => (
                                <DoctorMedicalRecord {...renderProps} {...this.props} />
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
                            path="/doctor/makingAppointment"
                            exact
                            render={(...renderProps) => (
                                <MakingAppointment {...renderProps} {...this.props} />
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
                            path="/doctor/medicalRecord/:patient/:id"
                            exact
                            render={(...renderProps) => (
                                <EditMedicalRecord {...renderProps} {...this.props} />
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
                            path="/patient/clinic/history"
                            exact
                            render={(...renderProps) => (
                                <IllnessHistory {...renderProps} {...this.props} />
                            )}
                        />

                        <Route
                            path="/patient/clinic/doctors/:uid"
                            exact
                            render={(...renderProps) => (
                                <DoctorView {...renderProps} {...this.props} />
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
                            path="/patient/clinic/history/grading"
                            exact
                            render={(...renderProps) => (
                                <Grading {...renderProps} {...this.props} />
                            )}
                        />
                        <Route
                            path="/patient/clinic/history/gradingDoctor"
                            exact
                            render={(...renderProps) => (
                                <GradingDoctor {...renderProps} {...this.props} />
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
                            path="/clinic/businessReport"
                            exact
                            render={(...renderProps) => (
                                <BusinessReport {...renderProps} {...this.props} />
                            )}
                        />
                        
                        <Route
                            path="/clinic/businessReport/doctors"
                            exact
                            render={(...renderProps) => (
                                <DoctorsRating {...renderProps} {...this.props} />
                            )}
                        />
                        <Route
                            path="/clinic/businessReport/completedExaminations"
                            exact
                            render={(...renderProps) => (
                                <CompletedExaminations {...renderProps} {...this.props} />
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
                            path="/doctor/examination/:id"
                            exact
                            render={(...renderProps) => (
                                <Examination {...renderProps} {...this.props} />
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
                        <Route
                            path="/doctor/recipeAuth"
                            exact
                            render={(...renderProps) => (
                                <RecipeAuth {...renderProps} {...this.props} />
                            )}
                        />


                        <Route
                            path="/doctor/makingAppointment/:id"
                            exact
                            render={(...renderProps) => (
                                <MakingAppointment {...renderProps} {...this.props} />
                            )}
                        />


                    </Switch>
                </div>
            </Router >
        );
    }
}

export default Routes;