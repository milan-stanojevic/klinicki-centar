import React, { Component } from 'react';
import Isvg from 'react-inlinesvg';
import { Link } from 'react-router-dom';
import menu from '../assets/svg/menu.svg';

import list from '../assets/svg/list.svg';
import add from '../assets/svg/add.svg';
import rocket from '../assets/svg/rocket.svg';
import mail from '../assets/svg/mail.svg';
import settings from '../assets/svg/settings.svg';
import exit from '../assets/svg/exit.svg';
import home from '../assets/svg/home.svg';




class Sidebar extends Component {

    constructor(props) {
        super(props);

        this.state = {
            _show: true
        };
    }




    render() {

        return (

            <div className={this.state._show ? `sidebar` : 'sidebar sidebar-hidden'}>
                <div className="items">
                    {localStorage.token ?

                        <>
                            <h6>KLINIKE</h6>
                            <ul>

                                <li>
                                    <Link to='/admin/clinic' className={this.props[0].location.pathname == '/admin/clinic' ? 'active' : null}>
                                        <Isvg src={list} />
                                        Sve klinike
                            </Link>
                                </li>

                                <li>
                                    <Link to='/admin/clinic/new' className={this.props[0].location.pathname == '/admin/clinic/new' ? 'active' : null}>
                                        <Isvg src={list} />
                                        Dodaj kliniku
                            </Link>
                                </li>
                            </ul>
                            <h6>ADMINISTRATORI</h6>
                            <ul>

                                <li>
                                    <Link to='/admin/admins' className={this.props[0].location.pathname == '/admin/admins' ? 'active' : null}>
                                        <Isvg src={list} />
                                        Lista
                            </Link>
                                </li>




                            </ul>


                            <h6>PACIJENTI</h6>
                            <ul>

                                <li>
                                    <Link to='/admin/patients' className={this.props[0].location.pathname == '/admin/patients' ? 'active' : null}>
                                        <Isvg src={list} />
                                        Zahtjevi za registraciju
                            </Link>
                                </li>




                            </ul>



                            <h6>LIJEKOVI</h6>
                            <ul>

                                <li>
                                    <Link to='/admin/medications' className={this.props[0].location.pathname == '/admin/medications' ? 'active' : null}>
                                        <Isvg src={list} />
                                        Lista lijekova
                            </Link>
                                </li>
                                <li>
                                    <Link to='/admin/medications/new' className={this.props[0].location.pathname == '/admin/medications/new' ? 'active' : null}>
                                        <Isvg src={list} />
                                        Dodaj lijek
                            </Link>
                                </li>




                            </ul>


                            <h6>DIJAGNOZE</h6>
                            <ul>

                                <li>
                                    <Link to='/admin/diagnoses' className={this.props[0].location.pathname == '/admin/diagnoses' ? 'active' : null}>
                                        <Isvg src={list} />
                                        Lista dijagnoza
                            </Link>
                                </li>
                                <li>
                                    <Link to='/admin/diagnoses/new' className={this.props[0].location.pathname == '/admin/diagnoses/new' ? 'active' : null}>
                                        <Isvg src={list} />
                                        Dodaj dijagnozu
                            </Link>
                                </li>




                            </ul>

                        </>
                        :
                        null

                    }

                    {
                        localStorage.clinicAdminToken ?
                            <>
                                <h6>Liste</h6>
                                <ul>

                                    <li>
                                        <Link to='/clinic/users' className={this.props[0].location.pathname == '/clinic/users' ? 'active' : null}>
                                            <Isvg src={list} />
                                            Osoblje
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to='/clinic/ordinations' className={this.props[0].location.pathname == '/clinic/ordination' ? 'active' : null}>
                                            <Isvg src={list} />
                                            Sale
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to='/clinic/types' className={this.props[0].location.pathname == '/clinic/types' ? 'active' : null}>
                                            <Isvg src={list} />
                                            Tipovi pregleda
                                        </Link>
                                    </li>
                                    <li>
                                        <Link style={{display: 'block'}} id="clinic-appointments" to='/clinic/appointments' className={this.props[0].location.pathname == '/clinic/appointments' ? 'active' : null}>
                                            <Isvg src={list} />
                                            Slobodni termini
                                        </Link>
                                    </li>
                                </ul>
                                <h6>Zahtjevi</h6>
                                <ul>
                                    <li>
                                        <Link to='/clinic/vacationRequests' className={this.props[0].location.pathname == '/clinic/vacationRequests' ? 'active' : null}>
                                            <Isvg src={list} />
                                            Godišnji odmor
                                        </Link>
                                    </li>
                                    <li>
                                        <Link  to='/clinic/appointmentRequest' style={{display: 'block'}} id="clinic-appointment-requests" className={this.props[0].location.pathname == '/clinic/appointmentRequest' ? 'active' : null}>
                                            <Isvg src={list} />
                                            Termin za pregled
                                        </Link>
                                    </li>

                                </ul>

                                <h6>Uređivanje profila</h6>
                                <ul>
                                    <li>
                                        <Link to='/clinic/admin/edit' className={this.props[0].location.pathname == '/clinic/admin/edit' ? 'active' : null}>
                                            <Isvg src={list} />
                                            Profil klinike
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to='/clinic/admin/update' className={this.props[0].location.pathname == '/clinic/admin/update' ? 'active' : null}>
                                            <Isvg src={list} />
                                            Moj profil
                                        </Link>
                                    </li>

                                </ul>
                                <h6>Izvještaji</h6>
                                <ul>
                                    <li>
                                        <Link to='/clinic/businessReport' className={this.props[0].location.pathname == '/clinic/businessReport' ? 'active' : null}>
                                            <Isvg src={list} />
                                            Poslovanje
                                        </Link>
                                    </li>
                                </ul>
                            </>
                            :
                            null

                    }
                    {
                        localStorage.patientToken ?
                            <>
                                <ul>
                                    <li>
                                        <Link to='/patient' className={this.props[0].location.pathname == '/patient' ? 'active' : null}>
                                            <Isvg src={home} />
                                            Početna stranica
                                        </Link>
                                    </li>
                                </ul>
                            </>
                            :
                            null
                    }
                    {
                        localStorage.clinicUserToken ?
                            <>
                                <ul>
                                    <li>
                                        <Link to='/doctor' className={this.props[0].location.pathname == '/doctor' ? 'active' : null}>
                                            <Isvg src={home} />
                                            Početna stranica
                                        </Link>
                                    </li>
                                </ul>
                            </>
                            :
                            null
                    }

                    <ul className="logout">
                        <li  id="logout" onClick={() => { localStorage.removeItem('token'); localStorage.removeItem('clinicAdminToken'); localStorage.removeItem('clinicUserToken'); localStorage.removeItem('patientToken'); }}>
                            <Link to='/login' id="logout-link" >
                                <Isvg src={exit} />
                                Odjavi se
                            </Link>
                        </li>
                    </ul>


                </div>


                <div className="menu" onClick={() => this.setState({ _show: !this.state._show })}>
                    <Isvg src={menu} />
                </div>

            </div >
        )
    }

};

export default Sidebar;