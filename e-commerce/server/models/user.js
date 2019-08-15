const mongoose =  require('mongoose');
const UsersSchema = new mongoose.Schema({
   'userId':String,
   'userName':String,
   'userPwd':String,
   'orderList':Array,
   'cartList':[
       {
           "productId":String,
           "productName":String,
           "salePrice":Number,
           "productImage":String,
           'productNum':String,
           'checked':String
       }
   ],
    'addressList':Array
});

module.exports = mongoose.model('Users',UsersSchema);