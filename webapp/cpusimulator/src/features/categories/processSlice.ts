import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

interface Process {
    "id": string;
    "name": string;
    "arrival_time": number;
    "burst_time": number;
    "description": null | string;
    "is_active": boolean;
    "deleted_at": null | string;
    "created_at": string;
    "updated_at": string; 
}

const process : Process = {
    "id": "uuid",
    "name": "name",
    "arrival_time": 25,
    "burst_time": 30,
    "description": "description",
    "is_active": true,
    "deleted_at": null,
    "created_at": "2022-08-15T10:58:09+0800",
    "updated_at": "2022-08-15T10:58:09+0800",
}


export const initialState = [
    process,
    { ...process, id: "uuid2", name: "name2"},
    { ...process, id: "uuid3", name: "name3"},
    { ...process, id: "uuid4", name: "name4"},
]

const processesSlice = createSlice({
    name: "processes",
    initialState: initialState,
    reducers: {
        createEvents(state, action) {},
        updateEvents(state, action) {},
        deleteEvents(state, action) {},
    },
})

// Selectors

export const selectProcesses = (state: RootState) => state.processes

export default processesSlice.reducer