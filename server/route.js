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
let currentIndex = 3;
let statusFromPost = [];
for (let i = 0; i < phoneNumbers.length; i++) {
  statusFromPost.push('idle');
}

router.get("/", (req, res, next) => {
  res.json(phoneNumbers);
});

async function makeCall(number, idx) {
    const { data } = await axios.post("http://localhost:4830/call", {phone: number, webhookURL: "http://localhost:5001"});
    idMapping[data.id] = idx;
};

router.get("/dial", async (req, res, next) => {
  const queue = phoneNumbers.slice(0,3);
  queue.forEach((number, idx) => makeCall(number, idx));
});

router.get("/status", async(req, res, next) => {
  res.set({
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  })

  let intervalId = setInterval(() => {
    res.write(`data: ${JSON.stringify({status: statusFromPost})}\n\n`)
  }, 500)

  if (statusFromPost.every(status => status === 'completed')) {
    clearInterval(intervalId);
    res.end();
  }
})

router.post("/", (req, res, next) => {
  const callInfo = req.body;
  const callId = callInfo.id;
  let callStatus = callInfo.status;
  const index = idMapping[callId];

  if (statusFromPost[index] !== 'completed') {
    statusFromPost[index] = callStatus;
  } else {
    callStatus = 'completed';
  }

  if (callStatus === "completed" && currentIndex < phoneNumbers.length) {
    makeCall(phoneNumbers[currentIndex], currentIndex);
    currentIndex++;
  }

  res.status(200).send();
});

module.exports = router;