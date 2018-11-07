const osxBattery = require('osx-battery');
const Luxafor = require('luxafor-api');

const device = new Luxafor();

let currentState = null;
let connected = null;

const resolveState = res => res.fullyCharged ? 'full' : (
  res.isCharging ? 'charging' : 'discharging'
);

const colors = {
  charging: '#00f',
  discharging: '#f00',
  full: '#fff'
};

const targets = {
  all: 0xff,
  top: 0x41,
  bottom: 0x42,
};

const checkConnection = ({ externalConnected }) => new Promise(resolve => {
  if (connected === externalConnected) return resolve();
  connected = externalConnected;
  const color = connected ? '#0f0' : '#f00';
  device.setColor(color, targets.bottom);
  resolve();
});

const checkState = (res) => new Promise(resolve => {
  const nextState = resolveState(res);
  if (nextState === currentState) return resolve();
  currentState = nextState;
  device.setColor(colors[currentState] || '#000', targets.top);
  resolve();
});

const checkIsCharging = () => osxBattery().then(res => {
  checkConnection(res);
  checkState(res);
});

device.off();
setInterval(checkIsCharging, 1000);
