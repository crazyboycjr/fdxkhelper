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
//let injected = false;
chrome.pageAction.onClicked.addListener(function (tab) {
	//if (!injected) {
	chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
		chrome.tabs.sendMessage(tabs[0].id, {clear: true}, (response) => {
			console.log('injected scripts removed.');
			chrome.tabs.executeScript(null, {file: "xk.js"});
		});
	});
	//	injected = true;
	//}
});

let port = null;
let hostName = 'xyz.crazyboycjr.fdxkhelper';

function sendNativeMessage(imgData, cb) {
	msg = {"text": imgData};
	console.log('sending:', msg);

	chrome.runtime.sendNativeMessage(hostName, msg, (response) => {
		console.log('收到', response);
		cb(response);
	});
	
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
	if (msg.getToken) {
		sendNativeMessage(msg.imgData, (response) => {
			console.log('2233', response);
			sendResponse({token: response});
		});
	}
	return true;
});
