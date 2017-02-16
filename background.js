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

chrome.pageAction.onClicked.addListener(function (tab) {
	chrome.tabs.executeScript(null, {file: "xk.js"});
});

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
			sendResponse({token: response});
		});
	}
	return true;
});
