const express = require('express');
const viewController = require('../controllers/viewController');

const router = express.Router();

router.get('/', viewController.getMain);
// router.get('/api', viewController.getApi);
// router.get('/weather', viewController.getWeather);
// router.get('/about', viewController.getAbout);
// router.get('/help', viewController.getHelp);
// router.get('/products', viewController.getProducts);

module.exports = router;
