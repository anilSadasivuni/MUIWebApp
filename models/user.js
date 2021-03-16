class user{
  constructor(userId,password,firstName,lastName,email,add1,add2,city,state,zipCode,country)
  {
    this.userId=userId;
    this.password=password;
    this.firstName=firstName;
    this.lastName=lastName;
    this.email=email;
    this.add1=add1;
    this.add2=add2;
    this.city=city;
    this.state=state;
    this.zipCode=zipCode;
    this.country=country;
  }
}

module.exports = user;
