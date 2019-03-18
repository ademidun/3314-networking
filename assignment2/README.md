# 3314b Networking Assignment 2

## Server + Client


Run server: `node Server/ImageDB.js`
Run client: `node GetImage.js -s 127.0.0.1:3000 -q swan.jpg -v 4`

## p2p Networking

Implement p2p networking by creating peer nodes
which are a combination of the client and server.

Run peer 1: `cd Server ; node peer`
Run peer 4 (p4): `cd Server ; node peer -i 4 -n 2 -p 127.0.0.1:3000 -v 3314`
