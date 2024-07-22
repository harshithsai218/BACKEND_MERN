const express = require ("express");
const { check } = require("express-validator");

const userControllers = require('../controllers/users-controllers');
const fileUpload = require('../MiddleWare/file-Upload')

const router =express()

router.get('/',userControllers.getUsers);

router.post('/signup',
    fileUpload.single('image'),
    [
        check('name').not().isEmpty(),
        check('email').normalizeEmail().isEmail(),
        check('password').isLength({min:8 })
    ],userControllers.Signup);

router.post('/login',userControllers.login);
module.exports = router;