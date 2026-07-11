const test=require("node:test"); const assert=require("node:assert/strict");
const User=require("../src/models/User"); const Trek=require("../src/models/Trek"); const Fund=require("../src/models/Fund"); const Assignment=require("../src/models/Assignment"); const {publicUser,trek}=require("../src/utils/mongoResponse");
test("MongoDB models are registered",()=>{assert.equal(User.modelName,"User");assert.equal(Trek.modelName,"Trek");assert.equal(Fund.modelName,"Fund");assert.equal(Assignment.modelName,"Assignment");});
test("legacy API identifiers are preserved",()=>{const user=new User({_id:"507f1f77bcf86cd799439011",userName:"Test",email:"test@example.com",password:"hash",role:"user"});assert.equal(publicUser(user,true).id,"507f1f77bcf86cd799439011");const item=new Trek({_id:"507f1f77bcf86cd799439012",title:"Trip",price:10,commission:1});assert.equal(trek(item).trekID,"507f1f77bcf86cd799439012");});
test("password is excluded by default",()=>{assert.equal(User.schema.path("password").options.select,false);});
test("customer support is a valid application role",()=>{assert.ok(User.schema.path("role").enumValues.includes("customer_support"));});
