---
layout: cv
title: Kenneth Christensen CV
---
# Kenneth Christensen
Functional, Fullstack developer, open source enthusiast helping businesses win

<div id="webaddress">
  <a href="mailto:kenneth@root.dk">kenneth@root.dk</a>
  | <a href="tel:+4540539749">+4540539749</a>
  | <a href="root.dk">www.root.dk</a>
  | <a href="github.com/rootkc">Github</a>
</div>


## About

Solving business problems and creating customer value with software. Using functional programming and test automation. Prefer a people over processes approach to working agile. Shipping quality software with the power of TDD, automation and functional programming.

### Interests

Photography, Mountainbiking, BMX, Startups and cool open source technologies.

## Education

`2013 - 2017`
__University of Copenhagen__

- Bachelor's degree, Computer Science

## Projects

`May 2020 - current`
__Multiple repos to mono repo with CI__ 

Migrating from multiple typescript repositories to mono repository with lerna. CI with CircleCi and code coverage tracking using CodeCov

The project consists of multiple app repositories (micro frontends), infrastructure and test automation packages.

`Feb 2020 - May 2020`
__Infrastructure and DevOps for streaming web app__ 

Infrastructure build with AWS CDK using S3, Cloudfront, Cloudwatch, lambda@edge, lambda, iam, secretsmanager, ssm and more.

App is utilizing micro frontends so it has support for redirecting to the correct app bucket using lambda@edge. 

Everything is build with Typescript and tested with Jest.

The infrastructure and the apps is deployed and tested on CircleCi.

`Jun 2019 - May 2020`
__System for collecting royalties on TV ads__ 

A app built using Elixir and Phoenix. Were rightsholders can upload their music. Which then will be matched against Tv ads from a 3. part API.

Fingeprinting algorithm for matching music on ads where this is alot of noise like voice over. Supports multiple types of fingerprints for higher precision.
Matching is done using Annoy from spotify. Built with Python, Numpy, Dask. 

The whole system is running and deployed using Docker and docker-compose and deployed to AWS with AWS CDK. CI and test automation running on CircleCi.

`Jun 2019 - Oct 2019`
__Javascript UI library for Spark browser__ 

A JavaScript library for building user interfaces on top of the Spark browser. It's using an Elm'ish Architecture to build modular, testable and scalable applications. It utilizes the power of yoga-layout to use flexbox and absolute positioning from css for positioning elements. For handling state it uses redux along with function closures. It's built using Typescript, Redux, yoga-layout and Jest.

<a href="github.com/YouSee/YogaSpark">Github</a>

`Sep 2018 - Feb 2019`
__Open source cryptocurrency trading bot__ 

An event-driven open source cryptocurrency trading bot built using Node.js and RxJS. With a frontend built using React and d3. The project was built using TDD.

<a href="https://github.com/openbot-tech/">Github</a>

`Sep 2018 - Feb 2019`
__Open source player implementation__ 

Migrating away from an outdated proprietary player to DashJS which is an open source player. The player supports Live, Catch-up and VOD manifests. Catch-up wasn't supported out of the box, so that had to be implemented. The player was implemented with React, RxJS and Redux using an elm like architecture.


`Jun 2018 - Oct 2018`
__Art magazine website and admin backend__ 

A website built using Elm communicating with a REST API built using Elixir and Phoenix including a admin interface in pure Elixir and Phoenix. Mailchimp and Hubspot was integrated for mail lists and CRM.


`Sep 2017 - Mar 2018`
__Whitelabel of existing streaming platform__ 

Aligning colors, fonts and other assets to support multiple brands for a large React based application. Rewriting parts of the app from Backbone to Redux in order support the new theme system.


`Jun 2017 - Oct 2017`
__new Chromecast receiver app for YouSee__ 

A React Chromecast receiver app built with the Google Cast Application framework (CAF). Supporting playback of Live, Catch-up and VOD content. Including binge watching for VOD series. It supports multiple themes for different brands.


`Jan 2017 - Jun 2017`
__Website, App and backend for insurance startup__ 

Landing page built using React, HTML5 and CSS3. An App built with React Native using Firebase as a backend. Which gives the customer possibility to insurance belongings by taking a picture uploading it and paying in the app.


`Mar 2017 - May 2017`
__Web crawler for collecting auto parts__ 

An Elixir app for crawling different websites and collect auto parts, it uses Selenium for automating the browser. The result is returned in a .csv file.


`Mar 2016 - Apr 2016`
__Website for restaurant__ 

Website built using React, HTML5 and CSS3 for a new restaurant.


`Nov 2016 - May 2017`
__Reminding app for iOS and Android__ 

An app made for making videos for your loved ones, that will be released when you aren't here anymore. The app is made with React Native and optimized for iOS and Android, using Firebase as a backend.


`Oct 2016 - Feb 2017`
__Wine sales app, backend and invoice system__ 

Building an app for selling wines in restaurants with a login system for members. The app is build in React Native for iOS with a Node.js server.

In the backend it's possible to create new members and wines for the corresponding members. All history from the app is also accesible. The backend is built in React.

The invoice system is build as a Node.js application creating invoices using PhamtomJS


`Nov 2015 - Juli 2018`
__Web scraper for Copenhagen Capacity__ 

Using Python to scrape companies for jobs based in Denmark. Using HTTP requests and Selenium for AJAX heavy websites or websites with pagination or similar functionality that's too complex for HTTP requests.


`Oct 2014 - Apr 2018`
__Housing association platform__ 

Create a platform that streamlines the board of the housing association job with PHP, MySQL and Bootstrap. This includes a blog for news, a file system for uploading files for public and board only, email system to communicate with the residents in different groups and the possibility to edit the house rules.

## Technologies

### Programming languages

- Typescript
- Javascript
- Python
- Elixir
- Elm
- SQL

### Frontend technologies

- React
- React Native
- Redux
- Elm architecture
- RxJS
- WebPack

### Backend technologies

- Phoenix framework
- NodeJS
- Lambda (AWS)
- Postgres
- Redis
- Elaticsearch

### Testing technologies

- Selenium
- Puppeteer
- Jest
- ExUnit

### DevOps

- AWS
- AWS CDK
- Docker
- Docker compose
- CircleCI
- GitHub
- CodeCov
- Coveralls
- Firebase
- Heroku
- git

## methodologies

### Programming

- TDD (test driven development)
- DDD (domain driven development)

### Software development 

- Agile
- Lean
- Scrum
- Kanban
- Cross functional squads

### Testing

- Unit testing
- Component testing
- E2E testing
