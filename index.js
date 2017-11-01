const osxBattery = require('osx-battery');
const Luxafor = require('luxafor-api');

const device = new Luxafor();

const checkIsCharging = () => osxBattery().then(res => {
  const color = res.externalConnected ? (res.isCharging ? '#00f' : '#fff') : '#f00';
  device.setColor(color);
});

checkIsCharging();
setInterval(checkIsCharging, 1000);
