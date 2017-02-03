chrome.runtime.onInstalled.addListener(function() {
	chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
		chrome.declarativeContent.onPageChanged.addRules([
			{
				conditions: [
					new chrome.declarativeContent.PageStateMatcher({
						pageUrl: { urlContains: 'xk.fudan.edu.cn' },
					})
				],
				actions: [ new chrome.declarativeContent.ShowPageAction() ]
			}
		]);
	});
});


let injected = false;
chrome.pageAction.onClicked.addListener(function (tab) {
	if (!injected) {
		chrome.tabs.executeScript(null, {file: "xk.js"});
		injected = true;
	}
});

let port = null;
let hostName = 'xyz.crazyboycjr.fdxkhelper';

function sendNativeMessage(imgData) {
	msg = {"text": imgData};
	port.postMessage(imgData);
}

function onNativeMessage(msg) {
	//TODO Add some check of invalid char
	return msg;
}

function onDisconnected() {
	port = null;
}

function connect() {
	port = chrome.runtime.connectNative(hostName);
	port.onMessage.addListener(onNativeMessage);
	port.onDisconnect.addListerner(onDisconnected);
}

chrome.runtime.onMessage.addListener((msg, _, sendResponse) => {
	if (msg.getToken) {
		if (!port) {
			connect();
		}
		sendNativeMessage(msg.imgData);
		sendResponse({token: token});
	}
});
