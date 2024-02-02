import {configureStore} from '@reduxjs/toolkit';
import MenuReducer from '@/slice/menuSlice'
import ToolBoxReducer from '@/slice/toolBoxSlice'

export const store = configureStore({
    reducer: {
        menu:   MenuReducer,
        toolBox: ToolBoxReducer
    }
})