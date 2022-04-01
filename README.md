# Scraping Instagram 

This project automate the process to update recent media information to a commerce using instagram posts for use of page web

- [Overview](#overview)
- [Dependencies](#dependencies)
- [Instalation](#instalation)
- [Requirements](#requirements)
- [Configuration](#configuration)
- [Running](#running)
- [Comments](#comments)
- [Features](#features)

## Dependencies

- **[Node.js e NPM](https://www.nodejs.org/)** (suportadas versões: 10.x.x)
- **[Mysql](https://www.mysql.com/)**

## Instalation
if you install this project on AWS EC2 (for example) you need make this steps:

### Git
```bash
  sudo apt-get install git-all
```

### Crominium
1. na raiz do projeto, vá até cd ./node_modules/puppeteer
```bash
$ cd ./node_modules/puppeteer
```

2. instale todas as dependências dele
```bash
$ npm run install
```

3. caso necessário, instale todas as dependências necessárias no Debian para execução do navegador (Chromium)
```bash
$ sudo apt-get install gconf-service libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libgbm-dev libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget
```

### Install PM2

#### One way: Curl Method
```bash
apt update && apt install sudo curl && curl -sL https://raw.githubusercontent.com/Unitech/pm2/master/packager/setup.deb.sh | sudo -E bash -
```

#### Two way yarn or npm:
```bash
npm install pm2 -g
```

#### Install auto complete of PM2
```bash
pm2 completion install
```

#### Update PM2
```bash
npm install pm2 -g && pm2 update
```

## Requirements

1. instagram perfil need to public
2. you need create database to use, and include this in configuration of `.env`

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
2. if AWS EC2 not run `build`, execute this commands:
```bash
$ sudo /bin/dd if=/dev/zero of=/var/swap.1 bs=1M count=1024
```

```bash
$ sudo /sbin/mkswap /var/swap.1
```

```bash
$ sudo /sbin/swapon /var/swap.1
```

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
- [ ] Add Swagger docs
- [ ] Create routine with cron to scraping instagram information without heroku clock
- [x] Deploy on Heroku 
- [ ] Deploy in Amazon EC2