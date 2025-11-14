//This file defines Person and Student classes demonstrating OOP concepts in TypeScript.

export class Person {
    private static counter: number = 0;
    private readonly id: number;

    constructor(
        public name: string,
        public age: number,
        readonly institute: string
    ) {
        this.id = ++Person.counter;
    }

    // Public method to greet
    public greet(): string {
        return `Hello, my name is ${this.name}, I am ${this.age} years old and I study at ${this.institute}. My ID is ${this.id}.`;
    }

    // Protected getter for age (accessible in subclasses)
    protected getAge(): number {
        return this.age;
    }

    // Public method to show private ID
    public showId(): number {
        return this.id;
    }

    // Static getter to access current counter
    public static getCounter(): number {
        return Person.counter;
    }
}

// Student class extending Person
export class Student extends Person {
    private skills: string[];

    constructor(name: string, age: number, institute: string, skills: string[] = []) {
        super(name, age, institute);
        this.skills = skills;
    }

    // Method to get student details
    public getStudentDetails(): string {
        return `${this.greet()} I currently have ${this.skills.length} skill(s).`;
    }

    // Method to add a new skill
    public addSkill(skill: string): void {
        this.skills.push(skill);
        console.log(`Skill "${skill}" added successfully.`);
    }

    // Method to display protected age and skills
    public display(): void {
        console.log(`My age is ${this.getAge()} years and my skills are: ${this.skills.join(", ")}.`);
    }

    // Override greet() method
    public override greet(): string {
        return `Hello, my name is ${this.name}, I am ${this.age} years old and I study at ${this.institute}. I have the following skills: ${this.skills.join(", ")}.`;
    }
}