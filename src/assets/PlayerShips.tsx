// import { Truck5H, Truck5V } from "./Ships/Truck5";
// import { Truck4H, Truck4V } from "./Ships/Truck4";
import { Truck3H, Truck3V } from "./Ships/Truck3";
import { Truck2H, Truck2V } from "./Ships/Truck2";
import Truck5H from "./Ships/truckh-5.svg";
import Truck5V from "./Ships/truckv-5.svg";
import Truck4H from "./Ships/truckh-4.svg";
import { calculateCellSize } from "../helper/SIZES";
const BASE_CELL_SIZE = calculateCellSize();
const PlayerShips = [
  {
    shipType: "CARRIER",
    length: 5,
    H: Truck5H,
    V: Truck5V,
    hDimensions: {
      shipWidth: BASE_CELL_SIZE * 5,
      shipHeight: BASE_CELL_SIZE,
    },
    vDimensions: {
      shipWidth: BASE_CELL_SIZE,
      shipHeight: BASE_CELL_SIZE * 5,
    },
  },
  {
    shipType: "BATTLESHIP",
    length: 4,
    H: Truck4H,
    V: Truck4H,
    hDimensions: {
      shipWidth: BASE_CELL_SIZE * 4,
      shipHeight: BASE_CELL_SIZE,
    },
    vDimensions: {
      shipWidth: BASE_CELL_SIZE,
      shipHeight: BASE_CELL_SIZE * 4,
    },
  },
  // {
  //   shipType: "CRUISER",
  //   length: 3,
  //   H: Truck3H,
  //   V: Truck3V,
  //   hDimensions: {
  //     width: BASE_CELL_SIZE * 3,
  //     height: BASE_CELL_SIZE,
  //     viewBoxW: BASE_CELL_SIZE * 3 + 45,
  //     viewBoxH: BASE_CELL_SIZE + 20,
  //   },
  //   vDimensions: {
  //     width: BASE_CELL_SIZE - 10,
  //     height: BASE_CELL_SIZE * 3,
  //     viewBoxW: BASE_CELL_SIZE + 10,
  //     viewBoxH: BASE_CELL_SIZE * 3 + 20,
  //   },
  // },
  // {
  //   shipType: "DESTROYER",
  //   length: 3,
  //   H: Truck3H,
  //   V: Truck3V,
  //   hDimensions: {
  //     width: BASE_CELL_SIZE * 3,
  //     height: BASE_CELL_SIZE,
  //     viewBoxW: BASE_CELL_SIZE * 3 + 45,
  //     viewBoxH: BASE_CELL_SIZE + 20,
  //   },
  //   vDimensions: {
  //     width: BASE_CELL_SIZE - 10,
  //     height: BASE_CELL_SIZE * 3,
  //     viewBoxW: BASE_CELL_SIZE + 10,
  //     viewBoxH: BASE_CELL_SIZE * 3 + 20,
  //   },
  // },
  // {
  //   shipType: "SUBMARINE",
  //   length: 2,
  //   H: Truck2H,
  //   V: Truck2V,
  //   hDimensions: {
  //     width: BASE_CELL_SIZE * 2,
  //     height: BASE_CELL_SIZE,
  //     viewBoxW: BASE_CELL_SIZE * 2 + 45,
  //     viewBoxH: BASE_CELL_SIZE + 20,
  //   },
  //   vDimensions: {
  //     width: BASE_CELL_SIZE - 10,
  //     height: BASE_CELL_SIZE * 2,
  //     viewBoxW: BASE_CELL_SIZE + 10,
  //     viewBoxH: BASE_CELL_SIZE * 2 + 30,
  //   },
  // },
];
export default PlayerShips;
