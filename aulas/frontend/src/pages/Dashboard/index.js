import React, { useEffect, useState, useMemo} from "react";
import { Link } from "react-router-dom";
import io from 'socket.io-client';
import api from '../../services/api';

import './styles.css';

export default function Dashboard(){

    const [spots, setSpots] = useState([]);
    const [books, setBooks] = useState([]);

    const user_id = localStorage.getItem('user');

    //informações do usuário logado
    const socket = useMemo(() => io('http://localhost:3333', {
        query: { user_id },
    }), [user_id]);

    useEffect(() => {
        // nova mensagem enviada do servidor
        socket.on('booking_request', data => {
            setBooks([...books, data]);
        });
    }, [books, socket]);

    useEffect(() => {
        async function loadSpots(){

            const user_id = localStorage.getItem('user');

            const response = await api.get('/dashboard', {headers: {user_id}});

            setSpots(response.data);
        }

        loadSpots();
    }, []);

    async function handleApproved(id){
        await api.post(`/bookings/${id}/approval`);

        //filtra por requisições que sejam diferentes do id aprovado
        setBooks(books.filter(request => request._id !== id));
    }

    async function handleReject(id){
        await api.post(`/bookings/${id}/rejection`);

        //filtra por requisições que sejam diferentes do id aprovado
        setBooks(books.filter(request => request._id !== id));
    }
    
    return(
        <>
            <ul className="notifications">
                {books.map(request => (
                    <li key={request._id}>
                        <p>
                            <strong>{request.user.email}</strong> está solicitando uma reserva em <strong>{request.spot.company}</strong> para a data: <strong>{request.date}</strong>
                        </p>

                        <button className="accept" onClick={() => handleApproved(request._id)}>ACEITAR</button>
                        <button className="reject" onClick={() => handleReject(request._id)}>REJEITAR</button>
                    </li>
                ))}
            </ul>

            <ul className="spot-list">
                {spots.map(spot => (
                    <li key={spot._id}>
                        <img src={spot.thumbnail_url} className="img-thumbnail" alt={spot.company}/>
                        <strong>{spot.company}</strong>
                        <span>{spot.price ? `R${spot.price}/dia` : 'Gratuito'}</span>
                    </li>
                ))}
            </ul>

            <Link to="/new">
                <button className="btn">
                    Cadastrar novo spot
                </button>
            </Link>
        </>
    );
}