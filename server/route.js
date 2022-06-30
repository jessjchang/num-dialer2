const express = require("express");
const router = express.Router();
const axios = require('axios');

const phoneNumbers = [
  "13018040009",
  "19842068287",
  "15512459377",
  "19362072765",
  "18582210308",
  "13018040009",
  "19842068287",
  "15512459377",
  "19362072765"
];

const idMapping = {};

router.get("/", (req, res, next) => {
  res.json(phoneNumbers);
});

// async function worker(queue) {
//   while (queue.length > 0) {
//     let task = queue.shift();
//     await makeCall(task);
//   }
// }

// async function runPromises(numbersArray, maxRunning = 3) {
//   const queue = numbersArray.slice();
//   const workers = [...Array(maxRunning)].map((k) => {
//     return worker(queue);
//   });
//   await Promise.all(workers);
// }

async function makeCall(number, idx) {
  // return new Promise ((resolve) => {
    const { data } = await axios.post("http://localhost:4830/call", {phone: number, webhookURL: "http://localhost:5001"});
    // console.log(data);
    idMapping[data.id] = idx;
    console.log(idMapping, number);
    // phoneNumbers[number] = String(data.id);
    // console.log(idMapping);
    // return data;
  // });
};

router.get("/dial", async (req, res, next) => {
  const queue = phoneNumbers.slice(0,3);
  queue.forEach((number, idx) => makeCall(number, idx));
  // console.log(queue);
  // makeCall()
  // const data = await runPromises(Object.keys(phoneNumbers));
  // console.log(data);
});

router.post("/", (req, res, next) => {
  const callInfo = req.body;
  const callId = callInfo.id;
  const callStatus = callInfo.status;
  console.log(callId);
  console.log(callStatus);
  res.status(200).send();
});

module.exports = router;