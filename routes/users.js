var express = require('express');
var router = express.Router();
const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const config  = require('config');
const Users = require("../models/User");
const auth = require("../middleware/auth");


//@route  GET api/users
//@desc   Get logged in user
//@access  Private
router.get("/", async (req, res) => {
    console.log(`logged in user route - > `);
    try {
        const user = await Users.findById(req.user).select("-password");
        res.json({ user });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: error });
    }
});

//@route  POST  user/auth
//@desc   auth  user & get token
//@access Public
router.post("/login",[
    check("email", "Email is required")
        .not()
        .isEmpty(),
    check(
        "password",
        "Please enter a password between 8 to 12 characters"
    ).isLength({ min: 8, max: 12 })

],
    async (req, res, next) => {
    console.log("in the login route");
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ msg: 'invalid input ' });
        }
        const { email, password } = req.body;
        try {
            const user = await Users.findOne({ email: email });
            console.log(email);
            console.log(user);
            if (!user)
                return res.status(400).json({ msg: "Invalid user or password" });
            // check if pass is correct
            const passwordTest = await user.checkPassword(password);
            if (!passwordTest)
                return res.status(400).json({ msg: "Invalid user or password" });
            const payload = {
                    id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    idNumber: user.idNumber,
                    city: user.city,
                    street: user.street,
                    admin: user.admin
            };
                console.log(payload);
            if(payload.admin){
                const adminPayload = {
                    id: payload.id,
                    firstName: payload.firstName,
                    lastName: payload.lastName,
                    idNumber: payload.idNumber,
                    admin: payload.admin
                };
                console.log(adminPayload);
                jwt.sign(

                    adminPayload,
                  config.get('jwtSecret'),
                    {
                        expiresIn: 3600
                    },
                    (err,token)=>{
                        res.json({admin: adminPayload,token:token})
                    }
                )

            }

            jwt.sign(
                payload,
                // config.jwtSecret
                config.get('jwtSecret') ,
                {
                    expiresIn: 36000
                },
                (err, token) => {
                    res.json({ user: payload,token:token })
                }
            );
        } catch (err) {
            console.log(err);
            res.status(500).json("Server error");
        }
    }   );


// @route  POST URL/users/register
// @desc   Resister a user
//@access  public
router.post('/register',[
        check("idNumber","User ID is required")
            .not()
            .isEmpty()
            .isLength({ min: 2}),
        check("email","Email is required")
            .not()
            .isEmpty()
            .isEmail(),
        check(
            "password",
            "Please enter a password between 8 to 12 characters"
        ).isLength({ min: 8, max: 12 }),
        check("street","Street is required ")
            .not()
            .isEmpty(),
        check("city","City is required")
            .not()
            .isEmpty(),
        check("firstName", "First name is required")
            .not()
            .isEmpty()
            .isLength({ min: 2, max: 12 }),
            check("lastName", "Last name is required")
                .not()
                .isEmpty()
                .isLength({ min: 2, max: 12 }),
        ],
    async function(req, res, next) {
      const errors = validationResult(req);
      console.log(errors);
      if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
      }
      const {idNumber, email, password,city,street,firstName,lastName} = req.body;
      try {
        let user = await Users.findOne({email});
        if (user) {
          res.status(400).json({msg: "Email already exists"});
        }else{
            console.log(idNumber, email, password,city,street,firstName,lastName);
            Users.findOne({idNumber: req.body.idNumber}).then(user =>{
                if(user){
                    res.status(400).json('ID already exists');
                }
            })
        }
        user = new Users({
            firstName,
            lastName,
            idNumber,
            email,
            city,
            street,
            password
        });
        await user.save();
        const payload = {
            user: {
                id: user.id
            }
        };

          jwt.sign(
              payload,
              config.get('jwtSecret')
              ,
              {
                  expiresIn: 360000
              },
              (err, token) => {
                  if (err) throw err;
                  res.json({ token }).status(200);
              }
          );
      } catch (e) {
        console.log(e);
        res.status(500).send("Server error");
      }
    });

router.post('/checkUserCredentials',[
    check("idNumber")
        .isLength({ min: 8}).withMessage("Id number should at least 9 chars long"),
    check("email")
        .isEmail().withMessage("Email format is correct"),
    check("password")
        .isLength({ min: 5 }).withMessage('must be at least 5 chars long')
        // .not().isEmpty().withMessage("Password")
],async (req, res) => {
const errors = validationResult(req);
if(!errors.isEmpty()){
    res.status(422).json({errors:errors.array()})
}
    const userEmail = req.body.email.toLowerCase();

    Users.findOne({email: userEmail}).then(user => {
        if (user) {
            return res.status(400).json({msg:"Email already exists"});
        } else {
            Users.findOne({idNumber: req.body.idNumber}).then(user => {
                if (user) {
                    errors.idNumber = 'ID already exists';
                    return res.status(400).json(errors);
                } else {
                    res.status(200).json({
                        userChecked: true
                    })
                }
            })
        }
    })

});

module.exports = router;
