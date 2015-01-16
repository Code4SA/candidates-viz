anic-candidates
===============

Visualisation of candidates age and gender from 2009 elections 

Development
============

Ensure that a coffee-script interpretor is running on your system. Supposedly 

```
sudo npm install -g coffee-script
```

is meant to install one but that didn't work for me. Instead I ran

```
sudo apt-get install coffeescript
```

Deployment
==========

Deploy via GitHub pages by pushing to the gh-pages branch.

The `parser/parties.json` file MUST be served from the S3 bucket `code4sa.org/candidates.code4sa.org/parties.json` so that it
gets the correct CORS headers.
