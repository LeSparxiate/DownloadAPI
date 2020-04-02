# DownloadAPI

Simple download API

# Setup

npm install

Don't forget to change DB information in ./DAL/config.js

You can find a simple DB Schema (MySQL) inside ./DatabaseSchema/

You can also change the API port -> ./index.js l.4 (default is 80)

# Run

node index.js

# Access

Endpoints :

> GET - localhost/download/123456

> GET - localhost/download/page/1

> GET - localhost/download/qr/123456

> GET - localhost/delete/123456

> POST - localhost/upload

Body type : form-data
* Parameter :
  * file : yourfile.txt

# Reminder

This is and will remain a Small NAS API example.

Feel free to customize it.
