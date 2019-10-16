var express = require('express');
var router = express.Router();
var User = require('./../models/user');
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
module.exports = router;
