const utils = require('./utils');
const expect = require('expect');

it('should add two numbers', ()=>{
    var res = utils.add(33,11);

    expect(res).toBe(44).toBeA('number');
    // if(res!=44){
    //     throw new Error(`Expected 44 but result ${res}`)
    // }
});

it('should get square of the number', ()=>{
    var res = utils.square(5);

    expect(res).toBe(25).toBeA('number');
    // if(res!=25){
    //     throw new Error(`Expected 44 but result ${res}`)
    // }
});

it('should set firstName and lastName', () => {
    var user = {location: 'Philadelphia', age: 25};
    var res = utils.setName(user, 'Andrew Mead');
  
    expect(res).toInclude({
      firstName: 'Andrew',
      lastName: 'Mead'
    });
  });
  
  // it('should expect some values', () => {
  //   // expect(12).toNotBe(12);
  //   // expect({name: 'andrew'}).toNotEqual({name: 'Andrew'});
  //   // expect([2,3,4]).toExclude(1);
  //   expect({
  //     name: 'Andrew',
  //     age: 25,
  //     location: 'Philadelphia'
  //   }).toExclude({
  //     age: 23
  //   })
  // });