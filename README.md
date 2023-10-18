Clash of Clans stream HUD which displays clan wars stats

Written in Typescript and React

### How to set up
Download the repository, go to Clash of Clans Developer Portal where you have to sign up or log in and get the API Key. https://developer.clashofclans.com/#/
When you get the API Key go to `./src/config.json` and put that key in the `" "`. After that run the following in terminal

    npm i

When everything is being downloaded split the terminal and do the following

#### First terminal

    npm start

This will start the react app

#### Second terminal

    npx ts-node proxy/server.mjs

This will start the backend server

### Finally

Now when both react app and server are running the website will automatically open, if it doesn't open head to that url http://localhost:3000 and have fun


Idea from [Lexogrine](https://github.com/lexogrine)
