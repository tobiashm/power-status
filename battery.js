import { execa } from 'execa';
import plist from 'plist';

export const getBatteryStatus = () =>
  execa('ioreg', ['-n', 'AppleSmartBattery', '-r', '-a']).then(({ stdout }) => {
    const batteries = plist.parse(stdout);
    if (!Array.isArray(batteries) || batteries.length === 0) {
      throw new Error(`This computer doesn't have a battery`);
    }
    const battery = batteries[0];
    return {
      fullyCharged: Boolean(battery.FullyCharged),
      isCharging: Boolean(battery.IsCharging),
    };
  });
