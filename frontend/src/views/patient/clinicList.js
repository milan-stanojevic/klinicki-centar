import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import Isvg from 'react-inlinesvg';
import Page from '../../containers/admin/page';
import PatientSearchClinicForm from '../../components/forms/patientSearchClinicForm';
import Select from '../../components/forms/fields/select'


//import editIcon from '../../assets/svg/edit.svg';
//import deleteIcon from '../../assets/svg/delete.svg';
//import adminIcon from '../../assets/svg/admin.svg';


import {
    Container,
    Row,
    Col,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownToggle
} from 'reactstrap';

class ClinicList extends Component {
    constructor(props) {
        super(props);
        this.get = this.get.bind(this);
        this.search = this.search.bind(this);
        this.gmapCallback = this.gmapCallback.bind(this);
        window.googleMapsCallback = this.gmapCallback;

        this.state = {
            items: [],
            sort: 0
        };
    }

    gmapCallback() {
        this.setState({
            _googleMapsLoaded: true
        })
    }


    initMap() {
        this.setState({
            _mapInit: true
        });
        var latLng = new window.google.maps.LatLng(44.770835, 19.697928
        );

        var map = new window.google.maps.Map(this.GoogleMap, {
            zoom: 10,
            center: latLng,
            mapTypeId: window.google.maps.MapTypeId.ROADMAP,
            disableDefaultUI: true,
            gestureHandling: "gestureHandling",

        });

        let check = false;

        for(let i=0;i<this.state.items.length;i++){
            if (!this.state.items[i].coords){
                continue;
            }

            if (!check){
                map.setCenter(new window.google.maps.LatLng(this.state.items[i].coords.split(',')[0], this.state.items[i].coords.split(',')[1]))
                check = true;
            }

            var marker = new window.google.maps.Marker({
                position: new window.google.maps.LatLng(this.state.items[i].coords.split(',')[0], this.state.items[i].coords.split(',')[1]),
                map: map,
            });

            marker.addListener('click', () => {
                this.props[0].history.push(`/patient/clinic/${this.state.items[i]._id}`);
            });
            
    
        }


    }


    componentDidMount() {
        this.get();


        var ref = window.document.getElementsByTagName("script")[0];
        var script = window.document.createElement("script");
        script.src = "https://maps.googleapis.com/maps/api/js?sensor=false&key=AIzaSyAaSt58UDZVRmMYe52a3cCPfJaoCaHUJqY&callback=googleMapsCallback&language=hr&region=BA";
        script.async = true;
        script.defer = true;

        ref.parentNode.insertBefore(script, ref);


        if (this.state._googleMapsLoaded && this.state.items.length && !this.state._mapInit) {
            this.initMap();
        }


    }

    componentDidUpdate(prevProps) {

        if (this.state._googleMapsLoaded && this.state.items.length && !this.state._mapInit) {
            this.initMap();
        }


    }

    get() {
        if (!localStorage.patientToken) {
            return;
        }

        fetch('http://127.0.0.1:4000/patient/clinic/' + this.state.sort, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('patientToken')}`
            },
        }).then((res) => res.json()).then((result) => {
            this.setState({
                items: result
            })
        })

    }
    search(data) {
        if (!localStorage.patientToken) {
            return;
        }

        fetch('http://127.0.0.1:4000/patient/clinic/' + this.state.sort, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('patientToken')}`
            },
            body: JSON.stringify(data),
        }).then((res) => res.json()).then((result) => {
            this.setState({
                items: result
            })
        })

    }



    render() {

        return (
            <div className="page-wrap">
                {
                    !localStorage.patientToken ? <Redirect to='/login' /> : null
                }

                <Container fluid className="table">

                    <Row className="page-title">
                        <Col lg="8">
                            <h3>Lista klinika</h3>
                        </Col>
                        <Col lg="4">
                            <Select placeholder="Sortiraj po" onChange={(val) => this.setState({ sort: val }, this.get)} value={this.state.sort}>
                                <option value={0}>Po nazivu</option>
                                <option value={1}>Po adresi</option>
                                <option value={2}>Po ocjeni</option>
                            </Select>
                        </Col>
                    </Row>
                    <Row>
                        <Col lg="12">
                            <PatientSearchClinicForm onSubmit={this.search} />
                        </Col>
                    </Row>
                    <Row className="table-head">
                        <Col lg="4">
                            <span className="name">NAZIV</span>
                        </Col>
                        <Col lg="4">
                            <span className="name">ADRESA</span>
                        </Col>
                        <Col lg="4">
                            <span className="name">OCJENA</span>
                        </Col>


                    </Row>
                    {
                        this.state.items.map((item, idx) => {
                            return (
                                <Link to={`/patient/clinic/${item._id}`}>
                                    <Row className="table-row" key={idx}>
                                        <Col lg="4">
                                            <span className="value">{item.name}</span>
                                        </Col>
                                        <Col lg="4">
                                            <span className="value">{item.adress}</span>
                                        </Col>
                                        <Col lg="4">
                                            <span className="value">{item.avgRating}</span>
                                        </Col>
                                    </Row>
                                </Link>
                            )
                        })
                    }
                    <Row>
                        <Col lg="12">
                            <div className="map-wrap">{
                                this.state._googleMapsLoaded ?
                                    <div className="map" ref={(input) => { this.GoogleMap = input; }}>

                                    </div>
                                    : null}

                            </div>

                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}

export default Page(ClinicList);