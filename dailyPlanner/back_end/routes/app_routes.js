const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const sequlize = new Sequelize('daily_planner_development', "root", "root", {
    dialect: 'mysql',
    host: '127.0.0.1',
    port: 8889
});
const db = require('../models');
const router = require('express').Router();
const accountSid = 'twilio Key';
const authToken = 'twilio key';
const clientSms = require('twilio')(accountSid, authToken);



function addOrUpdate(model, createValues,updateValues, cond){
    model.findOne({ where: cond })
    .then(function(tableObject) {
        if(tableObject) { // update table
            return tableObject.update(updateValues);
        }
        else { // insert table
            return model.create(createValues);
        }
    })
}

async function findConfig(model,whereCause){
    return model.findOne({
        where: whereCause
    }).then(function(entry){
        if(entry){
            return entry.value;
        }
        else{
            return null;
        }
    });
}

async function checkEventSMS(){
    let startTime = new Date();
    let endTime = new Date(startTime.getTime() + (60 * 1000));
    let fromPhone = await findConfig(db.app_config,{name:'twilio_phone_number'});
    let toPhone = await findConfig(db.app_config,{name:'sms_to_phone_number'});
    db.Event.findOne({
        where: {
            start_time :{
                [Op.gte]: startTime,
                [Op.lte]: endTime
             }
            }
        }).then(function(tableEntry){
            if(tableEntry){
                //sms the code
                //let fromPhone = await findConfig(db.app_config,{name:'twilio_phone_number'});
                //let toPhone = await findConfig(db.app_config,{name:'sms_to_phone_number'});
                clientSms.messages
                    .create({
                        body: tableEntry.event_title,
                        from: fromPhone,
                        to: toPhone
                    })
                    .then(message => console.log(message.sid));

            }
            else{
                console.log("checked fof sms and not found");
            }
        });
}


router.post('/updateConfig',function(request,response){
    //update all four record
    if(request.body.api_key){
        addOrUpdate(db.app_config, { name : "google_api_key", value : request.body.api_key }, { value : request.body.api_key }, { name : "google_api_key" });
    }
    if(request.body.m_interval){
        addOrUpdate(db.app_config, {name : "marquee_data_interval", value : request.body.m_interval }, { value : request.body.m_interval }, {name : "marquee_data_interval" });
    }
    if(request.body.sms_phone){
        addOrUpdate(db.app_config, {name : "sms_to_phone_number", value : request.body.sms_phone }, { value : request.body.sms_phone }, {name : "sms_to_phone_number" });
    }
    if(request.body.twilio){
        addOrUpdate(db.app_config, {name : "twilio_phone_number", value : request.body.twilio }, { value : request.body.twilio }, {name : "twilio_phone_number" });
    }
    response.send("update config done");
});

router.post('/addEvent',function(request,response){

    db.Event.create({
        event_title : request.body.eventTitle,
        start_time : request.body.startTime,
        end_time : request.body.endTime,
        address: request.body.fulladdress,
        description : request.body.desc
    }).then(event=>{
        console.log(event);
    })
    .catch(err=>{
        console.log(err);
    });

    response.send("Save a new event");
});

router.post('/addRouteEventList',function(request,response){

    for(let i=0; request.body.events.length > i ; i++){
        db.Event.create({
            event_title : request.body.events[i].eventTitle,
            start_time : request.body.events[i].startTime,
            end_time : request.body.events[i].endTime,
            address: request.body.events[i].fulladdress,
            description : request.body.events[i].desc
        }).then(event=>{
            console.log(event);
        })
        .catch(err=>{
            console.log(err);
        });
    }

    response.send("Save a list of events");
});

router.post('/removeEvent',function(request,response){
    console.log("delete item:"+request.body.itemId);
    db.Event.destroy({
        where:{
            id : request.body.itemId
        }
    }).then(result=>{
        console.log(result);
    });
    response.send("delete one event");
})

router.get('/itemList',function(request,response){

    db.Event.findAll()
         .then(evts => {
         console.log(evts);
         let evtArray = [];
         for(let i = 0 ; evts.length > i ; i++){
             let evt = {
                _id : evts[i].id,
                name : evts[i].event_title,
                startDateTime : evts[i].start_time,
                endDateTime : evts[i].end_time,
                classes : "color-" + ((i % 14)+ 1)
             }
             evtArray.push(evt);
         }
         response.json(evtArray);
     })
     .catch(err => {
         console.log(err);
         response.json(err);
     })

    
});

module.exports = { router: router, checkEventSMS: checkEventSMS};
