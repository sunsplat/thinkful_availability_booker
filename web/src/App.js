import React, { Component } from 'react';
import BookingTable from './components/BookingTable';
import AvailabilityTable from './components/AvailabilityTable';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            bookings: {}
        };
        this.fetchToday();
        this.getBookings();
    }

    async fetchToday() {
        try {
            const res = await fetch("http://localhost:4433/today");
            const json = await res.json();
            this.setState({
                today: json.today
            });
        } catch (e) {
            console.error("Failed to fetch 'today' data", e);
        }
    }

    setName = (e) => {
        this.setState({
            name: e.target.value
        });
    }

    clearName = () => {
        this.setState({
            name: ''
        });
        this.getBookings();
    }

    getBookings = async () => {
        try {
            const res = await fetch("http://localhost:4433/getBookings");
            const json = await res.json();
            this.setState({
                bookings: json
            });
        } catch (e) {
            console.error("Failed to fetch 'today' data", e);
        }
    }

    render() {
        return (
            <div className="App container">
                <h1>Book Time with an Advisor</h1>

                {this.state.today && <span id="today">Today is {this.state.today}.</span>}

                <form id="name-form" className="col-md-6">
                    <div className="form-group">
                        <label htmlFor="name-field">Your Name</label>
                        <input type="text" id="name-field" className="form-control" onChange={this.setName} value={this.state.name} />
                    </div>
                </form>
                <div className="App container">
                    <h2>Available Times</h2>
                    <AvailabilityTable name={this.state.name} clearName={this.clearName}/>

                    <h2>Booking Times</h2>
                    <BookingTable bookings={this.state.bookings} />
                </div>
            </div>
        );
    }
}

export default App;
