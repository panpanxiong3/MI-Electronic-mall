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


module.exports = router;
