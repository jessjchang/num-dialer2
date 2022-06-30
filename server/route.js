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

router.post("/", (req, res, next) => {
  const callInfo = req.body;
  const callId = callInfo.id;
  const callStatus = callInfo.status;
  if (callStatus === "completed" && currentIndex < phoneNumbers.length) {
    makeCall(phoneNumbers[currentIndex], currentIndex);
    currentIndex++;
  }
  res.status(200).send();
});

module.exports = router;