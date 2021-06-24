// Dependencies
import './App.scss';
import {Route, Switch, Redirect, useHistory} from 'react-router-dom';
import {useDispatch,useSelector} from 'react-redux';
import React,{ useEffect,Suspense } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
// Pages imports
import Navigation from './Components/Navigation/Navigation';
import { toDoActions} from './Store/Store'; 
import Loading from './Components/Misc/Loading';

//Lazy Loading
const SchedulePage = React.lazy(()=> import('./pages/SchedulePage'));
const TodoPage = React.lazy(()=> import('./pages/Todo-pages/TodoPage'));
const AddNewTodoPage = React.lazy(()=> import('./pages/Todo-pages/AddNewTodoPage'));
const DetailedTodoPage = React.lazy(()=> import('./pages/Todo-pages/DetailedTodoPage'));
const JournalPage = React.lazy(()=> import('./pages/Journal-pages/JournalPage'));
const HabitsPage = React.lazy(()=> import('./pages/Habits-pages/HabitsPage'));
const NotFound = React.lazy(()=> import('./pages/NotFound'));
const HomePage = React.lazy(()=> import('./pages/HomePage'));
const AuthPage = React.lazy(()=> import('./pages/Auth-pages/AuthPage'));
const ProfilePage = React.lazy(()=> import('./pages/Auth-pages/ProfilePage'));


function App() {
  const [token,userId] = [Cookies.get('token'),Cookies.get('userId')];
  const isLoggedIn = !!useSelector(state=>state.authSlice.token);
  const dispatch = useDispatch();
  const history = useHistory();
  // Load data on start from database
  function loadTodoData() {
    axios.get(`https://planner-1487f-default-rtdb.europe-west1.firebasedatabase.app/users/${userId}/appData/toDo/toDoList.json?auth=${token}`)
    .then(res=>{
      dispatch(toDoActions.setToDoList(res.data));
    }).catch(err=>{
      alert(err)
    })
  }
  useEffect(()=>{
    if(token === undefined) {
      history.replace('/auth')
    } else {
      loadTodoData();
    }
  },[])
  return (
    <div id="app">
      <Navigation />
      <main>
        <Suspense fallback={<Loading/>}>
          <Switch>
            <Route exact path="/">
              <Redirect to="/home" />
            </Route>
            <Route exact path="/home">
              <HomePage />
            </Route>
            <Route exact path="/auth">
            {!isLoggedIn?<AuthPage />:<Redirect to="/profile" />}
            </Route>
            <Route exact path="/profile">
              {isLoggedIn?<ProfilePage />:<Redirect to="/auth" />}
            </Route>
            <Route exact path="/schedule">
              {isLoggedIn?<SchedulePage />:<Redirect to="/auth" />}
            </Route>
            <Route exact path="/todo">
              {isLoggedIn?<TodoPage />:<Redirect to="/auth" />}
            </Route>
            <Route path="/add-new-todo">
              {isLoggedIn?<AddNewTodoPage />:<Redirect to="/auth" />}
            </Route>
            <Route path="/todo/:itemId">
              <DetailedTodoPage />
            </Route>
            <Route path="/habits">
              {isLoggedIn?<HabitsPage />:<Redirect to="/auth" />}
            </Route>
            <Route path="/journal">
              {isLoggedIn?<JournalPage />:<Redirect to="/auth" />}
            </Route>
            <Route path="*">
              <NotFound />
            </Route>
          </Switch>
        </Suspense>
      </main>
    </div>
  );
}

export default App;
