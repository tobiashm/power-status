const osxBattery = require('osx-battery');
const Luxafor = require('luxafor-api');

const resolveState = res => res.fullyCharged ? 'full' : (
  res.isCharging ? 'charging' : 'discharging'
);

const stateColors = {
  charging: '#00f',
  discharging: '#f00',
  full: '#fff'
};

const stateColor = res => stateColors[resolveState(res)] || '#000';

const connectedColor = res => res.externalConnected ? '#0f0' : '#f00';

const checkIsCharging = () => osxBattery().then(res => {
  const device = new Luxafor();
  const targets = device.getTargets();
  device.setColor(connectedColor(res), targets.bottom);
  device.setColor(stateColor(res), targets.top);
});

new Luxafor().off();
setInterval(checkIsCharging, 3000);
