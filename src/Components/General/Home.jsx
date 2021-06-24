import React from 'react';
import './Home.scss';
import {useSelector} from 'react-redux';
function Home(props) {
    const isLoggedIn = !!useSelector(state=>state.authSlice.token);
    return (
        <section id='home'>
            Home
        </section>
    )
}

export default Home