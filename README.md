# slyce-app

Application for a professional athlete hosting a Question & Answer session with fans.

#####How is this project developed ?

    1. Developed on MEAN Stack.
      a. MongoDB version 3.0.7
      b. Express API version 4.13
      c. AngularJS version 1.4.6
    2. IDE used is IntelliJ.
    3. Testing framework used is Mocha.

#####Directions to launch the server

    1. Install and Configure MongoDB from <a href=https://docs.mongodb.org/manual/tutorial/install-mongodb-on-windows/>here</a>.
    2. Install and Configure Node.js from <a href=https://nodejs.org/en/download/>here</a>.
    3. Download the reporsitory.
    4. You can run the application in 2 ways:-
      a. Command Line:-
            cd ~/slyce-app/bin
            node www
      b. ItelliJ IDE:-
            Import the project into IntelliJ.
            Run the application
            Repository contains all the dependecies. 
    5. Once the server is started, please go to any browser and type "http://localhost:3000/"


#####How does the app works?

    1. Create Q & A Session
      a. Input: Host, Start Time and End Time.
      b. Output: Session Id
    2. Get Q & A Session
      a. Input: Session Id
      b. Ouput: Session Model (Host, Start Time, End Time & Session Id)
    3. Ask A Question
      a. Input: Session Id, Question, Name of the Person Posting Question
      b. Output: 
          Question Id - On Valid Session Id
          Error Message - On In-valid Session Id
    4. Answer A Question
      a. Input: Question Id, Answer Text, Image Url, Name of the Person Answering.
      b. Output: 
          "Answer Posted Sucessfully" - On Valid Session Id
          Error Message - On In-valid Question Id
    5. Get All Questions
      a. Input: Session Id
      b. Output:
          JSON Array with JSON object's of structure {QuestionId, hasAnswer(way to filter), Answer, Image_Url, Asked_By, Answered_By}
          Error Message - On In-valid Session Id




