import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';


function Welcome() {
    const navigate = useNavigate();
    
    const closeTutorial = () => {
        navigate('/dashboard');
    }
    return (
        <main>
            <Header />
                <div class="welcomeMessage">
                    <button onClick={(closeTutorial)}>❌</button>
                    <div class="welcomeMessage_header">
                        <h1>Welcome</h1>
                        <h3>Let's get started</h3>
                    </div>
                </div>
            <Footer />
        </main>
    )
}

export default Welcome;