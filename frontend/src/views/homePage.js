import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import Isvg from 'react-inlinesvg';
import Page from '../containers/admin/page';


import {
    Container,
    Row,
    Col,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownToggle
} from 'reactstrap';

class HomePage extends Component {
    constructor(props) {
        super(props);

        this.state = {
        };
    }


    render() {

        return (
            <div className="page-wrap">
                            {
                    !localStorage.patientToken ? <Redirect to='/login' /> : null
                }

            </div>
        );
    }
}

export default Page(HomePage);