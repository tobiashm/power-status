import { getBatteryStatus } from './battery.js';
import Luxafor from './luxafor.js';

const resolveState = res => res.fullyCharged ? 'full' : (
  res.isCharging ? 'charging' : 'discharging'
);

const stateColors = {
  charging: '#00f', // blue
  discharging: '#f00', // red
  full: '#333' // white
};

const stateColor = res => stateColors[resolveState(res)] || '#000';

const connectedColor = res => res.externalConnected ? '#030' : '#f00';

const checkIsCharging = () => getBatteryStatus().then(res => {
  const device = new Luxafor();
  const targets = device.getTargets();
  device.setColor(connectedColor(res), targets.bottom);
  device.setColor(stateColor(res), targets.top);
  device.close();
});

new Luxafor().off();
setInterval(checkIsCharging, 3000);
