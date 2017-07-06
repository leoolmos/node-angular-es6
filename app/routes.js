import app from './app'
app.config( ($routeProvider, $locationProvider) => {

    $locationProvider.html5Mode(true);

    $routeProvider.when('/', {
      templateUrl: './views/login/index.html'
    })

  }
)
