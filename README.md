## It Takes a Village

It Takes a Village is a single-page social networking platform built in React that allows users to volunteer their time and treasure in an effort to help an underserved community member reshape his or her life through financial patronage and social interaction through group sponsorship.


### Installation

Along with the It Takes a Village repository, you will need to clone the ItTakesAVillage-API repo as well which contains the data structure and some dummy data for you to access the site.

You will need json-server installed in order to create the persistant data storage.

To start the json server, run the following command in your terminal inside of the ItTakesAVillage-api directory:

```
json-server -p 8088 -w database.json
```

To start the application, run the following command in your terminal inside of the ItTakesAVillage directory:

```
npm start
```


### Dummy User Data

Login with the following dummy user data to view a user that is a patron of a village (Terry Smith's village):

Email Adress: mecarrolljr@example.com

Password: 123

Login with the following dummy user data to view a user that is a protege of the same village (Terry Smith's village):

Email Adress: terrysmith@example.com

Password: 123

If you would like to test the email updates for changed RSVP'd events, you must:
1) 'Register' an account with an email that you have access to
2) Join the village that belongs to Terry Smith and either A) create and join an event or B) join an existing event
3) Log out as your current user, and then log back in as Terry Smith (email address and password listed above)
4) Navigate to Terry Smith's village and change the event your account has RSVP'd
5) Check your email

This feature will not be viable with the current dummy data, as the data does not contain working email addresses.


### Technologies Used

[React](https://reactjs.org/)

[React-Boostrap](https://react-bootstrap.github.io/) for styling

[date-fns](https://date-fns.org/) library for date manipulation

[React Big Calendar](https://npmjs.com/package/react-big-calendar) to organize and display village events

[nivo](https://nivo.rocks/) to display village budgets and budgetary pledges

[Email Js](https://emailjs.com/)to notify users when event details have been changed after RSVP'ing for an event

[dbdiagram.io](https://dbdiagram.io/home) for planning the data structure

[Sketchboard.me](https://sketchboard.me/home) for wireframing
