// Copyright (c) 2011 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// Called when the user clicks on the browser action.
chrome.runtime.onInstalled.addListener(function() {
	chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
		chrome.declarativeContent.onPageChanged.addRules([{
			conditions: [new chrome.declarativeContent.PageStateMatcher({
				pageUrl: {hostEquals: 'www.jbis.or.jp'},
				})
			],
			actions: [new chrome.declarativeContent.ShowPageAction()]
		}]);
	});
});

chrome.browserAction.onClicked.addListener(function(tab) {
  // No tabs or host permissions needed!  
 chrome.tabs.executeScript(null, {file: "jquery-2.2.3.min.js"});
 chrome.tabs.executeScript(null, {file: "process.js"});
  
});
