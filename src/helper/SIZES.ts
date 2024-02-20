function calculateCellStyle() {
  let _cellStyle = `grid gap-0.5 grid-cols-[repeat(9,50px)]`;
  if (window.matchMedia("(min-device-width : 600px)").matches) {
    _cellStyle = `grid gap-0.5 grid-cols-[repeat(9,50px)]`;
  }
  if (window.matchMedia("(min-device-width : 1024px)").matches) {
    _cellStyle = `grid gap-0.5 grid-cols-[repeat(9,60px)]`;
  }
  if (window.matchMedia("(max-device-width : 460px)").matches) {
    _cellStyle = `grid gap-0.5 grid-cols-[repeat(9,42px)]`;
  }
  if (window.matchMedia("(max-device-width : 380px)").matches) {
    _cellStyle = `grid gap-0.5 grid-cols-[repeat(9,36px)]`;
  }
  return _cellStyle;
}
function calculateCellSize() {
  let _cellSize = 50;
  if (window.matchMedia("(min-device-width : 600px)").matches) {
    _cellSize = 50;
  }
  if (window.matchMedia("(min-device-width : 1024px)").matches) {
    _cellSize = 60;
  }
  if (window.matchMedia("(max-device-width : 460px)").matches) {
    _cellSize = 42;
  }
  if (window.matchMedia("(max-device-width : 380px)").matches) {
    _cellSize = 36;
  }
  return _cellSize;
}
function calculateShipsContainer() {
  let _cellStyle = `max-w-[500px]`;
  if (window.matchMedia("(min-device-width : 600px)").matches) {
    _cellStyle = `max-w-[500px]`;
  }
  if (window.matchMedia("(min-device-width : 1024px)").matches) {
    _cellStyle = `max-w-[600px]`;
  }
  if (window.matchMedia("(max-device-width : 460px)").matches) {
    _cellStyle = `max-w-[420px]`;
  }
  if (window.matchMedia("(max-device-width : 380px)").matches) {
    _cellStyle = `max-w-[360px]`;
  }
  return _cellStyle;
}
export { calculateCellStyle, calculateCellSize, calculateShipsContainer };
