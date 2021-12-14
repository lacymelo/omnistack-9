import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

export default function Login(){

    const navigate = useNavigate();

    const [email, setEmail] = useState({
        email: '',
    });
    
    const changeInput = e => setEmail({
    ...email, [e.target.name]: e.target.value
    });
    
    const handleSubmit = e => {
        e.preventDefault();
    
        api.post('/sessions', email)
        .then((response) => {
          const { _id } = response.data;
          //armazena o _id no localStorage
          localStorage.setItem('user', _id);
          return navigate('/dashboard');
        }).catch((err) => {
          console.log(err.response);
        });
    }

    return(
        <>
            <p>
            Ofereça <strong>spots</strong> para programadores e encontre <strong>talentos</strong> para sua empresa
            </p>

            <form onSubmit={handleSubmit}>
            <label htmlFor="email">E-mail *</label>
            <input 
            id="email" 
            name="email" 
            type="email" 
            placeholder="seu melhor e-mail" 
            onChange={changeInput}/>

            <button type="submit" className="btn">Entrar</button>
            </form>
        </>
    );
}