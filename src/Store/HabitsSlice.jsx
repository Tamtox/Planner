import {createSlice} from '@reduxjs/toolkit';
const initialHabitsState = {
    habitsList:{

    },
    entry:{

    }
};
const habitsSlice = createSlice({
    name:'habits',
    initialState:initialHabitsState, 
    reducers:{
        addHabit(state,action) {
            state.habitsList[action.payload.title.toLowerCase()] = {title:action.payload.title,weekdays:action.payload.weekdays}
            state.entry[action.payload.title.toLowerCase()] = action.payload
        },
        deleteHabit(state,action) {
            const newHabitsList = {...state.habitsList}
            delete newHabitsList[action.payload]
            state.habitsList = newHabitsList
        },
        changeHabitStatus(state,action) {
            state.entry[action.payload].status = state.entry[action.payload].status === 'Pending'?'Complete':'Pending'
        },
        setHabitList(state,action) {
            state.habitsList = action.payload
        },
        setHabitData(state,action) {
            state.entry = action.payload
        }
    }
});

export default habitsSlice