import { configureStore } from '@reduxjs/toolkit'
import { useDispatch } from 'react-redux'
import thunk from 'redux-thunk'
import { createWrapper } from 'next-redux-wrapper'

import persistedReducer from './reducers'

export const store = configureStore({
  reducer: persistedReducer,
  middleware: [thunk],
  // devTools: process.env.NODE_ENV !== 'production',
})

const makeStore = () => store

export const wrapper = createWrapper(makeStore)

export const useAppDispatch = () => useDispatch()
