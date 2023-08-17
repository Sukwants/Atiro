const exitMessage = [];

module.exports = {
  setExitMessage(message) {
    exitMessage.push(message);
  },
  exit: () => {
    for (let message of exitMessage) {
      console.log(message);
    }
    process.exit(0);
  }
}