import React, { useState, useMemo } from "react";
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import camera from '../../assets/camera.svg';
import './styles.css'

export default function New(){

    const navigate = useNavigate();

    const [ data, setNew ] = useState({
        thumbnail: null,
        company: '',
        price: '',
        techs: '',
    });

    const preview = useMemo(() => {
        return data.thumbnail ? URL.createObjectURL(data.thumbnail) : null
    },[data.thumbnail]
    )

    async function handleSubmit (event) {
        event.preventDefault();

        const dataForm = new FormData();
        const user_id = localStorage.getItem('user');

        dataForm.append('thumbnail', data.thumbnail);
        dataForm.append('company', data.company);
        dataForm.append('techs', data.techs);
        dataForm.append('price', data.price);
        
        await api.post('/spots', dataForm, {headers: {user_id}});

        return navigate('/dashboard');
    }

    const handleInput = e => setNew ({
        ...data, [e.target.name]: e.target.value
    });

    const handleFile = e => setNew ({
        ...data, [e.target.name]: e.target.files[0]
    });

    return(
        <form onSubmit={handleSubmit}>
            <label 
                id="thumbnail" 
                style={{ backgroundImage: `url(${preview})` }}
                className={ data.thumbnail ? 'has-thumbnail' : '' }
                >
                <input 
                type="file"
                name="thumbnail"
                onChange={handleFile}
                />
                <img src={camera} alt="select img" />
            </label>

            <label htmlFor="company">EMPRESA *</label>
            <input 
            type="text"
            id="company"
            placeholder="Sua empresa incrível"
            name="company"
            onChange={handleInput}
            />

            <label htmlFor="techs">TECNOLOGIAS * <span>(separadas por vírgula)</span></label>
            <input 
            type="text"
            id="techs"
            placeholder="Quais tecnologias usam"
            name="techs"
            onChange={handleInput}
            />
            <label htmlFor="price">VALOR DA DIÁRIO * <span>(em branco para GRATUITO)</span></label>
            <input 
            type="text"
            id="price"
            placeholder="preço"
            name="price"
            onChange={handleInput}
            />

            <button type="submit" className="btn">Cadastrar</button>
        </form>
    );
}