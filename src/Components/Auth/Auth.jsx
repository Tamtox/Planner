import './Auth.scss';
import LoadingHorizontal from '../Misc/LoadingHorizontal';
import { useRef,useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router';
import {useDispatch} from 'react-redux';
import { authActions} from '../../Store/Store';

function Auth(props) {
    const history = useHistory();
    const dispatch = useDispatch();
    // Toggle sign in/sign up
    const [login, setLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    // Authentication
    const [emailRef,passwordRef,repeatRef] = [useRef(),useRef(),useRef()];
    const authFormSubmit = (event) => {
        event.preventDefault();
        const [emailInput,passwordInput] = [emailRef.current.value,passwordRef.current.value];
        // Check if passwors match
        if(!login) {
            if(passwordInput !== repeatRef.current.value) {
                alert('Passwords do not match!')
                return
            }
        } 
        setLoading(true);
        const params = {
            method: 'post',
            url: `https://identitytoolkit.googleapis.com/v1/accounts:${login?'signInWithPassword':'signUp'}?key=AIzaSyCWbXFWPC5NGkuGKjk33JB4smKgp3vj4pE`,
            headers: {
                'Content-Type': 'application/json'
            },
            data:{
                email:emailInput,
                password:passwordInput,
                returnSecureToken:true
            }
        }
        axios.request(params)
        .then(res => {
            setLoading(false);
            history.replace('/');
            dispatch(authActions.login({idToken:res.data.idToken,userId:res.data.localId}))
            // Create user entry in database on signup
            if(login === false) {
                const newUserObject = {
                    userData:{email:emailInput},
                }
                axios.request({
                    method: "put",
                    url: `https://planner-1487f-default-rtdb.europe-west1.firebasedatabase.app/users/${res.data.localId}.json?auth=${res.data.idToken}`,
                    data: newUserObject,
                }).catch(err=>{
                    alert(err)
                })
            } 
        }).catch(err => {
            setLoading(false)
            alert(err.response.data.error.message)
        })
    }
    return (
        <section id='auth'>
            <div id='authCard'>
                <h1 id='authTitle'>{login?'Sign In':'Sign Up'}</h1>
                <form action="" id='authForm' className={login?'login':'signup'} onSubmit={authFormSubmit}>
                    <input type="email" id='authEmail'  className='authInput focus'  ref={emailRef} placeholder='Email' required/>
                    <input type="password" id='authPassword'  className='authInput focus'  ref={passwordRef} placeholder='Password' required/>
                    {!login&& <input type="password" id='repeatPassword'  className='authInput focus'  ref={repeatRef} placeholder='Repeat Password' required/>}
                    {loading?<LoadingHorizontal />:<button id='authButton' className='hover button'>{login?'Sign In':'Sign Up'}</button>}
                </form>
                <button id='authSwitch' className='hoverFilter' onClick={()=>setLogin(!login)}>{login?"Don't have an account?":'Use existing account'}</button>
            </div>
        </section>
    )
}

export default Auth