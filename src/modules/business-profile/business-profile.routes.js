const express = require('express');
const businessProfileController = require('./business-profile.controller');
const authenticate = require('../../middleware/auth');
const validate = require('../../middleware/validate');
const { updateBusinessProfileSchema } = require('./business-profile.validation');

const router = express.Router();

router.use(authenticate);

router.get('/me/business-profile', businessProfileController.getMyBusinessProfile);
router.put('/me/business-profile', validate(updateBusinessProfileSchema), businessProfileController.updateMyBusinessProfile);

module.exports = router;
