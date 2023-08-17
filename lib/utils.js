const finishMessage = [];

function setFinishMessage(message) {
  finishMessage.push(message);
}

function finish() {
  for (let message of finishMessage) {
    console.log(message);
  }
}

function exit() {
  finish();
  process.exit(0);
}

module.exports = {
  setFinishMessage: setFinishMessage,
  finish: finish,
  exit: exit
}