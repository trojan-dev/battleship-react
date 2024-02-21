import Truck5H from "./Ships/truckh-5.svg";
import Truck5V from "./Ships/truckv-5.svg";
import Truck4H from "./Ships/truckh-4.svg";
import Truck4V from "./Ships/truckv-4.svg";
import Truck3H from "./Ships/truckh-3.svg";
import Truck3V from "./Ships/truckv-3.svg";
import Truck2H from "./Ships/truckh-2.svg";
import Truck2V from "./Ships/truckv-2.svg";
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
      shipWidth: BASE_CELL_SIZE - 7,
      shipHeight: BASE_CELL_SIZE * 5,
    },
  },
  {
    shipType: "BATTLESHIP",
    length: 4,
    H: Truck4H,
    V: Truck4V,
    hDimensions: {
      shipWidth: BASE_CELL_SIZE * 4,
      shipHeight: BASE_CELL_SIZE,
    },
    vDimensions: {
      shipWidth: BASE_CELL_SIZE - 7,
      shipHeight: BASE_CELL_SIZE * 4,
    },
  },
  {
    shipType: "CRUISER",
    length: 3,
    H: Truck3H,
    V: Truck3V,
    hDimensions: {
      shipWidth: BASE_CELL_SIZE * 3,
      shipHeight: BASE_CELL_SIZE,
    },
    vDimensions: {
      shipWidth: BASE_CELL_SIZE - 7,
      shipHeight: BASE_CELL_SIZE * 3,
    },
  },
  {
    shipType: "DESTROYER",
    length: 3,
    H: Truck3H,
    V: Truck3V,
    hDimensions: {
      shipWidth: BASE_CELL_SIZE * 3,
      shipHeight: BASE_CELL_SIZE,
    },
    vDimensions: {
      shipWidth: BASE_CELL_SIZE - 7,
      shipHeight: BASE_CELL_SIZE * 3,
    },
  },
  {
    shipType: "SUBMARINE",
    length: 2,
    H: Truck2H,
    V: Truck2V,
    hDimensions: {
      shipWidth: BASE_CELL_SIZE * 2,
      shipHeight: BASE_CELL_SIZE,
    },
    vDimensions: {
      shipWidth: BASE_CELL_SIZE - 7,
      shipHeight: BASE_CELL_SIZE * 2,
    },
  },
];
export default PlayerShips;
