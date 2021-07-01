import {createSlice} from '@reduxjs/toolkit';
const initialHabitsState = {
    habits:{
        habitsList:{
            'test':{
                title:'Test',
                'weekdays':{'Mon':true,'Tue':true,'Wed':true,'Thu':true,'Fri':true,'Sat':true,'Sun':true}
            }
        },
        '28 06 2021-04 07 2021':{}
    }
};
const habitsSlice = createSlice({
    name:'habits',
    initialState:initialHabitsState, 
    reducers:{
        addHabit(state,action) {
            const newHabits = {...state.habits}
            newHabits.habitsList[action.payload.title.toLowerCase()] = {title:action.payload.title,weekdays:action.payload.weekdays}
            newHabits[action.payload.week][action.payload.title.toLowerCase()] = action.payload
            state.habits = newHabits
        },
        removeHabit(state,action) {
            
        },
        setHabitList(state,action) {
            state.habitsList = action.payload
        },
        setHabitData(state,action) {
            state[action.week] = action.weekData
        }
    }
});

export default habitsSlice