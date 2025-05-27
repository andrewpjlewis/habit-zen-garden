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
                <button onClick={(closeTutorial)}>❌</button>
                <h1>Welcome</h1>
            <Footer />
        </main>
    )
}

export default Welcome;