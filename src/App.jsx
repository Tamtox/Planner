// Dependencies
import './App.scss';
import {Route, Switch, Redirect} from 'react-router-dom';
import {useSelector} from 'react-redux';
import React,{ Suspense } from 'react';
// Pages imports
import Navigation from './Components/Navigation/Navigation';
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
  const isLoggedIn = !!useSelector(state=>state.authSlice.token);
  return (
    <div id="app" >
      <Navigation />
      <main>
        <Suspense fallback={<Loading/>}>
          <Switch>
            <Route exact path="/">
              <Redirect to="/auth" />
            </Route>
            <Route path="/home">
              <HomePage />
            </Route>
            <Route path="/auth">
            {!isLoggedIn?<AuthPage />:<Redirect to="/profile" />}
            </Route>
            <Route path="/profile">
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
