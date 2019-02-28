# Kotlin MCU Sample Application Server for Open WebRTC Toolkit 

This is a Kotlin MCU sample application server project for [Open WebRTC Toolkit](https://github.com/open-webrtc-toolkit).
It is based on [the MCU sample application server](https://software.intel.com/sites/products/documentation/webrtc/conference/index.html#Conferencesection4) for [Intel CS for WebRTC](https://software.intel.com/en-us/webrtc-sdk).

The original MCU sample application server is written in Node.js but this project is using Kotlin.
Since Kotlin is getting popular for developing server-side lately for [some reasons](https://hashnode.com/post/why-would-you-use-kotlin-instead-of-nodejs-for-server-side-programming-cj317v8kb00doink9u7nodtm8).

It is using [Ktor](https://ktor.io/) Framework.


## Building and running the Docker image
 
 Build an applicatio package:
 
 ```bash
./gradlew build
```

Build and tag an image:

```bash
docker build -t oms-server-ktor-sample
```

## Pushing docker image

```bash
docker tag oms-server-ktor-sample hub.example.com/docker/registry/tag
docker push hub.example.com/docker/registry/tag
```

## Helm Chart

This Helm chart can be used to install a Kotlin MCU sample application server on a Kubernetes cluster.

Refer [here](https://github.com/thmatuza/ics-kubernetes) for detail.