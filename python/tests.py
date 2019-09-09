from unittest import TestCase, mock
from datetime import date
import json, app as main_app
from app import app


class TestApp(TestCase):


    @mock.patch('app.getAllAppointments')
    @mock.patch('app.BOOKED_APPOINTMENTS', {'372955': [{'student': 'test', 'time': '2019-08-27T11:00:00-04:00'}]})
    def test_getAvailability(self, mock_getAllAppointments):
        mock_getAllAppointments.return_value = {'372955': ['2019-08-27T11:00:00-04:00', '2019-08-27T12:00:00-04:00']}
        with app.test_client() as cli:
            resp = cli.get('/getAvailability')
            self.assertEqual(resp.status_code, 200)
            self.assertEqual(resp.json, {"372955": ["2019-08-27T12:00:00-04:00"]})


    @mock.patch('app.requests')
    def test_getAllAppointments(self, mock_request):
        mock_request.get.return_value.text ='{"2019-08-25": {"2019-08-25T20:00:00-04:00": 319369}}'
        resp = main_app.getAllAppointments()
        mock_request.get.assert_called_with("https://www.thinkful.com/api/advisors/availability")
        self.assertEqual(resp, {319369: ["2019-08-25T20:00:00-04:00"]})


    @mock.patch('app.requests')
    def test_getAllAppointments_fail(self, mock_request):
        mock_request.get.return_value = False
        resp = main_app.getAllAppointments()
        mock_request.get.assert_called_with("https://www.thinkful.com/api/advisors/availability")
        self.assertEqual(resp, {})

    
    @mock.patch('app.BOOKED_APPOINTMENTS', {'372955': [{'student': 'test', 'time': '2019-08-27T11:00:00-04:00'}]})
    def test_getBookings(self):
        with app.test_client() as cli:
            resp = cli.get('/getBookings')
            self.assertEqual(resp.status_code, 200)
            self.assertEqual(resp.json, {'372955': [{'student': 'test', 'time': '2019-08-27T11:00:00-04:00'}]})
    

    @mock.patch('app.BOOKED_APPOINTMENTS', {})
    @mock.patch('app.request')
    def test_postAppointment(self, mock_request):
        mock_request.data = '{"studentName": "test", "advisorId": "372955", "timeSlot": "2019-08-27T11:00:00-04:00"}'
        with app.test_client() as cli:
            resp = cli.post('/saveAppointment')
            self.assertEqual(main_app.BOOKED_APPOINTMENTS, {'372955': [{'student': 'test', 'time': '2019-08-27T11:00:00-04:00'}]})
    

    def test_today(self):
        with app.test_client() as cli:
            resp = cli.get('/today')
            assert resp.status_code == 200
            assert resp.json == {"today": "{}".format(date.today())}



