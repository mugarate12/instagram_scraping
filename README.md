# Scraping Instagram 

This project automate the process to update recent media information to a commerce using instagram posts for use of page web

- [Overview](#overview)
- [Dependencies](#dependencies)
- [Requirements](#requirements)
- [Configuration](#configuration)
- [Running](#running)
- [Comments](#comments)
- [Features](#features)

## Dependencies

- **[Node.js e NPM](https://www.nodejs.org/)** (suportadas versões: 10.x.x)
- **[Mysql](https://www.mysql.com/)**

## Requirements

1. instagram perfil need to public

## Configuration
1. put informations to instagram account used to login and scraping posts content in `.env` like a `.env.example`
2. if you deploy using Heroku as needed add buildpack `https://github.com/jontewks/puppeteer-heroku-buildpack`

## Running

1. install all dependencies with `npm i`
2. run 
```bash
$ npm run dev
```

## Comments
1. if you want run this project in heroku, watch this problem: if you use `free dyno`, you get a wrong result. `heroku free dyno` hibernate and stop your clock process, so not run routine of scraping a instagram page.

## Features

- [x] Automated tests
- [x] Scraping instagram page of a public perfil and get 9 recent posts image source and page ref
- [x] Login on pseudoInstagram
- [x] Get content of each post
- [x] Convert and save this in database
- [x] Save link of image and content of post in database
- [x] Create route to get all information of 9 recent posts
- [x] Configure Heroku Clock 
- [x] Schedule scraping of instagram every ten minutes
- [ ] Create routine with cron to scraping instagram information without heroku clock
- [x] Deploy on Heroku 
- [ ] Deploy in Amazon EC2