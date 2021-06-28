import './Profile.scss';
import { useState,useRef } from 'react';
import { useSelector,useDispatch } from 'react-redux';
import { authActions } from '../../Store/Store';
import axios from 'axios';
import Loading from '../Misc/Loading';

function Profile(props) {
    const [loading, setLoading] = useState(true);
    const token = useSelector(state=>state.authSlice.token);
    const profileData = useSelector(state=>state.authSlice.user);
    const dispatch = useDispatch();
    const passwordChangeRef = useRef();
    // Profile Info Fetch
    if(profileData.email === null) {
        const params = {
            method: 'post',
            url: `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=AIzaSyCWbXFWPC5NGkuGKjk33JB4smKgp3vj4pE`,
            headers: {
                'Content-Type': 'application/json'
            },
            data:{
                idToken:token
            }
        }
        axios.request(params)
        .then(res => {
            setLoading(false);
            dispatch(authActions.setProfileInfo({email:res.data.users[0].email,createdAt:res.data.users[0].createdAt,lastLogin:res.data.users[0].lastLoginAt}));
        })
        .catch(err => {
            alert(err.response.data.error.message)
        })
    }
    // Change Password
    let [passwordChangeTitle,setPasswordChangeTitle] = useState('Change Password');
    function changePassword(event) {
        event.preventDefault();
        const newPassword = passwordChangeRef.current.value
        const params = {
            method: 'post',
            url: `https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyCWbXFWPC5NGkuGKjk33JB4smKgp3vj4pE`,
            headers: {
                'Content-Type': 'application/json'
            },
            data:{
                idToken:token,
                password:newPassword,
                returnSecureToken:true
            }
        }
        axios.request(params)
        .then(res => {
            dispatch(authActions.login({idToken:res.data.idToken,refreshToken:res.data.refreshToken,expiresIn:res.data.expiresIn}));
            setPasswordChangeTitle('Success!');
            passwordChangeRef.current.value = ''
        })
        .catch(err => {
            alert(err.response.data.error.message)
        })
    }
    return (
        <section id='profile'>
            {loading?<Loading/>:<div id='profileCard'>
                <div id='email' className='profileItems'>{`E-mail:${profileData.email}`}</div>
                <div id='creationDate' className='profileItems'>{`Creation Date:${profileData.createdAt}`}</div>
                <div id='lastLogin' className='profileItems'>{`Last Login:${profileData.lastLogin}`}</div>
                <form action="" onSubmit={changePassword} id='passwordChangeForm'>
                    <h2 id='passwordChangeTitle' >{passwordChangeTitle}</h2>
                    <input required id='passwordChangeInput' type="password" ref={passwordChangeRef} placeholder='New Password'/>
                    <button id='passwordChangeButton' className='hover button'>Submit</button>
                </form>
            </div>}
        </section>
    )
}

export default Profile
