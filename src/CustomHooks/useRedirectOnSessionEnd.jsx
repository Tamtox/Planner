import {useEffect} from 'react';
import Cookies from 'js-cookie';
import { useHistory } from 'react-router';
import { authActions } from '../Store/Store';
import { useDispatch } from 'react-redux';

function useRedirectOnSessionEnd() {
    const token = Cookies.get('token');
    const history = useHistory();
    const dispatch = useDispatch();
    useEffect(()=>{
        if(!!token ===false) {
            dispatch(authActions.logout());
            history.replace('/auth');
        }
    },)
}

export default useRedirectOnSessionEnd