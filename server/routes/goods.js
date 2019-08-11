var express = require('express');
var router =  express.Router();
var mongoose = require('mongoose');
var Goods = require('../models/goods');

mongoose.connect('mongodb://127.0.0.1:27017/db_demo');

mongoose.connection.on('connected',function () {
    console.log('MongoDB success');
});
mongoose.connection.on('error', function () {
  console.log('MongoDB fail');
});

mongoose.connection.on('disconnected',function (params) {
    console.log('MongoDB disconnected');
});

router.get("/",function (req,res,next) {
    let page = parseInt(req.param('page'));
    let pageSize = parseInt(req.param('pageSize'));
    let sort = parseInt(req.param('sort'));
    let skip = (page - 1) * pageSize; 
    let params = {};
    let goodModel = Goods.find(params).skip(skip).limit(pageSize);
    goodModel.sort({"salePrice": sort });
    goodModel.exec(function (err,doc) {
      if(err){
          res.json({
              status:'1',
              msg:err.message
          })
      }else{
          res.json({
              status:'0',
              msg:'',
              result:{
                  count:doc.length,
                  list:doc
              }
          })
      }  
    })
})

module.exports = router

