import React, { useState, useEffect } from 'react';
import './Main.css';

import api from '../services/api';

import logo from '../assets/logo.svg';
import dislike from '../assets/dislike.svg';
import like from '../assets/like.svg';

export default function Main({ match }) {
    const [usersList, setList] = useState([]);

    useEffect(() => { 
        async function loadUsers() {
            const response = await api.get('devs/' + match.params.id + '/list');
            setList(response.data.list);
        }
        loadUsers();
    }, [match.params.username] )

    async function handleLike(targetId) {
        const like = await api.post('devs/likes', {
            origin: match.params.id,
            dest: targetId
        });

        if (like.data.ok) {
            setList(usersList.filter((user) => { return user._id !== targetId }))
        }
    }

    async function handleDislike(targetId) {
        const like = await api.post('devs/dislikes', {
            origin: match.params.id,
            dest: targetId
        });

        if (like.data.ok) {
            setList(usersList.filter((user) => { return user._id !== targetId }))
        }
    }

    return (
        <div className="main-container">
            <img src={logo} alt="TinDev Logo" />
            
                { usersList.length === 0 ? 
                    <p className="no-list" >Ninguém perto de você :(</p> : 
                    (<ul> 
                        {usersList.map((user) => {
                            return (
                                    <li key={user._id}>
                                        <img src={user.avatar} />
                                        <footer>
                                            <strong>{ user.name }</strong>
                                            <p>{user.bio}</p>
                                        </footer>
                    
                                        <div className="buttons">
                                            <button type="button"  onClick={() => {
                                                handleDislike(user._id);
                                            }}>
                                                <img src={dislike} alt="dislike" />
                                            </button>
                                            <button type="button" onClick={() => {
                                                handleLike(user._id);
                                            }}>
                                                <img src={like} alt="like" />
                                            </button>
                                        </div>
                                    </li>
                            )
                        })
                    }</ul>)
                }
        </div>
    )
};