function onDocLoad() {
    if ((/(ipad|iphone|ipod|android|windows phone)/i.test(navigator.userAgent))) {
        document.addEventListener('deviceready', initApp, false);
    } else {
        initApp();
    }
}

function initApp() {
    initAd();
    // display the banner at startup
    window.plugins.AdMob.createBannerView();
}

function initAd() {
    if (window.plugins && window.plugins.AdMob) {
        var ad_units = {
            ios: {
                banner: 'ca-app-pub-3819529069813221/9780851994',
                interstitial: 'ca-app-pub-3819529069813221/6571216790'
            },
            android: {
                banner: 'ca-app-pub-3819529069813221/9780851994',
                interstitial: 'ca-app-pub-3819529069813221/6571216790'
            }
            ,
            wp8: {
                banner: 'ca-app-pub-3819529069813221/9780851994',
                interstitial: 'ca-app-pub-3819529069813221/6571216790'
            }
        };
        var admobid = "";
        if (/(android)/i.test(navigator.userAgent)) {
            admobid = ad_units.android;
        } else if (/(iphone|ipad)/i.test(navigator.userAgent)) {
            admobid = ad_units.ios;
        } else {
//            admobid = ad_units.wp8;
            admobid = ad_units.android;
        }
        window.plugins.AdMob.setOptions({
            publisherId: admobid.banner,
            interstitialAdId: admobid.interstitial,
            bannerAtTop: true, // set to true, to put banner at top
            overlap: false, // set to true, to allow banner overlap webview
            offsetTopBar: false, // set to true to avoid ios7 status bar overlap
            isTesting: false, // receiving test ad
            autoShow: true // auto show interstitial ad when loaded
        });
        registerAdEvents();

    } else {
        alert('admob plugin not ready');
    }
}
// optional, in case respond to events
function registerAdEvents() {
    document.addEventListener('onReceiveAd', function () {});
    document.addEventListener('onFailedToReceiveAd', function (data) {});
    document.addEventListener('onPresentAd', function () {});
    document.addEventListener('onDismissAd', function () { });
    document.addEventListener('onLeaveToAd', function () { });
    document.addEventListener('onReceiveInterstitialAd', function () { });
    document.addEventListener('onPresentInterstitialAd', function () { });
    document.addEventListener('onDismissInterstitialAd', function () { });
}
function onResize() {
//    var msg = 'web view: ' + window.innerWidth + ' x ' + window.innerHeight;
//    document.getElementById('sizeinfo').innerHTML = msg;
}


