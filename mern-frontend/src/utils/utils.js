const randomItem = (itemArray) => {
  if (itemArray.length <= 0) {
    return null;
  }
  const randomIndex = Math.floor(Math.random() * itemArray.length);
  return itemArray[randomIndex];
}

module.exports = {
  randomItem
};