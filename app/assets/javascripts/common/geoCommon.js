//位置情報取得関数
function getGeoLocation(func) {
  if (!navigator.geolocation) {
    //位置情報取得できない
    //市役所の位置を返す
    func(defaultLat, defaultLng);
    //func(-1,-1);
  }
  navigator.geolocation.getCurrentPosition(
    function (position) {
      var lat = position.coords.latitude;
      var lng = position.coords.longitude;
      func(lat, lng);
    },
    function () {
      //市役所の位置を返す
      func(defaultLat, defaultLng);
      //func(-1,-1);
    }
  );
}

function openMapApp(lat, lng) {
  getGeoLocation(function (slat, slng) {
      var url;

      // userAgent and device detecting
      var ua = {};
      ua.original = window.navigator.userAgent;
      ua.iPhone = /iPhone/.test(ua.original);
      ua.iPod = /iPod/.test(ua.original);
      ua.iPad = /iPad/.test(ua.original);
      ua.iOS = ua.iPhone || ua.iPod || ua.iPad;
      ua.iOSMobile = ua.iPhone || ua.iPod;
      ua.android = /Android/.test(ua.original);
      ua.androidMobile = /Android.+Mobile/.test(ua.original);
      ua.macosx = /Mac OS X 10/.test(ua.original);

      if (slat < 0) {
        //位置情報が無効の場合は経路指定しない
        if (ua.iOS) {
          url = "http://maps.apple.com/?address=" + lat + "," + lng + "&hl=ja&z=13&";
          document.location = url;
        } else if (ua.macosx) {
          url = "http://maps.apple.com/?address=" + lat + "," + lng + "&hl=ja&z=13&";
          document.location = url;
        } else if (ua.androidMobile) {
          url = "http://maps.google.co.jp/maps?q=loc:" + lat + "," + lng + "&hl=ja";
          document.location = url;
        } else {
          url = "http://maps.google.co.jp/maps?q=loc:" + lat + "," + lng + "&hl=ja";
          window.open(url, "_blank");
        }
      } else {
        //位置情報が有効だったら経路指定をして地図を開く
        if (ua.iOS || ua.macosx) {
          url = "http://maps.apple.com/?saddr=" + slat + "," + slng + "&daddr=" + lat + "," + lng + "&hl=ja&z=13&dirflg=w";
          document.location = url;
        } else if (ua.androidMobile) {
          url = "http://maps.google.co.jp/maps?saddr=" + slat + "," + slng + "&daddr=" + lat + "," + lng + "&hl=ja&z=13&dirflg=w";
          document.location = url;
        } else {
          url = "http://maps.google.co.jp/maps?saddr=" + slat + "," + slng + "&daddr=" + lat + "," + lng + "&hl=ja&z=13&dirflg=w";
          window.open(url, "_blank");
        }
      }
    }
  );
}









