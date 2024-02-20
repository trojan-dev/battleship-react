function calculateCellStyle() {
  let _cellStyle = `grid grid-cols-[repeat(9,50px)]`;
  if (window.matchMedia("(min-device-width : 600px)").matches) {
    _cellStyle = `grid grid-cols-[repeat(9,50px)]`;
  }
  if (window.matchMedia("(min-device-width : 1024px)").matches) {
    _cellStyle = `grid grid-cols-[repeat(9,60px)]`;
  }
  if (window.matchMedia("(max-device-width : 460px)").matches) {
    _cellStyle = `grid grid-cols-[repeat(9,42px)]`;
  }
  if (window.matchMedia("(max-device-width : 380px)").matches) {
    _cellStyle = `grid grid-cols-[repeat(9,36px)]`;
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
export { calculateCellStyle, calculateCellSize };
