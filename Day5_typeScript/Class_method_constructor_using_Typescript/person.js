"use strict";
//This file defines Person and Student classes demonstrating OOP concepts in TypeScript.
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Student = exports.Person = void 0;
var Person = /** @class */ (function () {
    function Person(name, age, institute) {
        this.name = name;
        this.age = age;
        this.institute = institute;
        this.id = ++Person.counter;
    }
    // Public method to greet
    Person.prototype.greet = function () {
        return "Hello, my name is ".concat(this.name, ", I am ").concat(this.age, " years old and I study at ").concat(this.institute, ". My ID is ").concat(this.id, ".");
    };
    // Protected getter for age (accessible in subclasses)
    Person.prototype.getAge = function () {
        return this.age;
    };
    // Public method to show private ID
    Person.prototype.showId = function () {
        return this.id;
    };
    // Static getter to access current counter
    Person.getCounter = function () {
        return Person.counter;
    };
    Person.counter = 0;
    return Person;
}());
exports.Person = Person;
// Student class extending Person
var Student = /** @class */ (function (_super) {
    __extends(Student, _super);
    function Student(name, age, institute, skills) {
        if (skills === void 0) { skills = []; }
        var _this = _super.call(this, name, age, institute) || this;
        _this.skills = skills;
        return _this;
    }
    // Method to get student details
    Student.prototype.getStudentDetails = function () {
        return "".concat(this.greet(), " I currently have ").concat(this.skills.length, " skill(s).");
    };
    // Method to add a new skill
    Student.prototype.addSkill = function (skill) {
        this.skills.push(skill);
        console.log("Skill \"".concat(skill, "\" added successfully."));
    };
    // Method to display protected age and skills
    Student.prototype.display = function () {
        console.log("My age is ".concat(this.getAge(), " years and my skills are: ").concat(this.skills.join(", "), "."));
    };
    // Override greet() method
    Student.prototype.greet = function () {
        return "Hello, my name is ".concat(this.name, ", I am ").concat(this.age, " years old and I study at ").concat(this.institute, ". I have the following skills: ").concat(this.skills.join(", "), ".");
    };
    return Student;
}(Person));
exports.Student = Student;
