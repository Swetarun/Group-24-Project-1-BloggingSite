const emailValidator = require('email-validator');
const collegeModel = require('../models/collegeModel');
const internModel = require('../models/internModel');

const validCollege = async function (req, res, next) {
    try {
        let requestBody = req.body;
        let required= ["name","fullName","logoLink"]
        let keys= Object.keys(req.body)
       
        for(let i=0; i<required.length; i++){
            if(keys.includes(required[i]))
               continue
             else
             return res.status(400).send({ status: false, msg: `Required field - ${required[i]}`})
        }
        
        let nameValidation = /^[a-zA-Z]+$/
        if (!nameValidation.test(requestBody.name)) {
            return res.status(400).send({ status: false, message: "Name can only be alphabetically" });
        }
        
        let checkname = await collegeModel.findOne({ name: requestBody.name.toLowerCase() });
        if (checkname) {
            return res.status(400).send({ status: false, msg: "Name Already In Use, Change The Name !!!" });
        }
     
        let reg = /^(https:\/\/www\.|http:\/\/www\.|www\.)[a-zA-Z0-9\-_.$]+\.[a-zA-Z]{2,5}(:[0-9]{1,5})?(\/[^\s]*)?(.png|.jpeg|.jpg)$/gm
        let regex= reg.test(requestBody.logoLink)
     
        if(regex === false){
            return res.status(400).send({ status: false, msg: "Please Enter a valid URL for the logoLink."})
        }
        next();
    }
    catch (err) {
        res.status(500).send({ status: false, msg: err.message });
    }
}

const validIntern = async function (req, res, next) {
    try {
        let requestBody = req.body;
        let required= ["name","email","mobile", "collegeName"]
        let keys= Object.keys(req.body)
       
        for(let i=0; i<required.length; i++){
            if(keys.includes(required[i]))
               continue
             else
             return res.status(400).send({ status: false, msg: `Required field - ${required[i]}`})
        }
       
        const { name, email, mobile, collegeName } = requestBody;
        // Validation starts
        let nameValidation = /^[A-z ]+$/
        if (!nameValidation.test(name)) {
            return res.status(400).send({ status: false, message: "Name can only be alphabetical" });
        }
        
        if (!emailValidator.validate(email)) {
            return res.status(400).send({ status: false, msg: "Check the format of email" })
        }
       
        let emailValidation = await internModel.findOne({ email: email })
        if (emailValidation) {
            return res.status(409).send({ status: false, msg: "This Email has been registered already" })
        }
    
        if (Object.values(requestBody.mobile).length < 10 || (requestBody.mobile).length > 10) {
            return res.status(400).send({ status: false, msg: "Mobile Number should be 10 Digits" })
        }

        let mobileValidation = await internModel.findOne({ mobile: mobile })
        if (mobileValidation) {
            return res.status(409).send({ status: false, msg: "This Mobile has been registered already" })
        }
        let mob = /^[0-9 ]+$/
        if (!mob.test(mobile)) {
            return res.status(400).send({ status: false, message: "Mobile number should have digits only" });
        }
       
        let cName = collegeName.toLowerCase();
        let collegeID = await collegeModel.findOne({ name: cName });
        if (!collegeID) {
            return res.status(400).send({ status: false, msg: "This is not a valid College" });
        }
        
        next();
    }
    catch (err) {
        res.status(500).send({ status: false, msg: err.message });
    }
}
const validCollegeDetails = async function (req, res, next) {
    try {
        let collegeName = req.query.collegeName;
        if (!collegeName) {
            res.status(400).send({ status: false, msg: "Plz Enter CollegeName In Query !!!" });
        }
        next();
    }
    catch (err) {
        res.status(500).send({ status: false, msg: err.message });
    }
}

module.exports = { validCollegeDetails, validIntern, validCollege };