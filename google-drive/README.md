## AeroGear.js OAuth2 Test - Access Google Drive

This purpose of this repo is to show how to use the OAuth2 adapter in AeroGear.js and how it integrates into Pipeline

Basically, it will ask for your permission for this app to access your google drive account and then list the files you have

You need to have Client ID and credentials with permissions to access Google Drive. You can get one by following these steps:

1. Be sure to also have a Google Account since we are going to access Google Drive
2. Open Google Console at https://cloud.google.com/console#/project
3. Create new project
4. In APIs & auth / APIs enable Drive API
5. In APIs & auth / Credentials create New Client ID
6. Make sure you white list http://localhost:9000 in JavaScript origins and you put http://localhost:9000/redirector.html into Redirects URIs

After cloning the repo, run:

    $ npm install && bower install

Then modify app/scripts/main.js authz object to contain client ID generated for you.   

Then

    $ grunt server

The web app will then be available at [localhost:9000](http://localhost:9000)


_Warning: There will be bugs  :)_
