const express = require('express');
const router = express.Router();
const Category = require('../models/Category');


router.post('/',
    async function(req, res, next) {
        console.log('In the Route');
        const category = new Category({
            name:req.body.name
        });
        category.save()
            .then(category => res.status(200).json({
                msg: "category saved successfully",
                category: category
            }))
            .catch(err => console.log(err))
    });

router.get('/categories',async function(req,res,next){

    Category.find({})
        .then(allCategories => res.status(200).json(allCategories))
        .catch(err => res.status(500).json({
            msg:'No categories'
        }))
});

module.exports = router;
