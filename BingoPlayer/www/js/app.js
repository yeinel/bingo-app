// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'ngCordova'])
        .controller("keyboardCtrl", function ($cope) {

        })
        .run(function ($ionicPlatform) {
            $ionicPlatform.ready(function () {
                // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
                // for form inputs)
                if (window.cordova && window.cordova.plugins.Keyboard) {
                    cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);


//                    setInterval(function () {
//                        var isVisible = $cordovaKeyboard.isVisible();
//                        if (isVisible) {
//                            
//                        } else {
//                            
//                        }
//                    }, 1000);

                }
                if (window.StatusBar) {
                    StatusBar.styleDefault();
                }
                onDocLoad();

                window.addEventListener('native.keyboardhide', function () {

                    $("header").show("slow");
                    $(".float-button").show("slow");
                    $("main").css("top", "110px");
                });
                window.addEventListener('native.keyboardshow', function () {
                    var focused = document.activeElement;

                    $(".float-button").hide("slow");
                    if (focused.id && focused.id != "inputNumber") {
                        $("header").hide("slow");
                        $("main").css("top", "0px");
                    }


                });

            });



        });
