import React, { Component } from 'react';

class BookingTable extends Component {
    constructor(props) {
        super(props);
        this.tableHeaders = ['Advisor ID', 'Student Name', 'Date/Time'];
    }
   
    render() {
        const headers = this.tableHeaders.map((header, index) => {
            return <th key={index}>{header}</th>
        });

        let tableRows = []
        const advisorIds = Object.keys(this.props.bookings);
        if (advisorIds.length) {
            tableRows = advisorIds.map((advisorId) => {
                const tableRow = this.props.bookings[advisorId].map((booking, index) => {
                    const displayTime = new Date(booking.time);
                    return (
                        <tr key={index}>
                            <td>{advisorId}</td>
                            <td>{booking.student}</td>
                            <td>
                                <time dateTime={booking.time}>{displayTime.toString()}</time>
                            </td>
                        </tr>
                    );
                }); 
                return tableRow;           
            });
        }
        return (
            <table className="bookings table">
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

export default BookingTable;
