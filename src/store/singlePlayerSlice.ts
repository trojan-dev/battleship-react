import { createSlice } from "@reduxjs/toolkit";

const initialState: any = {
  cellAnimationPhase: [...Array(100).keys()].map(() => "STOP"),
  playerReady: false,
  opponentReady: false,
  startGame: false,
  playerScore: 0,
  botScore: 0,
  playerShipsCoordinates: {
    BATTLESHIP: [],
    CARRIER: [],
    CRUISER: [],
    DESTROYER: [],
    SUBMARINE: [],
  },
  playerPlacedCoordinates: [],
  playerShipsOrientation: {
    BATTLESHIP: "H",
    CARRIER: "H",
    CRUISER: "H",
    DESTROYER: "H",
    SUBMARINE: "H",
  },
  isHorizontal: {
    BATTLESHIP: true,
    CARRIER: true,
    CRUISER: true,
    DESTROYER: true,
    SUBMARINE: true,
  },
  isShipValid: {
    BATTLESHIP: true,
    CARRIER: true,
    CRUISER: true,
    DESTROYER: true,
    SUBMARINE: true,
  },
  botShipsCoordinates: {
    BATTLESHIP: [],
    CARRIER: [],
    CRUISER: [],
    DESTROYER: [],
    SUBMARINE: [],
  },
  botPlacedCoordinates: [],
  playerCellStatus: [...Array(100).keys()].map(() => "EMPTY"),
  opponentCellStatus: [...Array(100).keys()].map(() => "EMPTY"),
};

export const singlePlayerSlice = createSlice({
  name: "singlePlayerSlice",
  initialState,
  reducers: {
    setCellAnimationPhase: (state, action) => {
      const newCellStates = state.cellAnimationPhase.slice();
      newCellStates[action.payload.cell] = action.payload.status;
      state.cellAnimationPhase = newCellStates;
    },
    setPlayerReady: (state, action) => {
      state.playerReady = action.payload;
    },
    setOpponentReady: (state, action) => {
      state.opponentReady = action.payload;
    },
    setStartGame: (state, action) => {
      state.startGame = action.payload;
    },
    setPlayerShipsCoordinates: (state, action) => {
      state.playerShipsCoordinates = action.payload;
    },
    setBotShipsCoordinates: (state, action) => {
      state.botShipsCoordinates = action.payload;
    },
    setPlayerPlacedCoordinates: (state, action) => {
      state.playerPlacedCoordinates = action.payload;
    },
    setBotPlacedCoordinates: (state, action) => {
      state.botPlacedCoordinates = action.payload;
    },
    setPlayerShipsOrientation: (state, action) => {
      state.playerShipsOrientation = action.payload;
    },
    setIsHorizontal: (state, action) => {
      state.isHorizontal = action.payload;
    },
    setIsShipValid: (state, action) => {
      state.isShipValid = action.payload;
    },
    setPlayerCellStatus: (state, action) => {
      state.playerCellStatus = action.payload;
    },
    setOpponentCellStatus: (state, action) => {
      state.opponentCellStatus = action.payload;
    },
    setPlayerScore: (state, action) => {
      state.playerScore = action.payload;
    },
    setBotScore: (state, action) => {
      state.botScore = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setCellAnimationPhase,
  setPlayerShipsCoordinates,
  setBotPlacedCoordinates,
  setPlayerPlacedCoordinates,
  setBotShipsCoordinates,
  setPlayerShipsOrientation,
  setIsHorizontal,
  setIsShipValid,
  setPlayerReady,
  setOpponentReady,
  setStartGame,
  setPlayerCellStatus,
  setPlayerScore,
  setBotScore,
} = singlePlayerSlice.actions;

export default singlePlayerSlice.reducer;
