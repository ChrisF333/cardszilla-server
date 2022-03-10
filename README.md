# Ironhack-Project3-Cardszilla-
<div id="top"></div>
<!-- PROJECT LOGO -->
<br />
<div align="center">
 <!-- <a href="https://github.com/DomKal11/Project2-cardspedia/">
    <img src="main/Assets/Images/Others/our_host.png" alt="Logo" width="80" height="80"> -->
  </a>

<h3 align="center">Cardszilla</h3>

  <p align="center">
    A full stack application designed for Project Three of the Ironhack bootcamp
    <br />
    <a href="https://github.com/ChrisF333/cardszilla-server"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://cardszilla.herokuapp.com/">View Demo</a>
    ·
    <a href="https://github.com/ChrisF333/cardszilla-server/issues">Report Bug</a>
  </p>
</div>


<!-- ABOUT THE PROJECT -->
### Description 
Cardszilla is a website for card club managers to store and administer their club details.

Managers can add members, keep track of events and record win/loss stats.

<!--USER STORIES-->
### User Stories

Personas:<br />
<b>Chris:</b> – an overzealous card club manager who thinks people appreciate his attention to detail in preserving the club record 
<br />
<b>John:</b> A card club member. Thinks Chris is a bit nuts but appreciates the ability to easily check the club record/leaderboard
<br />

Stories:<br />
As a viewer, I want to know what cardszilla is when I arrive on the site<br />
As a club manager, I want to signup for an account<br />
As a club manager, I want to create a club<br />
As a club manager, I want to add/remove members to a club<br />
As a club manager, I want to add/remove events to a club<br />
As a club manager, I want to easily track win and loss stats for members<br />
As a club manager, I want to edit the club details<br />
As a club manager, I want to edit my account details<br />
As a member, I want to view the club page and see recent events</br>

<!--TECHNOLOGIES USED-->
### Technologies used

* [Node.js](https://nodejs.org/)
* [npm](https://www.npmjs.com/")
* [HTML 5](http://www.html5.com/)
* [CSS](https://www.w3schools.com/w3css/defaulT.asp)


<!--MODELS-->
### Models

* User - a user has a name, encrypted password, birthdate, about/description, picture and a list of favourites and created games. A user also has an admin flag.
* Club - a club has a name and various ids for it's members, record and games
* Member - a member of a club has a name, nickname and win/loss record
* Record - every club has a record which is an erray of events
* Game - a static list of card games from which a club administrator cam choose from

All models have timsetamps to enable createdAt and updatedAt properties


<!--SERVER ROUTES-->
### Server routes

| Method | Route                              | Description                                                                                   |
|--------|------------------------------------|-----------------------------------------------------------------------------------------------|
| GET    | /signup                            | renders the signup form                                                                       |
| POST   | /signup                            | creates a new user                                                                            |
| GET    | /login                             | renders the login form                                                                        |
| POST   | /login                             | logs the user in or refuses access                                                            |
| GET    | /home                              | renders the home page with clubs the user owns                                                |
| GET    | /clubDetails/:id                   | fetches the club details                                                                      |
| PUT    | /clubDetails/:id                   | updates the club details                                                                      |
| DELETE | /clubDetails/:id                   | deletes a club                                                                                |
| POST   | /createMember                      | creates a member and adds them to a club                                                      |
| POST   | /createEvent                       | creates an event and adds it to a club, updates win/loss for participants                     |
| DELETE | /member/:id                        | deletes a member and adds them to a club                                                      |
| DELETE | /event/:id                         | deletes an event                                                                              |
| PUT    | /user/:id                          | updates a user                                                                                |
| DELETE | /user/:id                          | deletes a user                                                                                |
| GET    | /                                  | renders the landing page                                                                      |
| GET    | /games                             | fetches the games                                                                             |
| GET    | /getRecordCard                     | fetches most recent events                                                                    |
| GET    | /getMembers                        | fetches the club members                                                                      |


<!--Project Link-->
### Link to project
<a href="https://cardszilla.herokuapp.com/">Cardspedia</a>


<!--Future Work-->

### Future Work
* Additional routes to enable member leaderboards 


<!--RESOURCES-->
### Resources
* <a href="https://www.npmjs.com/">npm</a>
* <a href="https://stackoverflow.com/">Stack Overflow</a>


<!--TEAM MEMBERS-->
### Team members
* Chris Fagg

<!-- ACKNOWLEDGMENTS -->
### Acknowledgments

* [Ironhack](https://www.ironhack.com/en)

<p align="right">(<a href="#top">back to top</a>)</p>

