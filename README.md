# Watchout
Wanted an App to remind me of the series episodes that are getting released and wanted to learn ionic framework. So created this app with it.
>Ionic APP powered by TheMovieDB API.

# Problem statement:
Wanted to develop a mobile app to keep on track in watching the series that I am watching. Wanted to learn the talk of the town mobile framework, ionic. A little elaboration on the problem statement. There are a lot of television series which have their seasons released on regular intervals. As I used to watch more than one television series and each of them gets released on a different time-lines and hence I tend to miss one ore more of the interesting series. Of course I googled about the apps that are available to do this, but there were all charging for the most essential 'alert me' functionality. Thus wanted to learn as well as full fill my necessity of getting on track I built the solution.
# Solution:
The solution is an ionic based android application that lets you choose your favorite movie and TV genres and suggests you with the upcoming and popular moves/shows available. You can favorite a move/show. You can view all the seasons and episodes/s details in the app and you can favorite each one of them. You can choose to get an alert for all those episodes that are yet to be aired. I've taken the UI and feature references from this app(which has the alerts feature as a paid one).
# High level flow:
 ![Block diagram](https://file.ac/dbxWNYsHJrk/image0.png)

# Challenges:
Well, being a web developer new to ionic without even having any idea about what ionic/angular is , is really a big challenge. At the end of knowing angular(with my MEAN stack experiment bookworms) I felt it would have been better to have started with angular instead of ionic. Anyhow the purpose of watchout has been fulfilled after this project. Ionic being a more sophisticated framework built by combing cordova and angular, it was tiring with the states, routes and services that were swirling around my head all over the initial durations. However learning step by step about the service, controllers and routes, let me start with the web interface that ionic provides. With the command “ionic serve” I was able to poke the bear in the web browse for all the non mobile(saving and retrieving data from the movie DB api. It was really interesting to know that scheduling a notification is easy as pie irrespective of the too complicated ways in native android. I mainly faced difficulties with nested routes and states that are part of the tabbed pan under the side nav bar and the independent detailed views and navigations like pressing the back button etc,. I’ve tried to make the code structured and refactored as much as possible, as I always do.

# The flow:
## Home and Navigation:
A simple about page is the default home screen. The primary navigation is through the side drawer that has the major categories and settings while the internal navigation is through tabbed pane and pager view, which are detailed below.
![Home](https://file.ac/dbxWNYsHJrk/image1.png)

## The Movies view:
The movies nav essentially has 4 tabs, Favorite movies, Movies that are popular under the genres you’ve chosen, search all movies(irrespective of genres selected), chose genres.
The favorite screen typically loads the movies that you have viewed and marked as your favorite.
![Movies](https://file.ac/dbxWNYsHJrk/image2.png)

### Genres view:
Choose and save your movie genres so that the you can look into the popular or upcoming movies in the movies tab.
![Movie Genres](https://file.ac/dbxWNYsHJrk/image3.png)


### The Movies view:
This by default lists the favorite movies and has an infinite scroll on the list. It lists only the chosen genres(all genres if not selected any). You can click on any particular movie and you can favorite them for easy viewing in the favorites tab.
![Move list](https://file.ac/dbxWNYsHJrk/image4.png)
![Details Movie](https://file.ac/dbxWNYsHJrk/image5.png)


### The search view:
This view lets you search the movies irrespective of the genres you’ve chosen. Initially this view will be empty and will list on searching with a query.
![Movie search](https://file.ac/dbxWNYsHJrk/image6.png)

### The Upcoming movies view:
This view has options to let you get notified when the movie is about to be aired:
![Upcoming movie](https://file.ac/dbxWNYsHJrk/image7.png)

## TV shows:
TV shows section also has the 4 tabs mentioned above:
### Favorite shows:
![TV favorites](https://file.ac/dbxWNYsHJrk/image8.png)

### Genres view:
![TV genres](https://file.ac/dbxWNYsHJrk/image9.png)

### The TV show details view:
![Show details](https://file.ac/dbxWNYsHJrk/image10.png)

### The Seasons Overview screen:
This is the important variation from the Movies flow. This corresponds to all the seasons that a series has aired till date including the planned episodes of the running season. This show the progress of the season with the episodes you have watched or skipped.
![Seasons overview](https://file.ac/dbxWNYsHJrk/image11.png)
![Seasons overview](https://file.ac/dbxWNYsHJrk/image12.png)

### The Season Episodes Pager view:
This view lets you page across all the episodes of the season and lets you mark individually. This view has the details of episode rating and votes. You can mark an episode watched or favorite. You can also schedule an alert for the episode that is about to be aired.
![Episode overview](https://file.ac/dbxWNYsHJrk/image13.png)
![Episodes Favorite](https://file.ac/dbxWNYsHJrk/image14.png)
![Upcoming Episodes](https://file.ac/dbxWNYsHJrk/image15.png)


# References:

- TheMovieDB documentation: http://docs.themoviedb.apiary.io/

- Ionic documentation:  http://ionicframework.com/docs/components/#header

- Side bar references: http://inders.in/blog/2015/01/18/creating-ultimate-sidemenu-navigation-ionic-app/

- SQLite db documentation : http://ngcordova.com/docs/plugins/sqlite/

- Popups: http://blog.ionic.io/popup-support/

- Cordova notifications: http://ngcordova.com/docs/plugins/localNotification/
