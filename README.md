1. Clone git repository.

2. Run server or longPolling service.
    - Go to "longPolling" folder
    - Open terminal
    - To install dependency run "npm i"
    - Start node application
        - For development environment run "npm run start:dev"
        - For production environment run "npm run start:prod"
    - The application will run on port 8088 for dev or 8000 for prod respectively

3. Run clientApp service
    - Go to "clientApp" folder
    - Open terminal
    - To install dependency run "npm i"
    - Start node application
        - For development environment run "npm run start:dev"
        - For production environment run "npm run start:prod"

4. You can run multiple instance of clientApp. Once the client app starts it wait for response for server.

5. To submit a message either use terminal or postman and run the below curl request. (Note: Please change the port if you run on production env)
      curl --location --request POST 'http://127.0.0.1:8088/api/long-poll/message' \
      --header 'Content-Type: application/json' \
      --data-raw '{
          "from": "Chandesh",
          "message": "Hi, There!!!"
      }'

  OR

  Open the below URL in the browser. You can run multiple instance accross browser.(Note: Please change the port if you run on production env)
      http://127.0.0.1:8088/api/poll-page

