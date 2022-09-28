const express = require('express');
const { find } = require('./models/addTemp');
const addTemp = require('./models/addTemp');
const router = express();

router.post('/api/addTemp', (req, res) =>{
    const newValue = new addTemp({
        name: req.body.name, 
        temp: req.body.temp,
        led: req.body.led
    }); 

    newValue.save()
    .then(item => {
        res.json(item)
    })
    .catch(err => {
       res.status(400).json({msg:"There is an error", err}); 
    });
});

router.get('/api/getTemp/:name', async (req, res) =>{
    const findAll = await addTemp.find();
    const arrayName = findAll.filter(item => item.name == req.params.name);
    res.json(arrayName);
});

router.get('/api/getLastTemp/:name', async (req, res) =>{
    const findAll = await addTemp.find();
    const arrayName = findAll.filter(item => item.name == req.params.name);
    arrayLength = arrayName.length
    arrayLength = arrayLength - 1
    res.json(arrayName[arrayLength]);
});

module.exports = router;