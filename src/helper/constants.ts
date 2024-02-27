const invalidCells: any = {
  CARRIER: [
    5, 6, 7, 8, 14, 15, 16, 17, 23, 24, 25, 26, 32, 33, 34, 35, 41, 42, 43, 44,
    50, 51, 52, 53, 59, 60, 61, 62,
  ],
  BATTLESHIP: [
    6, 7, 8, 15, 16, 17, 24, 25, 26, 33, 34, 35, 42, 43, 44, 51, 52, 53, 61, 62,
  ],
  CRUISER: [7, 8, 16, 17, 25, 26, 34, 35, 43, 44, 52, 53, 61, 62],
  DESTROYER: [7, 8, 16, 17, 25, 26, 34, 35, 43, 44, 52, 53, 61, 62],
  SUBMARINE: [8, 17, 26, 35, 44, 53, 62],
};
const TOTAL_COORDINATES = 17;
const DUMMY_ROOM_ID = "65969992a6e67c6d75cf938b";
export { invalidCells, TOTAL_COORDINATES, DUMMY_ROOM_ID };
