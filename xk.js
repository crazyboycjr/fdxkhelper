function main() {

	/* Change UI */
	function modifyPage() {
		$("head").append('<link rel="stylesheet" href="//cdn.bootcss.com/bootstrap/3.3.5/css/bootstrap.min.css">');
		$("#allLessonListToolbar").before('<div id="selectHelper"></div>')
		$("#selectHelper").append(
			`
			<div id="xkhWrapper">
			    <form id="xkhelper">
			      <input id="myinput" type="text" placeholder="Course ID">
			      <button id="startBtn" type="button">开始选课</button>
			      <button id="stopBtn" type="button">停止选课</button>
			      <button id="quitBtn" type="button">退课</button>
			    </form>
			    <div id="resultArea" class="well"></div>
			</div>
			<style>
			    #xkhWrapper {
			        clear: both;
				    width: 96%;
				    margin: auto;
				    padding-bottom: 6px;
				    padding-top: 2px;
				    border-bottom: 1px solit #DDD;
				    line-height: 13px;
				    //background: #FEFFEF;
			    }
			    #xkhelper button {
			        height: 26px;
				    width: 80px;
				    font-size: 14px;
			    }
			    #xkhelper input {
			        font-size: 12px;
				    height: 26px;
			    }
			</style>
			`);
		$("body").append('<script src="//cdn.bootcss.com/bootstrap/3.3.5/js/bootstrap.min.js"></script>');
	};

	function getConfig() {
		window.config = window.electCourseTable.config;
		window.profileId = window.config.profileId;
	}

	getConfig();
	modifyPage();
	
	function printState(data) {
		$('#resultArea').append(`<div class="result"></div>`);
		let $result = $('.result');
		let $data = $(data);
		let date = new Date;
		let timeString = date.toLocaleTimeString().slice(0, -3) + '.'
			+ date.getMilliseconds() + date.toLocaleTimeString().slice(-3);
		$data.find('td').first().before(`<td style="text-align:center;">${timeString}</td>`);
		$result.last().html($data);
		let n = $result.size();
		if (n > 5) $result.first().remove();
	}
	
	function selectLoop(lessonId, course, callback) {
		function doSelect() {
			let url = '/xk/stdElectCourse!batchOperator.action' + '?' + 'profileId=' + window.profileId;
			console.log('POSTing...', url);
			//$.post('/xk/stdElectCourse!batchOperator.action?profileId=404',
			$.post(url, { optype: 'true', operator0: lessonId + ':true:0' , captcha_response: '' }, (data) => {
				printState(data);
				
				if (data.indexOf('成功') > 0 || data.indexOf('success') > 0) {
					callback();
				}
			});
		}
		
		window.intervalId = setInterval(doSelect, 230);
	}
	
	function getCourseId() {
		return new Promise((resolve, reject) => {
			let course = $("#myinput").val();
			course = course.trim();
			let res = lessonJSONs.filter((val) => { return val.no === course; });
			if (res.length === 0) {
				reject('没有找到该课程，请检查选课号。');
			}
			resolve(res[0].id, course);
		});
	};

	$('#startBtn').click(() => {
		getCourseId().then((lessonId, course) => {
			selectLoop(lessonId, course, () => {
				clearInterval(window.intervalId);

				$('#selectHelper').append(`
					<div class="alert alert-success" role="alert">
					<strong>Well done!</strong> You successfully select ${course}.
					</div>
				`);
			});
		}, (errMsg) => {
			alert(errMsg);
		});
	});
	$('#stopBtn').click(() => { clearInterval(window.intervalId); });

}


let script = document.createElement('script');
script.appendChild(document.createTextNode('(' + main + ')();'));
document.body.appendChild(script);

chrome.runtime.sendMessage({getToken: true}, (response) => {
	console.log(response.token);
});
