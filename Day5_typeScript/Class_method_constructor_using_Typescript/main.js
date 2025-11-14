"use strict";
// main.ts - Demonstrates usage of Person and Student classes
Object.defineProperty(exports, "__esModule", { value: true });
var person_js_1 = require("./person.js");
// Creating an object of Person class
var person1 = new person_js_1.Person("Alice", 30, "Wonderland University");
console.log(person1.greet());
console.log("Person ID: ".concat(person1.showId()));
console.log("---------------------------");
// console.log("Person Counter:", Person.counter);
// Creating an object of Student class
var student1 = new person_js_1.Student("Bob", 20, "Builder Institute", ["JavaScript", "TypeScript"]);
console.log(student1.getStudentDetails());
student1.addSkill("React");
student1.display();
console.log("Student ID: ".concat(student1.showId()));
console.log("---------------------------");
// console.log("Person Counter after creating Student:", Person.counter);
