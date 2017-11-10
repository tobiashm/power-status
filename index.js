const osxBattery = require('osx-battery');
const Luxafor = require('luxafor-api');

let currentState = null;

const resolveState = res => res.externalConnected ? (res.isCharging ? 'charging' : 'full') : 'discharging';

const colors = {
  charging: '#00f',
  discharging: '#f00',
  full: '#fff'
};

const checkIsCharging = () => osxBattery().then(resolveState).then(nextState => {
  if (nextState === currentState) return;
  currentState = nextState;
  const device = new Luxafor();
  device.setColor(colors[currentState] || '#000');
});

checkIsCharging();
setInterval(checkIsCharging, 1000);
