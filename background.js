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

// Bug: 导致刷新之后无法再次注入，必须重载插件
let injected = false;
chrome.pageAction.onClicked.addListener(function (tab) {
	if (!injected) {
		chrome.tabs.executeScript(null, {file: "xk.js"});
		injected = true;
	}
});

let port = null;
let hostName = 'xyz.crazyboycjr.fdxkhelper';

function sendNativeMessage(imgData, cb) {
	msg = {"text": imgData};
	//msg = imgData;
	console.log('sending:', msg);
	//port.postMessage(msg);
	
	chrome.runtime.sendNativeMessage(hostName, msg, (response) => {
		console.log('收到', response);
		cb(response);
	});
	
}

/*
function onNativeMessage(msg) {
	console.log('recv:', msg);
}

function onDisconnect() {
	port = null;
	console.log('Disconnected');
}

function connect() {
	port = chrome.runtime.connectNative(hostName);
	port.onMessage.addListener(onNativeMessage);
	port.onDisconnect.addListener(onDisconnect);
}
*/

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
	console.log('sender:', sender);
	console.log('msg:', msg);
	if (msg.getToken) {
		//if (!port) {
		//	connect();
		//}
		sendNativeMessage(msg.imgData, (response) => {
			console.log('2233', response);
			sendResponse({token: response});
		});
	}
	return true;
});
