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
           'productNum':Number,
           'checked':String
       }
   ],
    'addressList':[
      {
        addressId: String,
        userName: String,
        streetName: String,
        postCode: Number,
        tel: Number,
        isDefault: Boolean
      }
    ]
});

module.exports = mongoose.model('Users',UsersSchema);
