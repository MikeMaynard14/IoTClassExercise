const express = require('express');
const { find } = require('./models/addTemp');
const addTemp = require('./models/addTemp');
const ledState = require('./models/ledState');
const router = express();

router.post('/api/addTemp', (req, res) =>{
    const newValue = new addTemp({
        name: req.body.name, 
        temp: req.body.temp,
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

router.patch ('/api/updateLed/:name', async (req, res) => {

    const findAll = await ledState.find();
    const arrayName = findAll.filter(item => item.name == req.params.name);
    currentId = "";

    if (arrayName == false){
        const newValue = new ledState({
            name: req.body.name, 
            led: req.body.led,
        });
    
        newValue.save()
        .then(item => {
            res.json(item)
        })
        .catch(err => {
           res.status(400).json({msg:"There is an error", err}); 
        });
    }
    else{
        currentId = arrayName[0]._id
    }

    const findLed = await ledState.updateOne(
        {_id:currentId},
        {$set: {
                name: req.params.name,
                led: req.body.led
            }
        }
    );
    res.json(findLed);
})

router.get('/api/getLed/:name', async (req, res) =>{
    const findAll = await ledState.find();
    const arrayName = findAll.filter(item => item.name == req.params.name);
    console.log(arrayName[0]);
    res.json(arrayName[0]);
});

router.get('/api/getLed/', async (req, res) =>{
    const findAll = await ledState.find();
    res.json(findAll);
});

module.exports = router;