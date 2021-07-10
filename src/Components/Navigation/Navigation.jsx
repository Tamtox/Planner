import './Navigation.scss';
import { useState } from 'react';
import { NavLink,Link } from 'react-router-dom';
import { useSelector,useDispatch } from 'react-redux';
import { authActions } from '../../Store/Store';
import { useMediaQuery } from 'react-responsive';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faBars} from '@fortawesome/free-solid-svg-icons';
import {faUser} from '@fortawesome/free-regular-svg-icons';
function Navigation(props) {
    const fontSize = {
        fontSize:'1.2rem'
    }
    // Logout
    const isLoggedIn = !!useSelector(state=>state.authSlice.token);
    const dispatch = useDispatch();
    function logout() {
        dispatch(authActions.logout())
    }   
    // Set different navlinks based on window width
    let navLinks 
    const windowMoreThan = useMediaQuery({
        query: '(max-device-width: 992px)'
    })
    // Toggle hamburger menu
    let [navLinksMenu,setNavLinksMenu] = useState(false);
    function toggleNavLinksMenu() {
        setNavLinksMenu(!navLinksMenu)
    }
    if(windowMoreThan) {
        navLinks = (
            <nav id='navLinksMenu' >
                <FontAwesomeIcon id="navIcon" className='hoverFilter' icon={faBars} onClick={toggleNavLinksMenu} />
                {navLinksMenu && <div id="navLinksSlide" className='slide-in-top'>
                    <NavLink style={fontSize} className="navLinkSlide hoverFilter" activeClassName="active" to="/schedule">Schedule</NavLink>
                    <NavLink style={fontSize} className="navLinkSlide hoverFilter" activeClassName="active" to="/todo">To Do</NavLink>
                    <NavLink style={fontSize} className="navLinkSlide hoverFilter" activeClassName="active" to="/habits">Habits</NavLink>
                    <NavLink style={fontSize} className="navLinkSlide hoverFilter" activeClassName="active" to="/journal">Journal</NavLink>
                </div>}
            </nav>
        )
    } else {
        navLinks = (
            <nav id='navLinks'>
                <NavLink className="navLink hoverFilter" activeClassName="active" to="/schedule">Schedule</NavLink>
                <NavLink className="navLink hoverFilter" activeClassName="active" to="/todo">To Do</NavLink>
                <NavLink className="navLink hoverFilter" activeClassName="active" to="/habits">Habits</NavLink>
                <NavLink className="navLink hoverFilter" activeClassName="active" to="/journal">Journal</NavLink>
            </nav>
        )
    }
    // Auth
    let [authMenu,setAuthMenu] = useState(false);
    function toggleAuthMenu() {
        setAuthMenu(!authMenu)
    }
    return (
        <header id="navigation">
            <NavLink id='title' className="navLink" to="/home"><h2>Planner</h2></NavLink>
            {isLoggedIn && navLinks}
            <div id='authMenu'>
                <FontAwesomeIcon id="authIcon" className='hoverFilter' icon={faUser} onClick={toggleAuthMenu} />
                {authMenu && <div id={isLoggedIn?'authLinksSlide':'authLinksSlideWide'} className='slide-in-top'>
                    {!isLoggedIn && <NavLink style={fontSize} className="navLinkSlide hoverFilter" activeClassName="active" to="/auth">Sign In / Sign Up</NavLink>}
                    {isLoggedIn && <NavLink style={fontSize} className="navLinkSlide hoverFilter" activeClassName="active" to="/profile">Profile</NavLink>}
                    {isLoggedIn && <Link style={fontSize} className="navLinkSlide hoverFilter" to="/home" onClick={logout}>Logout</Link>}
                </div>}
            </div>
        </header>
    )
}

export default Navigation