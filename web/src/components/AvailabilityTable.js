import React, { Component } from 'react';

class AvailabilityTable extends Component {
    constructor(props) {
        super(props);
        this.tableHeaders = ['Advisor ID', 'Availabilities'];
        this.state = {
            appointments: [],
            timeSlot: '',
            advisorId: ''
        };
        this.getAppointments();
    }

    getAppointments = async () => {
        try {
            const res = await fetch("http://localhost:4433/getAvailability");
            const json = await res.json();
            this.setState({appointments: json});
        } catch (e) {
            console.error("Failed to fetch availability data", e);
        }
    }

    isNameValid = (name) => {
        if (name.length && (/^[a-z ,.'-]+$/i).test(name)) {
            return true;
        } else {
            return false;
        }
    }

    saveTimeSlot = async (timeSlot, advisorId, name = this.props.name) => {
        if (this.isNameValid(name)) {
            await this.setState({
                timeSlot: timeSlot,
                advisorId: advisorId
            });
            this.submitTimeSlot();
        } else {
            alert('Please enter a valid name.');
        }
    }

    submitTimeSlot = () => {
        fetch("http://localhost:4433/saveAppointment", {
            method: "post",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                studentName: this.props.name,
                advisorId: this.state.advisorId,
                timeSlot: this.state.timeSlot
            })
        })
            .then( (response) => { 
                if (response.status === 200) {
                    alert('Appointment Saved!');
                    this.setState({
                        advisorId: '',
                        timeSlot: ''
                    });
                    this.getAppointments();
                    this.props.clearName();
                }
            });
    }

    render() {
        const headers = this.tableHeaders.map((header, index) => {
            return <th key={index}>{header}</th>
        });

        const tableRows = Object.keys(this.state.appointments).map((advisorId, index) => {
            const timeSlots = this.state.appointments[advisorId].sort().map((slot, index) => {
                let bookTime = new Date(slot);
                return (
                    <li key={index}>
                        <time dateTime={slot} className="book-time">{bookTime.toLocaleString().replace(',', '')}</time>
                        <button className="book btn-small btn-primary" onClick={() => this.saveTimeSlot(slot, advisorId)} value={slot}>Book</button>
                    </li>
                );
            });
            return (
                <tr key={index}>
                    <td>{advisorId}</td>
                    <td>
                        <ul className="list-unstyled">
                            {timeSlots}
                        </ul>
                    </td>
                </tr>
            );
        });

        return (
            <table className="advisors table">
                <thead>
                    <tr>
                        {headers}
                    </tr>
                </thead>
                <tbody>
                    {tableRows ? tableRows : 'No booked appointments.'}
                </tbody>
            </table>
        );
    }
}

export default AvailabilityTable;
