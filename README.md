This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app). Please see that documentation for more information on common project tasks.

# Running Locally

Running locally requires a copy of the [pi-base server](https://github.com/pi-base/server). The easiest way to set this up is using the provided `docker-compose.yml` file:

* Install [docker and docker-compose](https://docs.docker.com/engine/installation/)
* Copy `.env.server.example` to `.env.server` and change the values as needed
* Run `docker-compose up`

Once everything has finished building (which may take a while on first load), you should be able to access the viewer at `localhost:3000`.

See the `docker-compose.yml` file for the specifics of what is running and options for configuring. Of particular note:

* You can control the server log settings by adjusting the various `LOG_` variables.
* Suggested directory structure is

    pi-base
    ├── data
    ├── server # if desired
    └── viewer

* By default, we mount the `../data` directory inside the server container and store the data repository there. You can adjust where that data is located by mounting a different directory in the container at `/data` (or remove the mount).
