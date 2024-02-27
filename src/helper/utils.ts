/*
    Bunch of utility functions
    1. wait -> Synchronous stopping
    2. generateContinuousArray -> Generate a continuous array of elements based off start index
    3. sendEndGameStats -> Send data to REST server
*/

async function sendEndGameStats(payload: Response) {
  const DUMMY_ROOM_ID = "65969992a6e67c6d75cf938b";
  try {
    const response = await fetch(
      `http://65.2.34.81:3000/sdk/conclude/${DUMMY_ROOM_ID}`,
      {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const output = await response.json();
    return output;
  } catch (error) {
    console.error(error);
  }
}

function wait(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function generateContinuousArrayHorizontal(start: number, length: number) {
  return Array.from({ length: length }, (_, index) => start + index);
}
function generateContinuousArrayVertical(start: number, length: number) {
  return Array.from({ length: length }, (_, index) => start + 9 * index);
}

function getRandomExcluding(min: number, max: number, exclude: string[]) {
  let randomNum;
  do {
    randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
  } while (exclude.includes(String(randomNum)));
  return randomNum;
}

function checkValidStartIndex(
  index: number,
  truckLength: number,
  alreadyPlacedCells: Array<Array<number>>,
  orientation: string
) {
  if (orientation === "HORIZONTAL") {
    const generatedArrayForHorizontalTruck = generateContinuousArrayHorizontal(
      index,
      truckLength
    );
    if (
      index % 9 < truckLength &&
      !alreadyPlacedCells.flat(1).includes(index) &&
      !alreadyPlacedCells
        .flat(1)
        .some((el) => generatedArrayForHorizontalTruck.includes(el))
    ) {
      return index;
    }
    return checkValidStartIndex(
      Math.floor(Math.random() * (62 - 0 + 1)) + 0,
      truckLength,
      alreadyPlacedCells,
      "HORIZONTAL"
    );
  }
  if (orientation === "VERTICAL") {
    const generatedArrayForVerticalTruck = generateContinuousArrayVertical(
      index,
      truckLength
    );
    if (
      index < 62 &&
      !alreadyPlacedCells.flat(1).includes(index) &&
      index + truckLength * 9 < 62 &&
      !alreadyPlacedCells
        .flat(1)
        .some((el) => generatedArrayForVerticalTruck.includes(el))
    ) {
      return index;
    }
    return checkValidStartIndex(
      Math.floor(Math.random() * (62 - 0 + 1)) + 0,
      truckLength,
      alreadyPlacedCells,
      "VERTICAL"
    );
  }
}

export {
  wait,
  generateContinuousArrayHorizontal,
  generateContinuousArrayVertical,
  getRandomExcluding,
  sendEndGameStats,
  checkValidStartIndex,
};
