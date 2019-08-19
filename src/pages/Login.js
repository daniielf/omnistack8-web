import React, { useState } from 'react';
import './Login.css';
import api from '../services/api';

import logo from '../assets/logo.svg';

export default function Login({ history }) {
    const [username, setUsername] = useState('');
    const [retrievingUser, setRetrievingUser] = useState(false);
    const [submitValid, setSubmitValid] = useState(true);

    async function handleSubmit(event) {
        setRetrievingUser(true);
        setSubmitValid(true);
        event.preventDefault();
        if (username === '') {
            setRetrievingUser(false);
            setSubmitValid(false);
            return;
        }
        const response = await api.post('/devs', { username }).catch((err) => {
            console.log('ERROR', err);
        });

        if (!response || !response.data.ok) {
            setRetrievingUser(false);
            setSubmitValid(false);
            return; 
        }

        setRetrievingUser(false);
        return history.push('/main/' + response.data.user._id)
    }
    return (
        <div className="login-container">            
            <form onSubmit={ handleSubmit }>
                <img className="logo" src={logo} alt="TinDev Logo"></img>
                <input 
                    placeholder="Username"
                    value={username}
                    onChange={ input => setUsername(input.target.value) }></input>
                {submitValid === false && <span className="error" >Não foi possível encontrar este usuário.</span> }
                <button disabled={retrievingUser} type="submit">{ !retrievingUser ? 'Entrar' : 'Carregando...' }</button>
            </form>
        </div>
    );
}

