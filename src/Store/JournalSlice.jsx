import {createSlice} from '@reduxjs/toolkit';
const initialJournalState = {
    date:null,
    entry:null
};
const journalSlice = createSlice({
    name:'journal',
    initialState:initialJournalState,
    reducers:{
        setEntry(state,action) {
            state.date = action.payload.date
            state.entry = action.payload.entry
        },
        clearEntry(state) {
            state.date = null
            state.entry = null
        }
    }
});

export default journalSlice