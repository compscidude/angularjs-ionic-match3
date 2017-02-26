// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
/* =========================== GAME CODE =========================== */

// this is global  
var property_shape = ['circle', 'triangle', 'square'];
var property_shape_colour = ['red', 'blue', 'yellow'];
var property_background_colour = ['white', 'black', 'grey'];

var app = angular.module('match3', ['ionic', 'ngCordova', 'ngStorage']);
app.run(function($ionicPlatform, $ionicPopup, $rootScope, $ionicHistory, $state, $localStorage) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)

    if(window.plugins && window.plugins.AdMob){
        var admob_key = device.platform == "Android" ? "ca-app-pub-6712565667613590/2133563865" : "IOS_PUBLISHER_KEY";
        var admob = window.plugins.AdMob;
        admob.createBannerView(
            {
              'publisherId': admob_key,
              'adSize': admob.AD_SIZE.BANNER,
              'bannerAtTop': false
            },
            function(){
              admob.requestAd(
                { 'isTesting' : true },
                function(){ admob.showAd(true);},
                function(){ console.log('failed to request ad');}
                );
            },
            function(){
              console.log('failed to create banner view');
            }
        );
     };

    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }

  // Disable BACK button on home
  $ionicPlatform.registerBackButtonAction(function (event) {
    if($state.current.name=="home"){
       navigator.app.exitApp();
    }
    else {
       navigator.app.backHistory();
     }
    }, 100);
    // priority 100 overwrites the current handling of back button
  });

    // User's first time.
  $rootScope.$storage = $localStorage.$default({firstCasual: true, firstTimeAttack: true, maxScore: 0});

});

app.config(function($stateProvider, $urlRouterProvider, $provide){

  $stateProvider
    // set up abstract state for the menu selection
    .state('home', {
      url: '/',
      templateUrl: 'templates/home.html',
      controller: 'home'
    })
    .state('game', {
      url: '/:mode',
      templateUrl: 'templates/game.html',
      controller: 'game'
    })

    .state('tutorial', {
      url: '/tutorial',
      templateUrl: 'templates/tutorial.html',
      controller: 'tutorial'
    })
    .state('leaderboard', {
      url: '/leaderboard',
      templaetUrl: 'templates/leaderboard.html'
    })

    $urlRouterProvider.otherwise('/')

    $provide.decorator('$state', function($delegate, $stateParams) {
        $delegate.forceReload = function() {
            return $delegate.go($delegate.current, $stateParams, {
                reload: true,
                inherit: false,
                notify: true
            });
        };
        return $delegate;
    });


});


app.controller('home', function($scope, $rootScope, $timeout, $localStorage){
  $scope.msg = 'home';
  $scope.maxScore = $rootScope.$storage.maxScore;
});

app.controller('tutorial', function($scope, $ionicPopup, $ionicScrollDelegate){
   var v1 = new Cell('white', 'triangle', 'blue');
   var v2 = new Cell('grey', 'circle', 'red');
   var v3 = new Cell('black', 'square', 'yellow');
   var v33 = new Cell('grey', 'square', 'yellow');

   $scope.shapes = [v1,v2,v3];

   var v4 = new Cell('white', 'square', 'blue');
   var v5 = new Cell('white', 'triangle', 'blue');
   var v6 = new Cell('white', 'circle', 'blue');

   $scope.example1 = [v4,v5,v6];

   var v7 = new Cell('grey', 'triangle', 'yellow');
   var v8 = new Cell('grey', 'square', 'blue');
   var v9 = new Cell('grey', 'triangle', 'red');

   $scope.example2 = [v7,v8,v9];

   var v10 = new Cell('black', 'circle', 'red');
   var v11 = new Cell('white', 'circle', 'blue');
   var v12 = new Cell('black', 'circle', 'yellow');
   

   var a1 = new Cell('white', 'square', 'red');
   var a2 = new Cell('white', 'square', 'blue');
   var a3 = new Cell('white', 'square', 'yellow');

   var a4 = new Cell('grey', 'triangle', 'red');
   var a5 = new Cell('black', 'circle', 'red');

   // valid examples
   $scope.example6 = [a1,a2,a3];
   $scope.example7 = [a1,a4,a5];

   // invalid examples
   $scope.example4 = [v2,v33,v8];
   $scope.example5 = [v10,v11,v12];

  $scope.randomizeValid = function(){

    var r1 = _.random(0, 2);
    var shape = property_shape[r1];
    // randomize 3 cells with this shape.
    var a1 = randomize(shape);
    var a2 = randomize(shape);
    var a3 = randomize(shape);
    var arr1 = [a1,a2,a3];
    while (!isValid(arr1)){
        a1 = randomize(shape);
        a2 = randomize(shape);
        a3 = randomize(shape);
        arr1 = [a1,a2,a3];
    }

    a1 = randomize('triangle');
    a2 = randomize('square');
    a3 = randomize('circle');
    var arr2 = [a1,a2,a3];
    while(!isValid(arr2)){
        a1 = randomize('triangle');
        a2 = randomize('square');
        a3 = randomize('circle');
        arr2 = [a1,a2,a3];
    }

    $scope.example6 = arr1;
    $scope.example7 = _.shuffle(arr2);

  };

  $scope.randomizeInvalid = function(){

    var r1 = _.random(0, 2);
    var shape = property_shape[r1];
    // randomize 3 cells with this shape.
    var a1 = randomize(shape);
    var a2 = randomize(shape);
    var a3 = randomize(shape);
    var arr1 = [a1,a2,a3];
    while (isValid(arr1)){
        a1 = randomize(shape);
        a2 = randomize(shape);
        a3 = randomize(shape);
        arr1 = [a1,a2,a3];
    }

    a1 = randomize('triangle');
    a2 = randomize('square');
    a3 = randomize('circle');
    var arr2 = [a1,a2,a3];
    while(isValid(arr2)){
        a1 = randomize('triangle');
        a2 = randomize('square');
        a3 = randomize('circle');
        arr2 = [a1,a2,a3];
    }

    $scope.example4 = arr1;
    $scope.example5 = _.shuffle(arr2);
  };

  $scope.resizeScroll = function(){
    $ionicScrollDelegate.resize()
  };


});

/* =================================== GAME CONTROLLER ========================================== */
  
app.controller('game', function($scope, $rootScope, $stateParams, $timeout, $injector, $localStorage, $ionicPopup, $ionicPlatform, $state, $ionicHistory) {


  var TIME = 60;
  $scope.board = [];
  $scope.board2 = []; // different format of the board, so angular can use it to display.
  $scope.selected = [];
  $scope.selected_index = [];
  $scope.matches = [];
  // hints 
  $scope.hints = [];
  $scope.hintClick = 0;

  $scope.solution = [];
  $scope.score = 0;
  $rootScope.timer = TIME;
  $scope.gameMode = $scope.gameMode || $stateParams.mode;

  // Load Toast module
  $scope.toast = $scope.toast || $injector.get('Toast');


  // introduction.
  if ($rootScope.$storage.firstCasual && $stateParams.mode == 'Casual'){
    $scope.toast.show("You can get hints by clicking the button below with question mark", 'long', 'top');
    $rootScope.$storage.firstCasual = false;
  } else if ($rootScope.$storage.firstTimeAttack && $stateParams.mode == 'Time Attack'){
    $scope.toast.show("Everytime you find an answer, the clock is reset back to 60 seconds. Keep the timer alive as long as you can. No hints available", 'long', 'top');
    $rootScope.$storage.firstTimeAttack = false;
  }

  // Listen to events here
  $scope.$on('$destroy', function(){
    $timeout.cancel($rootScope.timeout);
  });

 $scope.$on('$locationChangeStart', function(){
    $state.forceReload();
  });

  // handles the logic of storing 3 clicked arrays, and checking if they form a match.
  $scope.clicked = function(index) {
    // only add if less than 3 selected
    if ($scope.selected.length < 3) {
      var cell = $scope.board[index];
      
      // only add to selected if this cell is not already selected.
      if (!(_.contains($scope.selected_index, index+1))){
             cell.selected = true;
             $scope.selected.push(cell);
             $scope.selected_index.push(index+1); 
      } else {
        // remove that from the selected list.
        cell.selected = false;
        $scope.selected_index = _.without($scope.selected_index, index+1);
        $scope.selected = _.without($scope.selected, cell);
      }
      
      // check if adding the last selection now equals 3 in total.
      if ($scope.selected.length == 3) {
        // do some checking here
        // we check if this is a valid solution
        var check = isValid($scope.selected);
        // valid combination
        if (check){
          // we sort the selected array
          $scope.selected_index = $scope.selected_index.sort();
          // check if this solution is a duplicate
          if ($scope.matchAlready($scope.selected_index)){
             // we alert error message
             $scope.toast.show("This has already been found", 'short', 'top');
          } else {
             var arr = $scope.selected_index.sort();
             $scope.matches.push(arr);

             // we check if this arr is our hint array, if so, we need to reset the hint.
             if (arrayEquals(arr, $scope.hints)){
                // reset all the hint parameters
                $scope.hints = [];
                $scope.hintClick = 0;
             }

             // we want to use index system that starts at 1.
             $scope.score += 1;
             // check if user is in time mode, and give additional time
             $rootScope.timer = TIME;
            // check if user found all the solutions.
              if ($scope.matches.length == $scope.solution.length){
                $scope.newBoard();
              }
          }
        }
        // undo user's 3 selectionr
        $scope.undo();

      }
    }
  }
  
 $scope.undo = function(){

     var fn = function(){
         _.each($scope.selected_index, function(index) {
              $scope.board[index-1].selected = false;
           });

          $scope.selected = [];
          $scope.selected_index = [];
     }

     // execute with a delay
     $timeout(function(){
        fn();
     }, 250); 
 }

  // this does not reset the score, just creates a new board (perhaps user goes to the next level, we dont
  // want to delete the user's previous round score.
 $scope.newBoard = function(){
   $scope.gameMode = $stateParams.mode;
   $scope.board = $scope.createBoard();
   $scope.board2 = partition($scope.board, 3);
   $scope.solution = [];
   $scope.matches = []; //initialize our array
   $scope.findSolutions();

   if ($scope.solution.length > 5 || $scope.solution.length == 0){
     $scope.newBoard();
     return;
   }
 }
  
 // we reset the board stats
 $scope.reset = function(){
    $scope.newBoard(); // resets the board
    $scope.newTimer(); // resets the timer
    $scope.score = 0;
 }

 $scope.newTimer = function(){
      if ($scope.gameMode == 'Time Attack'){
        $timeout.cancel($rootScope.timeout);
        $rootScope.timer = TIME;
        $scope.runTimer();
      }
  }

 $scope.findSolutions = function(){
   // we are given $scope.board, and we have to find all the solutions, if they exist.
   board = $scope.board;
   for (var i = 0; i < board.length - 2; i++){
     for (var j = i + 1; j < board.length - 1; j++){
       for (var k = j + 1; k < board.length; k++){
          var selection = [board[i], board[j], board[k]];
          var check = isValid(selection);
          if(check){
            $scope.solution.push([i+1,j+1,k+1]);
          }
       }
     }
   }
 }

 $scope.matchAlready = function(selected){
     if (arrayCompare($scope.matches, selected)){
       return true;
     }
   return false;
 }

$scope.createBoard = function() {
    // we need to randomize..
    // at least one shape of each.
    var board = [];
    // create a function to randomize square based on the shape.
    var square = randomize('square');
    var triangle = randomize('triangle');
    var circle = randomize('circle');

    board = [square, triangle, circle];

    // we need to randomize 6 more shapes.
    for (var i = 0; i < 6; i++) {
      var cell = $scope.createRandomCell();
      var check = $scope.sanitaryCheck(board, cell);
      while(!check){
        cell = $scope.createRandomCell();
        check = $scope.sanitaryCheck(board, cell);
      }
      board.push(cell);
    }
    // if we're in time attack, run down the timer
    return _.shuffle(board);
  }

  $scope.runTimer = function(){
    // we first have to make sure that the user is in time attack mode.
    if ($scope.gameMode == 'Time Attack' && $rootScope.timer >= 1){
        $rootScope.timer -= 1;
        if ($rootScope.timer == 0){
           // update the max score if he scored higher
           // call some call back here.
           $scope.showPopup(); 
           $timeout.cancel($rootScope.timeout);
           if ($scope.score > $rootScope.$storage.maxScore){
              $rootScope.$storage.maxScore = $scope.score;
           }
        }
    };'['
    $rootScope.timeout = $timeout(function(){$scope.runTimer()}, 1000);
  }

  // closure function to keep track of which properties are limited, so we don't continously make same random properties.
  $scope.createRandomCell = function() {
    // we need to create a variable within this function that keeps track of its local variable.
    var r1 = _.random(0, 2);
    var shape = property_shape[r1];
    var result = randomize(shape);
    return result;
  }

 // check if theres a duplicate, or if adding this results in 5 of the same property. (we only want maximum of 4 of the same property)
  $scope.sanitaryCheck = function(board, cell) {
    // so no duplicate, and we must make sure that there cannot be more than 4 of the same property.
    var check = duplicateCheck(board, cell);
    // we can make this more efficient by not having to do checks if the first requirement fails.
    var check2 = lessThanFour(board, cell);
    return (check && check2);
  }

  $scope.hint = function(){
   //$scope.arr = $scope.arr | ''; // or we find a new one that is in the solution but not in the match.
    if ($scope.gameMode == 'Casual') {
        if($scope.hintClick == 0){
          $scope.hints = $scope.findnotInMatch();
          $scope.hintClick += 1;
          $scope.toast.show('Hint: ' + $scope.hints[0] + ', ?, ?', 'short', 'center');
        } else if ($scope.hintClick == 1){
          $scope.toast.show('Hint: ' + $scope.hints[0] + ', ' + $scope.hints[1]+ ', ?', 'short', 'center');
        }
      }
  };
  
 $scope.findnotInMatch = function(){
      // loop through the solutions list, and if this solution is not in match then we report this array.
      for (var i = 0; i < $scope.solution.length; i++){
        if (!(arrayCompare($scope.matches, $scope.solution[i]))){
          return $scope.solution[i];
        } 
      }
 };

$scope.showPopup = function() {

  // An elaborate, custom popup
  var myPopup = $ionicPopup.show({
    templateUrl: 'templates/timeattack-retry.html',
    title: 'Game Over',
    scope: $scope,
    buttons: [
      { text: 'Main Menu',
        onTap: function(e){
          $state.go('home');
        }
      },
      {
        text: '<b>Play Again</b>',
        type: 'button-positive',
        onTap: function(e) {
          $scope.reset();
        }
      }
    ]
  });

 };

  // ========================== Start the game ========================== //
  // this initializes the board
  $scope.newBoard();
  $scope.newTimer();

  // for now we set it to casual mode
});

// compare the two arrays.
function arrayCompare(arrays, arr2){
    var len = arrays.length;
    // initial match array is empty, we can add the new solution
    if (len == 0){
      return false;
    }
  
    for (var i = 0; i < len; i ++){
       if (arrayEquals(arrays[i], arr2)){ 
           return true;
       }
    }
  
  // the new array is not in the set.
  return false;
}

function arrayEquals(arr1, arr2){
    for (var i = 0; i < arr1.length; i++){
     if (arr1[i] != arr2[i]){
       return false;
     }
   }
   // both arrays are equal
   return true;
}

// we want to make sure the cell object is not a duplicate. (this is used when creating the board)
function duplicateCheck(arr, cell) {
  for (var i = 0; i < arr.length; i++) {
    if ((arr[i].shape == cell.shape) && (arr[i].background_colour == cell.background_colour) && (arr[i].shape_colour == cell.shape_colour)) {
      return false;
    }
  }
  // no duplicates in current set.
  return true;
}

// Sanitary check to make sure that adding cell does not lead to 5 of the same property.
function lessThanFour(arr, cell) {
  // get each of the three properties

  if (arr.length < 5) {
    return true;
  }

  var shape = cell.shape;
  var background_colour = cell.background_colour;
  var shape_colour = cell.shape_colour;

  var shape_count = _.filter(arr, function(data) {
    if (data.shape == shape) {
      return data;
    }
  }).length;

  var background_count = _.filter(arr, function(data) {
    if (data.background_colour == background_colour) {
      return data;
    }
  }).length;

  var colour_count = _.filter(arr, function(data) {
    if (data.shape_colour == shape_colour) {
      return data;
    }
  }).length;

  if (shape_count == 4 || background_count == 4 || colour_count == 4) {
    return false;
  }

  return true;
}

function partition(arr, size){
  var temp = [];
  var res = [];
  for (var i = 0; i < arr.length; i++){
    if ((i+1)%size == 0){
      temp.push(arr[i]);
      res.push(temp);
      temp = [];
    } else {
      temp.push(arr[i]);
    }
  }

  return res;
}

// create a random cell with a given shape.
function randomize(shape) {
  var r1 = _.random(0, 2);
  var r2 = _.random(0, 2);
  var result = new Cell(property_background_colour[r1], shape, property_shape_colour[r2]);
  return result;
}

// lets create a board class
// Cell class. (3x3 cells)
function Cell(bg_colour, shape, shape_colour) {
  this.background_colour = bg_colour;
  this.shape = shape;
  this.shape_colour = shape_colour;
  this.selected = false;
};

// maybe we can wrap this in our factory.
function isValid(arr) {
  // Winning conditions
  // The characteristic has to be all different or all same.
  // There are 3 characteristics

  // 1) Shape 
  // 2) Colour of the shape
  // 3) Colour of the background

  if (similar(arr, 'backgroundColour') || unique(arr, 'backgroundColour')) {
    if (similar(arr, 'shape') || unique(arr, 'shape')) {
      if (similar(arr, 'shapeColour') || unique(arr, 'shapeColour')) {
        // each of the 3 properties are either the same or different.
        return true;
      }
    }
  }

  return false;
};

////////////// we can wrap the game checker later in some kind of factory. ////////////////////
function similar(arr, property) {
  // checks if the three properties are same.
  var result = _.every(arr, function(data) {

    if (property == 'backgroundColour') {
      if (data.background_colour == arr[0].background_colour) {
        return true;
      } else {
        return false;
      }
    } else if (property == 'shape') {
      if (data.shape == arr[0].shape) {
        return true;
      } else {
        return false;
      }
    } else if (property == 'shapeColour') {
      if (data.shape_colour == arr[0].shape_colour) {
        return true;
      } else {
        return false;
      }
    }
  });
  return result;
}

function unique(arr, property) {
  var result = _.uniq(collapse(arr, property));
  // This means the properties are all different.
  if (result.length == 3) {
    return true;
  }
  return false;
}

// return only the specified properties from the array which contain square objects.
function collapse(arr, property) {
  var result = [];
  if (property == 'backgroundColour') {
    _.each(arr, function(data) {
      result.push(data.background_colour);
    });
  } else if (property == 'shape') {
    _.each(arr, function(data) {
      result.push(data.shape);
    });
  } else if (property == 'shapeColour') {
    _.each(arr, function(data) {
      result.push(data.shape_colour);
    });
  }
  return result;
}

// ============== Factory =============== //
app.factory('Toast', function($rootScope, $timeout, $ionicPopup, $cordovaToast) {
      return {
          show: function (message, duration, position) {
            message = message || "There was a problem...";
            duration = duration || 'short';
            position = position || 'top';
 
            if (!!window.cordova) {
              // Use the Cordova Toast plugin
          $cordovaToast.show(message, duration, position);              
            }
            else {
                    if (duration == 'short') {
                        duration = 1000;
                    }
                    else {
                        duration = 5000;
                    }
 
            var myPopup = $ionicPopup.show({
              template: "<div class='toast'>" + message + "</div>",
              scope: $rootScope,
              buttons: []
            });
  
            $timeout(function() {
              myPopup.close(); 
            }, duration);
            }
      }
    };
  });

// ============== Directives =============== //
app.directive('board', function() {
  return {
    restrict: 'E',
    scope: {
      board: '=board'
    },
    templateUrl: 'templates/board-partial.html'
  };
});

// todo, make the user set high record, in Time Attack.








