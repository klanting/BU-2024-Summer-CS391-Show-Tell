# Gradeculator | Show&Tell
This Project is a project for the course
CS 391 at Boston University Summer Term 2 2024.

This Project is done for the 'Show & Tell' extra credit.

This project uses flume, you can install flume using
```shell
npm install flume
```

## Important observations
- ``<NodeEditor/>`` Takes up the entire space, so it is recommended to put it in a div with a defined width and height
- You have not much freedom/customization options
- Give each node type each own file, because the code can become long

## List of port types
- Grade (Object containing grade information)
- Integer (Positive)
- Percentage (between 0 and 100)

## List of node Types
- GradeCreator
    - This node let the user create a grade object
    - Inputs
        - Bool Known
        - String (evaluation name)
        - score (Integer) (if known)
        - total (Integer)
    - Outputs
        - grade (Object)
      
- Weighted Sum:
    - This node let the user take a weighted sum of the grades
    - Inputs
        - total points obtainable for the grade (integer) 
        - grade 1 (Object)
        - weight 1 (percentage)
        - ...
        - grade n (Object)
        - weight n (percentage)
    - Outputs
        - grade (Object)
      
- Sum:
  - Take a sum of the grades
  - Inputs
    - grade 1 (Object)
    - ...
    - grade n (Object)
  - Outputs
    - grade (Object)
    
- Total Converter:
  - Convert the total amount of points for a grade to another total, while keeping the same percentage
  - Inputs
    - grade (Object)
  - Outputs
    - grade (Object)
    
- Required Grades
    - Require that the grade is higher than the minimum else give it an else grade
    - Inputs
        - Grade (Object)
        - Minimum (percentage)
        - Else Max grade (Object)
      
- Integer Arithmetic
  - Node to do arithmetic with integers
  - Inputs
    - Integer (Integer)
    - Integer (Integer)
    - Operation (String)
  - Outputs
    - Integer (Integer)
    
- Constant
  - A way to create constant integer/percentage
  - Inputs
    - constantTYpe (decide which type the constant has)
    - integer/percentage depending on constantType
  - Outputs
    - integer/percentage depending on constantType
    
- Percentage To Integer
  - Converts a percentage to an integer (rounding will occur)
  - Inputs
    - Percentage (Percentage)
  - Outputs
    - Integer (Integer)

- Integer To percentage
    - Converts an integer to a percentage
    - Inputs
        - Integer (Integer)
    - Outputs
        - Percentage (Percentage)