// use noble to get arduino accelerometer data

const noble = require('@abandonware/noble');

const uuid_service = "1101"
const uuid_value_ax = "2101"
const uuid_value_ay = "2102"
const uuid_value_az = "2103"
const uuid_value_gx = "2104"
const uuid_value_gy = "2105"
const uuid_value_gz = "2106"

noble.on('stateChange', async (state) => {
  if (state === 'poweredOn') {
    console.log("start scanning")
    await noble.startScanningAsync([uuid_service], false);
  }
});

noble.on('discover', async (peripheral) => {
  await noble.stopScanningAsync();
  await peripheral.connectAsync();
  const services = await peripheral.discoverServicesAsync([uuid_service]);
  const characteristics = await services[0].discoverCharacteristicsAsync([uuid_value_ax, uuid_value_ay, uuid_value_az, uuid_value_gx, uuid_value_gy, uuid_value_gz]);

  // read data
  readData(characteristics);
});

//
// read data periodically
//
let store = []
let readData = async (characteristics) => {
  let ax = await characteristics[0].readAsync();
  let ay = await characteristics[1].readAsync();
  let az = await characteristics[2].readAsync();
  let gx = await characteristics[3].readAsync();
  let gy = await characteristics[4].readAsync();
  let gz = await characteristics[5].readAsync();

  setTimeout(readData, 100, characteristics);
    if (store.length < 10){
      store.push(ax.readFloatLE(0))
    }
    else{
      store = []
    }
    console.log("Store:" + store)
}
