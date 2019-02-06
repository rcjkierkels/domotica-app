[![HitCount](http://hits.dwyl.io/rcjkierkels/domotica-app.svg)](http://hits.dwyl.io/rcjkierkels/domotica-app)
[![Known Vulnerabilities](https://snyk.io/test/github/rcjkierkels/domotica-app/badge.svg?targetFile=package.json)](https://snyk.io/test/github/rcjkierkels/domotica-app?targetFile=package.json)
[![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/dwyl/esta/issues)

# Domotica app

![Schematic](https://roland.kierkels.net/wp-content/uploads/2019/02/domotica-diagram-1.png)

In the above diagram you control the domotica by using an Ionic webapp on your smartphone. It can be installed as any regular native app but it’s entirely written in Typescript/javascript using Angular4 and the Ionic UI toolkit. The app communicates with the [domotica server](https://github.com/rcjkierkels/domotica-server) (Laravel framework) using a Json Rest API with OAuth2 (Passport) for authentication. The domotica server again communicates (for now) with it [clients](https://github.com/rcjkierkels/domotica-client) through a Mysql database. Of course this will be changed in the future to an API so that we have more access control and are being able to use queuing services, caching etc. For my small project it works fine. Remember it’s all still a very early work-in-progress.

More info: https://roland.kierkels.net/2019/02/selfmade-domotica-system/

# Requirements
* Ionic 4
* Angular 4
* NodeJS >10

# Security
If you discover any security related issues, please email roland.kierkels@noveesoft.com instead of using the issue tracker.

# License
This application is open-source software licensed under the MIT license.
