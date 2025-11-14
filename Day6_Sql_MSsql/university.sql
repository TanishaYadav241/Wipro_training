
DROP DATABASE IF EXISTS university;
CREATE DATABASE university;
USE university;



-- 1. DEPARTMENTS TABLE (Independent entity)
CREATE TABLE Departments (
    DeptID INT PRIMARY KEY AUTO_INCREMENT,
    DeptName VARCHAR(100) NOT NULL UNIQUE
);

-- 2. STUDENTS TABLE (Independent entity)
CREATE TABLE Students (
    StudentID VARCHAR(50) PRIMARY KEY,
    StudentName VARCHAR(100) NOT NULL
);

-- 3. INSTRUCTORS TABLE (Dependent on Departments)
CREATE TABLE Instructors (
    InstructorID INT PRIMARY KEY AUTO_INCREMENT,
    InstructorName VARCHAR(100) NOT NULL,
    DeptID INT NOT NULL,
    FOREIGN KEY (DeptID) REFERENCES Departments(DeptID)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);

-- 4. COURSES TABLE (Dependent on Departments)
CREATE TABLE Courses (
    CourseID VARCHAR(50) PRIMARY KEY,
    CourseName VARCHAR(100) NOT NULL,
    DeptID INT NOT NULL,
    FOREIGN KEY (DeptID) REFERENCES Departments(DeptID)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);

-- 5. ENROLLMENTS TABLE (Junction table with additional attributes)
-- Represents the many-to-many relationship between Students and Courses
-- Includes instructor assignment and grade
CREATE TABLE Enrollments (
    EnrollmentID INT PRIMARY KEY AUTO_INCREMENT,
    StudentID VARCHAR(50) NOT NULL,
    CourseID VARCHAR(50) NOT NULL,
    InstructorID INT NOT NULL,
    EnrollmentDate DATE NOT NULL,
    Grade CHAR(2),
    FOREIGN KEY (StudentID) REFERENCES Students(StudentID)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (CourseID) REFERENCES Courses(CourseID)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    FOREIGN KEY (InstructorID) REFERENCES Instructors(InstructorID)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    UNIQUE KEY unique_enrollment (StudentID, CourseID)
);

-- ============================================
-- DATA POPULATION (DML)
-- ============================================

-- Insert Departments (2+ departments as required)
INSERT INTO Departments (DeptName) VALUES
('Computer Science'),
('Electrical Engineering'),
('Mechanical Engineering');

-- Insert Students (5+ students as required)
INSERT INTO Students (StudentID, StudentName) VALUES
('S101', 'Asha Gupta'),
('S102', 'Raj Verma'),
('S103', 'Neha Singh'),
('S104', 'Arjun Mehta'),
('S105', 'Priya Sharma'),
('S106', 'Vikram Patel');

-- Insert Instructors (3+ instructors as required)
INSERT INTO Instructors (InstructorName, DeptID) VALUES
('Dr. Mehta', 1),           -- Computer Science
('Dr. Sharma', 1),          -- Computer Science
('Prof. Meera Joshi', 2),   -- Electrical Engineering
('Dr. Rajiv Menon', 3),     -- Mechanical Engineering
('Dr. Anita Desai', 1);     -- Computer Science

-- Insert Courses (5+ courses as required)
INSERT INTO Courses (CourseID, CourseName, DeptID) VALUES
('C101', 'Database Systems', 1),
('C102', 'Data Structures', 1),
('C103', 'Operating Systems', 1),
('C104', 'Circuit Theory', 2),
('C105', 'Thermodynamics', 3),
('C106', 'Machine Learning', 1);

-- Insert Enrollments (with instructor assignments)
INSERT INTO Enrollments (StudentID, CourseID, InstructorID, EnrollmentDate, Grade) VALUES
-- Asha Gupta enrollments
('S101', 'C101', 1, '2023-08-15', 'A'),    -- Database Systems with Dr. Mehta
('S101', 'C102', 2, '2023-08-15', 'A'),    -- Data Structures with Dr. Sharma
('S101', 'C103', 1, '2023-09-01', 'A-'),   -- Operating Systems with Dr. Mehta

-- Raj Verma enrollments
('S102', 'C102', 2, '2023-08-16', 'B'),    -- Data Structures with Dr. Sharma
('S102', 'C101', 1, '2023-08-20', 'B+'),   -- Database Systems with Dr. Mehta

-- Neha Singh enrollments
('S103', 'C103', 1, '2023-08-17', 'C'),    -- Operating Systems
('S103', 'C104', 3, '2023-08-17', 'B'),    -- Circuit Theory

-- Arjun Mehta enrollments
('S104', 'C105', 4, '2023-08-18', 'A'),    -- Thermodynamics
('S104', 'C101', 1, '2023-08-18', NULL),   -- Database Systems - no grade yet

-- Priya Sharma enrollments
('S105', 'C102', 2, '2023-08-19', NULL),   -- Data Structures - no grade yet
('S105', 'C106', 5, '2023-09-01', NULL)   -- Machine Learning - no grade yet

-- Vikram Patel enrollments (none yet - for LEFT JOIN demonstration)

-- ============================================
-- USER STORY 2: REPORTING QUERIES
-- ============================================

-- Query 1: List of students with enrolled courses and instructors
SELECT 
    s.StudentID,
    s.StudentName,
    c.CourseName,
    i.InstructorName,
    e.Grade
FROM Students s
INNER JOIN Enrollments e ON s.StudentID = e.StudentID
INNER JOIN Courses c ON e.CourseID = c.CourseID
INNER JOIN Instructors i ON e.InstructorID = i.InstructorID
ORDER BY s.StudentName, c.CourseName;

-- Query 2: All courses with their department names (INNER JOIN)
SELECT 
    c.CourseID,
    c.CourseName,
    d.DeptName
FROM Courses c
INNER JOIN Departments d ON c.DeptID = d.DeptID
ORDER BY d.DeptName, c.CourseName;

-- Query 3: All students and their enrolled courses, including ungraded (LEFT JOIN)
SELECT 
    s.StudentID,
    s.StudentName,
    c.CourseName,
    i.InstructorName,
    e.EnrollmentDate,
    COALESCE(e.Grade, 'Not Graded') AS Grade
FROM Students s
LEFT JOIN Enrollments e ON s.StudentID = e.StudentID
LEFT JOIN Courses c ON e.CourseID = c.CourseID
LEFT JOIN Instructors i ON e.InstructorID = i.InstructorID
ORDER BY s.StudentName, c.CourseName;

-- Query 4: Instructors with no students assigned (RIGHT JOIN approach)
-- First, find instructors with students
SELECT DISTINCT
    i.InstructorID,
    i.InstructorName,
    d.DeptName
FROM Enrollments e
RIGHT JOIN Instructors i ON e.InstructorID = i.InstructorID
INNER JOIN Departments d ON i.DeptID = d.DeptID
WHERE e.InstructorID IS NULL
ORDER BY i.InstructorName;

-- Alternative approach using LEFT JOIN (more common)
SELECT 
    i.InstructorID,
    i.InstructorName,
    d.DeptName
FROM Instructors i
INNER JOIN Departments d ON i.DeptID = d.DeptID
LEFT JOIN Enrollments e ON i.InstructorID = e.InstructorID
WHERE e.EnrollmentID IS NULL
ORDER BY i.InstructorName;

-- ============================================
-- ADDITIONAL USEFUL QUERIES
-- ============================================

-- Student enrollment summary
SELECT 
    s.StudentName,
    COUNT(e.EnrollmentID) AS TotalCourses,
    COUNT(e.Grade) AS GradedCourses,
    COUNT(e.EnrollmentID) - COUNT(e.Grade) AS PendingGrades
FROM Students s
LEFT JOIN Enrollments e ON s.StudentID = e.StudentID
GROUP BY s.StudentID, s.StudentName
ORDER BY TotalCourses DESC;

-- Instructor workload
SELECT 
    i.InstructorName,
    d.DeptName,
    COUNT(DISTINCT e.StudentID) AS TotalStudents,
    COUNT(DISTINCT e.CourseID) AS CoursesTeaching
FROM Instructors i
INNER JOIN Departments d ON i.DeptID = d.DeptID
LEFT JOIN Enrollments e ON i.InstructorID = e.InstructorID
GROUP BY i.InstructorID, i.InstructorName, d.DeptName
ORDER BY TotalStudents DESC;

-- Department enrollment statistics
SELECT 
    d.DeptName,
    COUNT(DISTINCT c.CourseID) AS TotalCourses,
    COUNT(DISTINCT e.StudentID) AS UniqueStudents,
    COUNT(e.EnrollmentID) AS TotalEnrollments
FROM Departments d
LEFT JOIN Courses c ON d.DeptID = c.DeptID
LEFT JOIN Enrollments e ON c.CourseID = e.CourseID
GROUP BY d.DeptID, d.DeptName
ORDER BY TotalEnrollments DESC;



SELECT DISTINCT
    s.StudentID,
    s.StudentName,
    c.CourseName,
    e.Grade
FROM Students s
INNER JOIN Enrollments e ON s.StudentID = e.StudentID
INNER JOIN Courses c ON e.CourseID = c.CourseID
WHERE e.Grade = 'A';
ok