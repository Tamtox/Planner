import {createSlice} from '@reduxjs/toolkit';
const initialHabitsState = {
    habitsList:{
        'drink 2 liters of water':{
            title:'Drink 2 liters of water',
            'weekdays':{0:true,1:true,2:true,3:true,4:true,5:true,6:true}
        }
    }
};
const habitsSlice = createSlice({
    name:'habits',
    initialState:initialHabitsState, 
    reducers:{
        addHabit(state,action) {
            state.toDoList.push(action.payload)
        },
        removeHabit(state,action) {
            
        },
        setHabitData(state,action) {

        }
    }
});

export default habitsSlice