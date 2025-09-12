// ____________OOP practice________________________

function little(a, b) {
  return a + b;
}
const lName = "Uddin";

class Truck {
  constructor(star = little, lastname = lName) {
    this.driver = "forhad";
    this.lastname = lastname;
    this.frontWheel = 2;
    this.rearWheel = 4;
    this.star = star; //(this.frontWheel, this.rearWheel);
  }
}

const truck2 = new Truck();
// console.log(truck2);

console.log(null + 0); 
