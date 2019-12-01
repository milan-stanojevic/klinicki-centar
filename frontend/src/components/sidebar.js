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



                            <h6>LEKOVI</h6>
                            <ul>

                                <li>
                                    <Link to='/admin/medications' className={this.props[0].location.pathname == '/admin/medications' ? 'active' : null}>
                                        <Isvg src={list} />
                                        Lista lekova
                            </Link>
                                </li>
                                <li>
                                    <Link to='/admin/medications/new' className={this.props[0].location.pathname == '/admin/medications/new' ? 'active' : null}>
                                        <Isvg src={list} />
                                        Dodaj lek
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
                                <h6>OSOBLJE</h6>
                                <ul>

                                    <li>
                                        <Link to='/clinic/users' className={this.props[0].location.pathname == '/clinic/users' ? 'active' : null}>
                                            <Isvg src={list} />
                                            Lista osoblja
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to='/clinic/ordinations' className={this.props[0].location.pathname == '/clinic/ordination' ? 'active' : null}>
                                            <Isvg src={list} />
                                            Lista sala
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to='/clinic/types' className={this.props[0].location.pathname == '/clinic/types' ? 'active' : null}>
                                            <Isvg src={list} />
                                            Lista tipova pregleda
                                        </Link>
                                    </li>

                                    <li>
                                        <Link to='/clinic/admin/edit' className={this.props[0].location.pathname == '/clinic/admin/edit' ? 'active' : null}>
                                            <Isvg src={list} />
                                            Uredjivanje profila klinike
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to='/clinic/admin/update' className={this.props[0].location.pathname == '/clinic/admin/update' ? 'active' : null}>
                                            <Isvg src={list} />
                                            Moj profil
                                        </Link>
                                    </li>

                                </ul>
                            </>
                            :
                            null

                    }

                    <ul className="logout">
                        <li onClick={() => { localStorage.removeItem('token'); localStorage.removeItem('clinicAdminToken'); localStorage.removeItem('clinicUserToken'); localStorage.removeItem('patientToken'); }}>
                            <Link to='/login' >
                                <Isvg src={exit} />
                                Odjavi se
                            </Link>
                        </li>
                    </ul>


                </div>


                <div className="menu" onClick={() => this.setState({ _show: !this.state._show })}>
                    <Isvg src={menu} />
                </div>

            </div>
        )
    }

};

export default Sidebar;