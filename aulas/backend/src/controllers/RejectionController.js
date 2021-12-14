const Booking = require('../models/Booking');

module.exports ={
    async store(req, res){
        const { booking_id } = req.params;

        const booking = await Booking.findById(booking_id).populate('spot');
        
        booking.approved = false;

        await booking.save();

        //id do usuário que pediu a reserva
        const bookingUserSocket = req.connectedUsers[booking.user];

        //envia a mensagem de aprovado para o usuário que solicitou a reserva
        if(bookingUserSocket){
            req.io.to(bookingUserSocket).emit('booking_response', booking);
        }

        return res.json(booking);
        
    }

}