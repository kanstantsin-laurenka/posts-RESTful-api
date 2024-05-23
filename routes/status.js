const { Router } = require('express');
const { body } = require('express-validator');

const { getStatus, postStatus } = require("../controllers/status");
const isAuth = require('../middlewares/is-auth');

const router = Router();

router.get('/', isAuth, getStatus);
router.post('/',
  isAuth,
  [
    body('status')
      .trim()
      .isLength({ min: 3 }),
  ],
  postStatus,
);

module.exports = router;
