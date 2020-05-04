const HID = require('node-hid');
const hex2rgb = require('hex-rgb');
const os = require('os');

const targets = {
  all: 0xff,
  top: 0x41,
  bottom: 0x42,
  getLedByNumber: function (number) {
    switch (number) {
    case 1:
      return 0x01;
    case 2:
      return 0x02;
    case 3:
      return 0x03;
    case 4:
      return 0x04;
    case 5:
      return 0x05;
    case 6:
      return 0x06;
    }
  },
};

const commands = {
  COMMAND_SETCOLOR: 1,
  COMMAND_FADETO: 2,
  COMMAND_FLASH: 3,
  COMMAND_WAVE: 4
};

const vendorId = 0x04d8;
const productId = 0xf372;

class Luxafor {
  constructor() {
    try {
      this.device = new HID.HID(vendorId, productId);
      this.device.pause(); // pause until next command
      this.device.on('error', e => console.error(e));
    } catch (e) {
      console.error(e);
      this.device = e;
    }
  }

  setColor(color, target) {
    issueCommand(this.device, commands.COMMAND_SETCOLOR, target, color);
  }

  off() {
    this.setColor('#000');
    this.close();
  }

  close() {
    if (this.device instanceof HID.HID) {
      this.device.close();
    }
  }

  getTargets() {
    return targets;
  }
}

function write(device, data) {
  if (device instanceof Error || device === null) {
    return;
  }
  try {
    device.resume();
    if (os.platform () === 'win32') {
      data.unshift(0);
    }
    device.write(data);
    device.pause();
  } catch (e) {
    console.error(e);
    return e;
  }
}

function issueCommand(device, command, target, color) {
  const { red, green, blue } = hex2rgb(color);
  // if target is not defined, we assume that we want to change the color of all leds
  target = typeof target !== 'undefined' ? target : targets.all;

  // writing data
  return write(device, [command, target, red, green, blue]);
}

module.exports = Luxafor;
