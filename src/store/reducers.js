import { combineReducers } from 'redux'
import storage from 'redux-persist/lib/storage'
import { persistReducer } from 'redux-persist'
import wallet from './slices/wallet'

const rootReducer = combineReducers({ wallet })

const persistConfig = {
  key: 'root',
  storage,
}

const RootState = persistReducer(persistConfig, rootReducer)

export default RootState
