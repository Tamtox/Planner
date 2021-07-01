import {configureStore} from '@reduxjs/toolkit';
import toDoSlice from './TodoSlice';
import scheduleSlice from './ScheduleSlice';
import habitsSlice from './HabitsSlice';
import journalSlice from './JournalSlice';
import authSlice from './AuthSlice';
const store = configureStore({
    reducer: {
        toDoSlice:toDoSlice.reducer,
        scheduleSlice:scheduleSlice.reducer,
        journalSlice:journalSlice.reducer,
        habitsSlice:habitsSlice.reducer,
        authSlice:authSlice.reducer}
});

export const toDoActions = toDoSlice.actions
export const scheduleActions = scheduleSlice.actions
export const habitsActions = habitsSlice.actions
export const journalActions = journalSlice.actions
export const authActions = authSlice.actions
export default store