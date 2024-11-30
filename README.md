
## Database:
This application uses SQLite for the backend database. Ensure that the database schema is set up before running the application. You can create and manage the database using SQL commands and the SQLite CLI.
* Navigate to database directory: ```cd <repo-folder>/data```
* You can open the database file using the SQLite command-line tool: ```sqlite3 repertoire-report.db```
* Or double-click on file named ```./data/repertoire-report.db``` and make connection manually on IDEA
* To ensure the CASCADE DELETE works run: ```PRAGMA foreign_keys = 1;```

## Backend:

The backend is built with Node.js using the Express framework and SQLite as the database.

* Navigate to backend directory: ```cd <repo-folder>/server```
* Install dependencies: ```npm install```
* Start the server in development mode: ```npm run dev```

The server will start and listen on the specified port http://localhost:8081


## Frontend:
* Navigate to frontend directory: ```cd <repo-folder>/client```
* Install dependencies: ```npm install```
* Start the development server: ```npm run dev```

The application will be available at http://localhost:3001

Helping material: 
https://chatgpt.com/share/674a8afe-4bc4-800f-b37c-71bdbe0eec50