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
  - Outputs
- Required Sub Grades
    - This object can set required grades for sub-grades, (ex. on both the project and the exam someone need to pass else the person would receive a grade of 20%)
    - Inputs
        - Grade 1 (Object)
        - Minimum 1 (percentage)
        - ...
        - Grade n (Object)
        - Minimum n (percentage)
        - Else grade (Object)
- Constants