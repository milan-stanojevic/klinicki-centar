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

                <h6>PACIJENTI</h6>
                    <ul>

                        <li>
                            <Link to='/admin/patients' className={this.props[0].location.pathname == '/admin/patients' ? 'active' : null}>
                                <Isvg src={list} />
                                Zahtjevi za registraciju
                            </Link>
                        </li>

                       


                    </ul>


                    <ul className="logout">
                        <li onClick={() => localStorage.removeItem('token')}>
                            <Link to='/admin/login' >
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