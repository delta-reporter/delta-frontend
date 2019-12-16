# Delta Reporter WebSockets Service

This service is in charge to manage all the WebSockets communication displayed at Delta Reporter

This service is designed to be deployed on AWS, GCP or Azure using Serverless framework

## Local development

To develop locally, create a virtual environment and install your dependencies:

```
npm install -g serverless
pip install virtualenv
virtualenv venv --python=python3
source venv/bin/activate
pip install -r requirements.txt
```

Then, run your app:

```
sls wsgi serve
 * Running on http://localhost:5000/ (Press CTRL+C to quit)
 * Restarting with stat
 * Debugger is active!
```

Navigate to [localhost:5000](http://localhost:5000) to see your app running locally.
