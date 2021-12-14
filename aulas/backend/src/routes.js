const express = require('express');
const multer = require('multer');
const uploadConfig = require('./config/upload');

const ApprovalController = require('./controllers/ApprovalController');
const BookingController = require('./controllers/BookingController');
const DashboardController = require('./controllers/DashboardController');
const RejectionController = require('./controllers/RejectionController');
const SessionController = require('./controllers/SessionController');
const SpotController = require('./controllers/SpotController');

const routes = express.Router();
const upload = multer(uploadConfig);

//cria um novo usuário
routes.post('/sessions', SessionController.store);
// lista todos spots
routes.get('/spots', SpotController.index);
//lista os spots cadastrados por um usuário
routes.get('/dashboard', DashboardController.show);
//cria um novo spot
routes.post('/spots', upload.single('thumbnail'), SpotController.store);
//reserva de spot
routes.post('/spots/:spot_id/booking', BookingController.store);
//aprova solicitação
routes.post('/bookings/:booking_id/approval', ApprovalController.store);
//rejeitar solicitação
routes.post('/bookings/:booking_id/rejection', RejectionController.store);

module.exports = routes;