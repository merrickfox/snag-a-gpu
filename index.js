import gpus from "./gpu.json"
import gpu from "./gpu.js";

setInterval( ()=> {
  const date = new Date();
  console.log('starting gpu instance')
  console.log(date)
  gpu(gpus[0].url, gpus[0].selectors)
}, 60000 * 10)


