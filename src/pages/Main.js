import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './Main.css';

import api from '../services/api';

import logo from '../assets/logo.svg';
import dislike from '../assets/dislike.svg';
import like from '../assets/like.svg';
import matchLogo from '../assets/itsamatch@3x.png';


export default function Main({ match }) {
    const [usersList, setList] = useState([]);
    const [userMatch, setMatch] = useState(null);
    useEffect(() => { 
        async function loadUsers() {
            const response = await api.get('devs/' + match.params.id + '/list');
            setList(response.data.list);
        }
        loadUsers();
    }, [match.params.id] );

    useEffect(() => {
        const socket = io('http://localhost:3333', {
            query: { user_id: match.params.id }
        });

        socket.on('match', (user) => {
            userGotAMatch(user);
        });
    }, [match.params.id]);

    function userGotAMatch(target) {
        console.log('NEW MATCH', target);
        setMatch(target);
    }

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

    function dismissMatch() {
        setMatch(null);
    }

    return (
        <div className="main-container">
            { userMatch && (
                <div className="its-a-match">
                    <img width="200px" src={matchLogo} alt="Its a Match!"></img>
                    <img className="match-avatar" src={userMatch.avatar} alt="Its a Match!"></img>
                    <span className="match-user-name">{userMatch.name}</span>
                    <button className="close-match-window-text" onClick={dismissMatch}>Fechar</button>
                </div>
            )}
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