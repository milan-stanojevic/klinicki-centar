import React, { Component } from 'react'
import { Link, Redirect } from 'react-router-dom';
import Isvg from 'react-inlinesvg';
import Page from '../../containers/admin/page';

import OrdinationForm from '../../components/forms/ordinationForm';

import {
    Container,
    Row,
    Col,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownToggle
} from 'reactstrap';

class Ordination extends Component {
    constructor(props) {
        super(props);
        this.add = this.add.bind(this);
        this.state = {

        };
    }
    add(data) {
        console.log(data);

        fetch('http://127.0.0.1:4000/clinic/ordination/' + this.props[0].match.params.id, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('clinicAdminToken')}`
            },
            body: JSON.stringify(data)
        }).then((res) => res.json()).then((result) => {
            if (result.error) {
                this.setState({
                    error: result.error
                })
                return;
            }
            this.props[0].history.push('/clinic/ordinations')
        })
    }

    componentDidMount() {
        if (this.props[0].match.params.id != 'new') {
            fetch('http://127.0.0.1:4000/clinic/ordinations/' + this.props[0].match.params.id, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('clinicAdminToken')}`

                }
            }).then((res) => res.json()).then((result) => {
                this.setState({
                    initialValues: result
                })
                console.log(result);
            })

        }
    }
    
    render() {
        return (
            <div className="page-wrap">
                {
                    !localStorage.clinicAdminToken ? <Redirect to='/login' /> : null
                }

                <Container fluid>

                    <Row className="page-title">
                        <Col lg="12">
                            {this.props[0].match.params.id !== 'new' ? <h3>Izmjeni salu</h3> : <h3>Dodaj salu</h3>}
                        </Col>
                    </Row>
                    {this.state.initialValues ?
                        <OrdinationForm initialValues={this.state.initialValues} onSubmit={this.add} />
                        :
                        <OrdinationForm onSubmit={this.add} />
                    }
                    {
                        this.state.error ?

                            <p>{this.state.error}</p>
                            :
                            null
                    }
                </Container>
                


            </div>
        );
    }
}

export default Page(Ordination)
