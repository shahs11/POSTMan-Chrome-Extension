chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('test_runner.html', {
    "bounds": {
      left: 40,
      top: 40,
      width: 1000,
      height: 800
    }
  }, function(win) {
  	win.onClosed.addListener(function() {
  		console.log("On closing the window");
  	});
  });
});