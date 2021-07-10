import {createSlice} from '@reduxjs/toolkit';

const initialScheduleState = {
    schedule:{
        
    }
}

const scheduleSlice = createSlice({
    name:'schedule',
    initialState:initialScheduleState,
    reducers:{
        addTask(state,action) {
            state.schedule[action.payload.title.toLowerCase()] = {'title':action.payload.title, 'weekdays':action.payload.weekdays,'time':action.payload.time}
        },
        removeTask(state,action) {
            const newSchedule = {...state.schedule};
            delete newSchedule[action.payload.toLowerCase()]
            state.schedule = newSchedule
        },
        setSchedule(state,action) {
            state.schedule = action.payload
        },
        clearSchedule(state) {
            state.schedule = {}
        }
    }
});

export default scheduleSlice