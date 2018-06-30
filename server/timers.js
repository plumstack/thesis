const Tock = require('tocktimer');

const timers = {};

const addTimer = (roomId, songLength) => {
  timers[roomId] = new Tock({
    countdown: true,
    complete: () => {
      console.log('TIMER OVER');
    },
  });
  timers[roomId].start(songLength);
};

module.exports = {
  addTimer,
};
