-- USER STORY 1: DATABASE SETUP (DDL)

-- Create Database
DROP DATABASE IF EXISTS TechNovaDB;
CREATE DATABASE TechNovaDB;
USE TechNovaDB;

-- Create Department Table
CREATE TABLE Department (
    DeptID INT PRIMARY KEY,
    DeptName VARCHAR(50) NOT NULL UNIQUE,
    Location VARCHAR(50) NOT NULL
);


-- Create Employee Table
CREATE TABLE Employee (
    EmpID INT PRIMARY KEY,
    EmpName VARCHAR(100) NOT NULL,
    Gender CHAR(1) CHECK (Gender IN ('M', 'F', 'O')),
    DOB DATE NOT NULL,
    HireDate DATE NOT NULL,
    DeptID INT,
    FOREIGN KEY (DeptID) REFERENCES Department(DeptID) ON DELETE SET NULL
);

-- Create Project Table
CREATE TABLE Project (
    ProjectID INT PRIMARY KEY,
    ProjectName VARCHAR(100) NOT NULL,
    DeptID INT,
    StartDate DATE NOT NULL,
    EndDate DATE,
    FOREIGN KEY (DeptID) REFERENCES Department(DeptID) ON DELETE CASCADE
);

-- Create Performance Table
CREATE TABLE Performance (
    EmpID INT,
    ProjectID INT,
    Rating DECIMAL(3,2) CHECK (Rating BETWEEN 0 AND 5),
    ReviewDate DATE NOT NULL,
    PRIMARY KEY (EmpID, ProjectID),
    FOREIGN KEY (EmpID) REFERENCES Employee(EmpID) ON DELETE CASCADE,
    FOREIGN KEY (ProjectID) REFERENCES Project(ProjectID) ON DELETE CASCADE
);

-- Create Reward Table
CREATE TABLE Reward (
    RewardID INT AUTO_INCREMENT PRIMARY KEY,
    EmpID INT,
    RewardMonth DATE NOT NULL,
    RewardAmount DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (EmpID) REFERENCES Employee(EmpID) ON DELETE CASCADE
);

-- Create Indexes for Optimization
CREATE INDEX idx_emp_name ON Employee(EmpName);
CREATE INDEX idx_emp_dept ON Employee(DeptID);

-- USER STORY 2: INSERT AND MANAGE DATA (DML)

-- Insert Department Data
INSERT INTO Department (DeptID, DeptName, Location) VALUES
(101, 'IT', 'Bangalore'),
(102, 'HR', 'Delhi'),
(103, 'Finance', 'Mumbai'),
(104, 'Marketing', 'Pune'),
(105, 'Operations', 'Chennai');


-- Insert Employee Data
INSERT INTO Employee (EmpID, EmpName, Gender, DOB, HireDate, DeptID) VALUES
(1, 'Asha', 'F', '1990-07-12', '2018-06-10', 101),
(2, 'Raj', 'M', '1988-04-09', '2020-03-22', 102),
(3, 'Neha', 'F', '1995-01-15', '2021-08-05', 101),
(4, 'Vikram', 'M', '1992-11-20', '2019-05-15', 103),
(5, 'Priya', 'F', '1993-03-08', '2022-01-10', 104),
(6, 'Arjun', 'M', '1991-09-25', '2017-12-01', 105),
(7, 'Sneha', 'F', '1994-06-18', '2020-07-20', 101);

-- Insert Project Data
INSERT INTO Project (ProjectID, ProjectName, DeptID, StartDate, EndDate) VALUES
(201, 'Cloud Migration', 101, '2023-01-15', '2023-12-31'),
(202, 'Employee Portal', 102, '2023-03-01', '2024-02-28'),
(203, 'Budget Optimization', 103, '2023-06-01', NULL),
(204, 'Digital Marketing Campaign', 104, '2023-02-10', '2023-11-30'),
(205, 'Supply Chain Automation', 105, '2023-04-01', NULL);

-- Insert Performance Data
INSERT INTO Performance (EmpID, ProjectID, Rating, ReviewDate) VALUES
(1, 201, 4.5, '2023-12-15'),
(2, 202, 4.0, '2024-01-20'),
(3, 201, 4.8, '2023-12-15'),
(4, 203, 3.9, '2024-02-10'),
(5, 204, 4.2, '2023-10-25'),
(6, 205, 4.6, '2024-03-05'),
(7, 201, 4.3, '2023-12-15');

-- Insert Reward Data
INSERT INTO Reward (EmpID, RewardMonth, RewardAmount) VALUES
(1, '2024-01-01', 2500.00),
(3, '2024-01-01', 3000.00),
(2, '2024-02-01', 1500.00),
(5, '2024-03-01', 2200.00),
(6, '2024-03-01', 2800.00),
(4, '2024-01-01', 800.00),
(7, '2024-02-01', 1800.00);

-- Update Employee Department
UPDATE Employee 
SET DeptID = 103 
WHERE EmpID = 2;

-- Delete Reward Record where amount is less than 1000
DELETE FROM Reward 
WHERE RewardAmount < 1000;

-- USER STORY 3: GENERATE INSIGHTS (DQL)

-- 1. Retrieve all employees who joined after 2019-01-01
SELECT * FROM Employee 
WHERE HireDate > '2019-01-01'
ORDER BY HireDate;


-- 2. Find the average performance rating of employees in each department
SELECT 
    d.DeptName,
    AVG(p.Rating) AS AvgRating
FROM Department d
JOIN Employee e ON d.DeptID = e.DeptID
JOIN Performance p ON e.EmpID = p.EmpID
GROUP BY d.DeptName
ORDER BY AvgRating DESC;

-- 3. List employees with their age (using date function)
SELECT 
    EmpID,
    EmpName,
    DOB,
    TIMESTAMPDIFF(YEAR, DOB, CURDATE()) AS Age
FROM Employee
ORDER BY Age;

-- 4. Find the total rewards given in the current year
SELECT 
    YEAR(RewardMonth) AS RewardYear,
    SUM(RewardAmount) AS TotalRewards
FROM Reward
WHERE YEAR(RewardMonth) = YEAR(CURDATE())
GROUP BY YEAR(RewardMonth);

-- 5. Retrieve employees who have received rewards greater than 2000
SELECT DISTINCT 
    e.EmpID,
    e.EmpName,
    r.RewardAmount,
    r.RewardMonth
FROM Employee e
JOIN Reward r ON e.EmpID = r.EmpID
WHERE r.RewardAmount > 2000
ORDER BY r.RewardAmount DESC;

-- USER STORY 4: ADVANCED QUERIES (JOINS AND SUBQUERIES)

-- 1. Display Employee Name, Department Name, Project Name, and Rating
SELECT 
    e.EmpName,
    d.DeptName,
    p.ProjectName,
    perf.Rating
FROM Employee e
JOIN Department d ON e.DeptID = d.DeptID
JOIN Performance perf ON e.EmpID = perf.EmpID
JOIN Project p ON perf.ProjectID = p.ProjectID
ORDER BY e.EmpName;

-- 2. Find the highest-rated employee in each department using subquery
SELECT 
    e.EmpName,
    d.DeptName,
    p.Rating
FROM Employee e
JOIN Department d ON e.DeptID = d.DeptID
JOIN Performance p ON e.EmpID = p.EmpID
WHERE p.Rating = (
    SELECT MAX(p2.Rating)
    FROM Performance p2
    JOIN Employee e2 ON p2.EmpID = e2.EmpID
    WHERE e2.DeptID = e.DeptID
)
ORDER BY d.DeptName;

-- 3. List all employees who have not received any rewards using subquery
SELECT 
    EmpID,
    EmpName,
    DeptID
FROM Employee
WHERE EmpID NOT IN (
    SELECT DISTINCT EmpID 
    FROM Reward
)
ORDER BY EmpName;


-- USER STORY 5: TRANSACTION CONTROL AND OPTIMIZATION

-- Transaction : Insert new employee with performance record
START TRANSACTION;

-- Insert new employee
INSERT INTO Employee (EmpID, EmpName, Gender, DOB, HireDate, DeptID) 
VALUES (8, 'Karan', 'M', '1996-02-14', '2024-04-01', 101);

-- Add performance record
INSERT INTO Performance (EmpID, ProjectID, Rating, ReviewDate) 
VALUES (8, 201, 4.1, '2024-05-15');

-- If everything is successful, commit
COMMIT;

-- Query without using index 
EXPLAIN SELECT e.EmpName, d.DeptName, p.ProjectName, perf.Rating
FROM Employee e, Department d, Project p, Performance perf
WHERE e.DeptID = d.DeptID 
AND perf.EmpID = e.EmpID 
AND perf.ProjectID = p.ProjectID;

-- Same query optimized with proper JOIN syntax (uses indexes)
EXPLAIN SELECT e.EmpName, d.DeptName, p.ProjectName, perf.Rating
FROM Employee e
JOIN Department d ON e.DeptID = d.DeptID
JOIN Performance perf ON e.EmpID = perf.EmpID
JOIN Project p ON perf.ProjectID = p.ProjectID;

-- BONUS CHALLENGE

-- 1. Create a view named EmployeePerformanceView
CREATE OR REPLACE VIEW EmployeePerformanceView AS
SELECT 
    e.EmpID,
    e.EmpName,
    e.Gender,
    d.DeptName,
    d.Location,
    p.Rating,
    p.ReviewDate
FROM Employee e
JOIN Department d ON e.DeptID = d.DeptID
LEFT JOIN Performance p ON e.EmpID = p.EmpID;

-- Test the view
SELECT * FROM EmployeePerformanceView;

-- 2. Create a stored procedure to get top 3 performers by department
DELIMITER //

CREATE PROCEDURE GetTopPerformers(IN deptName VARCHAR(50))
BEGIN
    SELECT 
        e.EmpName,
        d.DeptName,
        p.Rating,
        p.ReviewDate
    FROM Employee e
    JOIN Department d ON e.DeptID = d.DeptID
    JOIN Performance p ON e.EmpID = p.EmpID
    WHERE d.DeptName = deptName
    ORDER BY p.Rating DESC
    LIMIT 3;
END //

DELIMITER ;

-- Test the stored procedure
CALL GetTopPerformers('IT');