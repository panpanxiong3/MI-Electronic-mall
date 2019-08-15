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
    let priceLeave = req.param('priceLeave');
    let sortNum = parseInt(req.param('sort'));
    let skip = (page - 1) * pageSize;
    let params = {};
    let priceMax = '';
    let priceMin = '';
    if (priceLeave != 'all'){
        switch (priceLeave) {
            case '0':priceMin=0;priceMax=100;break;
            case '1':priceMin=100;priceMax=500;break;
            case '2':priceMin=500;priceMax=1000;break;
            case '3':priceMin=1000;priceMax=5000;break;
        }
        params = {
            salePrice:{
                $gt:priceMin,
                $lte:priceMax
            }
        }
    }
    let goodModel = Goods.find(params).skip(skip).limit(pageSize);
    goodModel.sort({"salePrice": sortNum});
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
});

router.post('/addCart',(req,res,next)=>{
       var  userId = '100000077',productId = req.body.productId;
       var  User = require('../models/user');
       User.findOne({userId:userId},(err1,userDoc)=>{
           if(err1){
               res.json({
                   status:'1',
                   msg:err1.message
               })
           }else {
               if(userDoc){
                   let goodsItem = '';
                   userDoc.cartList.forEach((item)=>{
                       if(item.productId == productId){
                           goodsItem = item;
                           item.productNum ++ ;
                       }
                   });
                   if(goodsItem){
                       userDoc.save((err2,data)=>{
                           if(err2){
                               res.json({
                                   status:'1',
                                   msg:err2.message
                               })
                           }else {
                               res.json({
                                   status:'0',
                                   msg:'',
                                   result:'success'
                               })
                           }
                       })
                   }else {
                       Goods.findOne({productId:productId},(err1,doc)=>{
                           if(err1){
                               res.json({
                                   status:'1',
                                   msg:err1.message
                               })
                           }else {
                               if(doc){
                                   doc.productNum = 1;
                                   doc.checked = 1;
                                   userDoc.cartList.push(doc);
                                   userDoc.save((err2,data)=>{
                                       if(err2){
                                           res.json({
                                               status:'1',
                                               msg:err2.message
                                           })
                                       }else {
                                           res.json({
                                               status:'0',
                                               msg:'',
                                               result:'success'
                                           })
                                       }
                                   })
                               }
                           }
                       })
                   }

               }
           }
       })
});
module.exports = router;

