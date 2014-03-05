Google Drive
===============================

**Problem**

We want to interact with a secured service, like Google Drive, that uses OAuth2 Authorization

**Solution**

This purpose of this repo is to show how to use the OAuth2 adapter in AeroGear.js and how it integrates into Pipeline

Basically, it will ask for your permission for this app to access your google drive account and then list the files you have

**Working Code Example**
To run the example code, first run:

    $ bower install

This will pull down the dependent javascript/css files, such as jquery, into the project.

You need to have Client ID and credentials with permissions to access Google Drive. You can get one by following these steps:

1. Be sure to also have a Google Account since we are going to access Google Drive
2. Open Google Console at https://cloud.google.com/console#/project
3. Create new project
4. In APIs & auth / APIs enable Drive API
5. In APIs & auth / Credentials create New Client ID
6. Make sure you white list http://localhost:9000 in JavaScript origins and you put http://localhost:9000/redirector.html into Redirects URIs

Then modify app/scripts/main.js authz object to contain client ID generated for you.

One option is to run a python 'SimpleHTTPServer'

    $ python -m SimpleHTTPServer

Now the page can be accessed at [localhost:8000](http://localhost:8000/)



