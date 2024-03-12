# grapple-template


## getting started

### dev mode
    skaffold dev --port-forward 

> [!TIP]
> skaffold dev --port-forward --default-repo=${YOUR_DOCKER_USERNAME} 
> (add --default-repo=${YOUR_DOCKER_USERNAME} if not running locally)
> ${YOUR_DOCKER_USERNAME} = e.g. grpl from grpl/app:latest (user name in docker hub) - a docker user name where you have permissions to write

> [!NOTE]
> further information about skaffold:
> https://skaffold.dev/docs/quickstart/


## working with the front-end application

### run the application locally
    pnpm i 
    pnpm start

> [!TIP]
> run:
> npm install -g pnpm
> (if pnpm is not installed yet)


### build and run using docker
docker build -t grapple-template .
docker run --rm -p 8080:80 grapple-template

then open:
http://localhost:8080


### build and run using docker-compose




### build and run using skaffold (locally)
minikube start
skaffold dev --port-forward

> [!TIP]
> a message in the log with the port-forward appears:
> *Port forwarding service/myapp in namespace default, remote port 80 -> http://127.0.0.1:4503*


### build and run using skaffold (in a remote cluster)
skaffold dev --default-repo=${YOUR_DOCKER_USERNAME} 

> [!TIP]
> ${YOUR_DOCKER_USERNAME} = e.g. grpl from grpl/app:latest (user name in docker hub) - a docker user name where you have permissions to write

## folder structure

    .               -> application base directory
    ├── src             -> application src directory
        ├── index.html       -> 
        ├── index.ts         -> 
        ├── App.svelte       -> 


## environment variables

APP: define the name of the APP
NAMESPACE: define a namespace extension to the deplyoment

SKAFFOLD_CACHE_ARTIFACTS: "false" - to disable cached artifacts
