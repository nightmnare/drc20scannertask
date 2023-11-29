import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  account: null,
  balance: 0,
}

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    setAddressAction: (state, action) => {
      state.account = action.payload
    },
    setBalanceAction: (state, action) => {
      state.balance = action.payload
    },
  },
})

export const { setAddressAction, setBalanceAction } = walletSlice.actions

export default walletSlice.reducer
