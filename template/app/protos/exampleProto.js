/**
 * Create objects using the same proto like this :
 * @example
 * const obj1 = Object.create(exampleProto);
 * const obj2 = Object.create(exampleProto);
 * 
 * console.log(Object.getPrototypeOf(obj1)); // { greet: [Function: greet] }
 * obj2.greet(); // Hello World !
 */
const exampleProto = {
  greet: () => console.log("Hello World !"),
};

module.exports = exampleProto;
 