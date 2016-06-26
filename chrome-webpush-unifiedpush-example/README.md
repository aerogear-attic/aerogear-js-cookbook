Chrome Push API with AeroGear Unified Push Example
==================================================

This sample is based on two articles from Google:

* [Your first push notifications web app](https://developers.google.com/web/fundamentals/getting-started/push-notifications/)
* [Push Notifications on the Open Web](https://developers.google.com/web/updates/2015/03/push-notifications-on-the-open-web)

We suggest to read them both for better understanding of Push API, Service Worker and how it works in Google Chrome.

### Demo

This video provides additional explanations and shows how it works in reality:

[![Chrome Push API with AeroGear Unified Push Demo](https://img.youtube.com/vi/o6FdbJm-47Y/0.jpg)](https://www.youtube.com/watch?v=o6FdbJm-47Y)

## Getting started!

#### Prerequisites

* Chrome 42+
* AeroGear UnifiedPush server

To make it workable you have to complete two steps:

1. Set up your FCM/GCM Sender ID in manifest.json
2. Set up Variant-ID, Variant-Secret and URL for your AeroGear UnifiedPush Server instance in main.js

For this sample you will need to run a local web server. You may already have your own setup for this. Otherwise open a terminal window, navigate to the current directory and run the following Python command to start a server:

```
python -m SimpleHTTPServer
```

This will start a web server on the default HTTP port. Open [http://localhost:8000](http://localhost:8000) from your Google Chrome to see the main page.
