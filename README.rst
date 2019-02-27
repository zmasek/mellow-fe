======
Mellow
======

This repository holds the front-end code for the Mellow service. It is deployed to Netlify with each push. To run it locally, use your own server like for example::

    python -m SimpleHTTPServer

`Mellow <https://mellow.offsetlab.net/>`_ service takes Trello JSON export and converts it to a MM file for Coggle. The back-end is in `mellow-faas <https://bitbucket.org/zmasek/mellow-faas/>` repository that is served with AWS Lambda.
