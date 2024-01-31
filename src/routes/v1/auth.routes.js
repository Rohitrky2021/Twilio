const express = require('express');
const { authController } = require('../../controllers/v1/user');

const router = express.Router();

// CREATE
router.post('/', authController.login);

module.exports = router;
