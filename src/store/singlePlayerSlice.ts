import { createSlice } from "@reduxjs/toolkit";

const initialState: any = {
  playerShipsCoordinates: {},
  playerReady: false,
  opponentReady: false,
  startGame: false,
  playerCellStatus: [],
};

export const singlePlayerSlice = createSlice({
  name: "singlePlayerSlice",
  initialState,
  reducers: {},
});

// Action creators are generated for each case reducer function
export const {} = singlePlayerSlice.actions;

export default singlePlayerSlice.reducer;
