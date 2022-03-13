# Scraping Instagram 

This project automate the process to update recent media information to a commerce using instagram posts for use of page web

- [Overview](#overview)
- [Dependencies](#dependencies)
- [Requirements](#requirements)
- [Configuration](#configuration)
- [Running](#running)
- [Features](#features)

## Dependencies

- **[Node.js e NPM](https://www.nodejs.org/)** (suportadas versões: 10.x.x)
- **[Mysql](https://www.mysql.com/)**

## Requirements

1. instagram perfil need to public

## Configuration
1. put informations to instagram account used to login and scraping posts content in `.env` like a `.env.example`

## Running

1. install all dependencies with `npm i`
2. run 
```bash
$ npm run dev
```

## Features

- [ ] Automated tests
- [x] Scraping instagram page of a public perfil and get 9 recent posts image source and page ref
- [x] Login on pseudoInstagram
- [x] Get content of each post
- [x] Convert and save this in database
- [x] Save link of image and content of post in database
- [x] Create route to get all information of 9 recent posts
- [x] Configure Heroku Clock 
- [ ] Schedule scraping of instagram to once of day
- [x] Deploy on Heroku