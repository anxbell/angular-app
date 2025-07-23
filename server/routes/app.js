const express = require('express');
const path = require('path');
const fs = require('fs');

const router = express.Router();

router.get('/', function (req, res, next) {
  const filePath = path.join(__dirname, '../../dist/cms/browser/index.html');
  console.log('Serving:', filePath);

  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      console.error('File not found:', filePath);
      return res.status(500).send('index.html not found');
    }
    res.sendFile(filePath);
  });
});

module.exports = router;