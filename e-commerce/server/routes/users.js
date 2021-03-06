var express = require('express');
var router = express.Router();
var User = require('./../models/user');
require('../util/util');
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
//登录
router.post('/login',(req,res,next)=>{
    let param = { //参数
       userName: req.body.userName,
       userPwd: req.body.userPwd,
    };
    User.findOne(param,(err,doc)=>{ //查找用户名
      if(err){ //是否错误
        res.json({
           status:'1',
           msg : err.message
        })
      }else {
        if(doc){ //是否存在用户名
          res.cookie('userName',doc.userName,{
            path:'/',
            maxAge : 1000 * 60 * 60
          });
          res.cookie('userId',doc.userId,{
            path:'/',
            maxAge : 1000 * 60 * 60
          });
          res.json({
            status:'0',
            msg:'',
            result:{
                userName: doc.userName // 回调用户名
            }
          })
        }else { //账号密码错误
          res.json({
            status:'2',
            msg: '用户名或者密码错误'
          })
        }
      }
    })
});

router.post('/loginout',(req,res,next)=>{
    res.cookie('userName','',{
      path:'/',
      maxAge:-1
    });
    res.json({
       status:'0',
       msg:'登出成功',
       result:''
    })
});

//获取购物车信息
router.post('/cartList',(req,res,next)=>{
  let cookieId = req.cookies.userId;
  if(cookieId){
     User.findOne({'userId':cookieId},(err,doc)=>{
        if(err){
          res.json({
            status:'1',
            msg:err.message,
            result:''
          })
        }else {
          res.json({
            status:'0',
            msg:'获取购物车信息成功',
            result:doc.cartList
          })
        }
     })
  }
});

//获取产品数量
router.get('/cartNums',(req,res,next)=>{
  let userId = req.cookies.userId;
  User.findOne({'userId':userId},(err,doc)=>{
    if(err){
      res.json({
        status:'1',
        msg:err.messages,
        result:'error'
      })
    }else {
      let nums = 0;
      doc.cartList.map((emit)=>{
        if(emit.checked == '1'){
          nums += emit.productNum;
        }
      });
      res.json({
        status:'0',
        msg:'suc',
        result:nums
      })
    }
  })
});
//删除产品
router.post('/delList',(req,res,next)=>{
  let userId = req.cookies.userId;
  let cartId = req.body.cartId;
  User.update({'userId':userId},{
    $pull:{
         'cartList':{
           'productId':cartId
         }
    }
  },(err,doc)=>{
    if(err){
      res.json({
        status:'1',
        msg:'删除失败',
        result:''
      })
    }else {
      res.json({
        status:'0',
        msg:'删除成功',
        result:'suc'
      })
    }
  })
});

//修改产品属性
  router.post('/eaitList',(req,res,next)=>{
  let userId = req.cookies.userId;
  let productNum = req.body.productNum;
  let productId = req.body.productId;
  let checked = req.body.checked;
  User.update({'userId':userId,'cartList.productId':productId},{
    'cartList.$.productNum' : productNum,
    'cartList.$.checked' : checked
  },(err,doc)=>{
    if(err){
      res.json({
        status:'1',
        msg:'error',
        result:''
      })
    }else {
      res.json({
        status:'0',
        msg:'success',
        result:'suc'
      })
    }
  })
});


//  全选
 router.post('/priceAll',(req,res,next)=>{
   let userId = req.cookies.userId;
   let checkedAll = req.body.checked?'1':'0';
   User.findOne({'userId':userId},(err,user)=>{
     if(err){
       res.json({
         status:'1',
         msg:err.measure,
         result:''
       })
     }else{
       if(user){
         user.cartList.forEach((item)=>{
           item.checked = checkedAll;
         });
         user.save((err1,doc1)=>{
           if(err1){
             res.json({
               status:'2',
               msg:err.measure,
               result:''
             })
           }else {
             res.json({
               status:'0',
               msg:'suc',
               result:doc1
             })
           }
         })
       }
     }
   })
 });


// 获取地址信息
router.get('/address',(req,res,next)=>{
  let userId = req.cookies.userId;
  User.findOne({'userId':userId},(err,doc)=>{
    if(err){
      res.json({
        status:'1',
        msg:err.message,
        result:'error'
      })
    }else {
      res.json({
        status:'0',
        msg:'',
        result:doc.addressList
      })
    }
  })
});

//设置默认地址
router.post('/setDefault',(req,res,next)=>{
   let  userId = req.cookies.userId;
   let  addressId = req.body.addressId;
   User.findOne({'userId':userId},(err,doc)=>{
     if(err){
       res.json({
         status:'1',
         msg:err.message,
         result:'error'
       })
     }else {
       if(doc){
         doc.addressList.forEach((items)=>{
           if(items.addressId == addressId){
             items.isDefault = true;
           }else {
             items.isDefault = false;
           }
         });
         doc.save((err1,doc1)=>{
           if(err1){
             res.json({
               status:'2',
               msg:err.message,
               result:'error'
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
});


//删除地址
router.post('/delAddress',(req,res,next)=>{
   let userId = req.cookies.userId,
     addressId = req.body.addressId
  User.update({
    'userId':userId
  },{
    $pull:{
      'addressList':{
        'addressId':addressId
      }
    }
  },(err,doc)=>{
    if(err){
      res.json({
        status:'1',
        msg:err.message,
        result:'error'
      })
    }else {
      res.json({

      })
    }
  })
});

//生成订单信息
router.post('/createOrder',(req,res,next)=>{
  let userId = req.cookies.userId;
  let orderTotal = req.body.orderTotal;
  let addressId = req.cookies.address;

  User.findOne({'userId':userId},(err,doc)=>{
    if(err){
      res.json({
        status:'0',
        msg:err.message,
        result:'error'
      })
    }else {
      let address = '';
      let goodsList = [];
      doc.addressList.forEach((item)=>{
        if(item.addressId == addressId){
          address = item;
        }
      });

      doc.cartList.forEach((item)=>{
        if(item.checked == '1'){
           goodsList.push(item);
        }
      });
      let ord = '662';
      let r1 = Math.floor(Math.random() * 10);
      let r2 = Math.floor(Math.random() * 10);
      let creatNum = new Date().Format('yyyyMMddhhmmss');
      let creatDate = new Date().Format('yyyy-MM-dd hh:mm:ss');
      let order = {
        orderId:ord + r1 + creatNum + r2,
        orderTotal:orderTotal,
        addressInfo:address,
        goodsList:goodsList,
        orderStatus:'1',
        createDate:creatDate,
      };

      doc.orderList.push(order);
      doc.save((err1,doc1)=>{
        if(err1){
          res.json({
            status:'2',
            msg:err1.messages,
            result:'error'
          })
        }else {
          res.json({
            status:'0',
            msg:'',
            result:{
              orderId:order.orderId,
              orderTotal:order.orderTotal
            }
          })
        }
      })
    }
  });
});

//订单成功页面
router.get('/orderList',(req,res,next)=>{
  let userId = req.cookies.userId,
      orderId = req.query.orderId;
  User.findOne({'userId':userId},(err,doc)=>{
    if(err){
      res.json({
        status:'1',
        msg:err.messages,
        result:'error'
      })
    }else {
      let orderTotal = 0;
      doc.orderList.forEach((item)=>{
        if(item.orderId === orderId){
            orderTotal = item.orderTotal;
        }
      });
      res.json({
        status:'0',
        msg:'',
        result:{
          orderTotal:orderTotal,
          orderId:orderId
        }
      })
    }
  })
});
module.exports = router;
