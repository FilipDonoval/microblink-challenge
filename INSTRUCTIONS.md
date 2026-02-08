# What I did
First i created directory for the frontend
I created multi-stage docker build that builds react copies needed files to nginx for serving and managing api calls.
I used React with Material UI for the web ui so I can complete the problem faster and focus on implementation of the problem rather then reinventing commonly used componnents.

For llm security report i made another docker container that is running python with flask and i using Google Gemini api for the llm. 
I then modified orchestrator to add a funcion which calls the api I made which calls Google Gemini api.

For private repo scanning i modified the orchestrator to take one more key-value pair token and then if token is there it modifes the url to include token so it can scan the private repo


# How to test it
build with docker docker-compose up --build
health can be checked with curl http://localhost:8000/health
scan can be done with 
curl -X POST http://localhost:8000/scan-repo \
  -H "Content-Type: application/json" \
  -d '{"repo_url": "https://github.com/user/repo.git"}'

web ui is on link http://127.0.0.1:3000/
