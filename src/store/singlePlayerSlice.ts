import { createSlice } from "@reduxjs/toolkit";

const initialState: any = {
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
    setPlayerReady: (state, action) => {
      state.playerReady = action.payload;
    },
    setOpponentReady: (state, action) => {
      state.opponentReady = action.payload;
    },
    setStartGame: (state, action) => {
      return (state.startGame = action.payload);
    },
    setPlayerShipsCoordinates: (state, action) => {
      return (state.playerShipsCoordinates = action.payload);
    },
    setBotShipsCoordinates: (state, action) => {
      return (state.botShipsCoordinates = action.payload);
    },
    setPlayerPlacedCoordinates: (state, action) => {
      return (state.playerPlacedCoordinates = action.payload);
    },
    setBotPlacedCoordinates: (state, action) => {
      return (state.botPlacedCoordinates = action.payload);
    },
    setPlayerShipsOrientation: (state, action) => {
      return (state.playerShipsOrientation = action.payload);
    },
    setIsHorizontal: (state, action) => {
      return (state.isHorizontal = action.payload);
    },
    setIsShipValid: (state, action) => {
      return (state.isShipValid = action.payload);
    },
    setPlayerCellStatus: (state, action) => {
      return (state.playerCellStatus = action.payload);
    },
    setOpponentCellStatus: (state, action) => {
      return (state.opponentCellStatus = action.payload);
    },
    setPlayerScore: (state, action) => {
      return (state.playerScore = action.payload);
    },
    setBotScore: (state, action) => {
      return (state.botScore = action.payload);
    },
  },
});

// Action creators are generated for each case reducer function
export const {
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
