function main() {

	// add some form and button for interact
	function modifyPage() {
		$("head").append('<link rel="stylesheet" href="//cdn.bootcss.com/bootstrap/3.3.5/css/bootstrap.min.css">');
		$("#allLessonListToolbar").before('<div id="selectHelper"></div>')
		$("#selectHelper").append(
			`
			<div style="clear:both;width:96%;margin:auto;padding-bottom:6px;padding-top:2px;border-bottom:1px solid #DDD;line-height:13px;background:#feffef">
			    <form>
			      <input id="myinput" type="text" placeholder="Course ID" style="font-size:12px;height:26px;">
			      <button id="startBtn" type="button" style="height:26px;width:80px;font-size:14px;">开始选课</button>
			      <button id="stopBtn" type="button" style="height:26px;width:80px;font-size:14px;">停止选课</button>
			      <button id="quitBtn" type="button" style="height:26px;width:80px;font-size:14px;">退课</button>
			    </form>
			</div>
			<div id="resultArea" class="well" style="width:96%;margin:auto;"></div>
			`);
		$("body").append('<script src="//cdn.bootcss.com/bootstrap/3.3.5/js/bootstrap.min.js"></script>');
	};

	modifyPage();
	
	function ask_left() {
		let url = '/xk/stdElectCourse!queryStdCount.action?projectId=1&semesterId=242';
		return new Promise((resolve, reject) => {
			$.get(url, (data, status) => {
				if (status === 'success') {
					resolve(data);
				} else {
					reject(data);
				}
			});
		});
	}
	
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
	
	function selectLoop(lessonId) {
		function doSelect() {
			/*
			ask_left().then((lessonId2Counts) => {
				//console.log(lessonId2Counts);
				eval(lessonId2Counts);
				console.log(`${new Date} sc: ${sc}, lc: ${lc}`);
				let [sc, lc] = [window.lessonId2Counts[lessonId].sc, window.lessonId2Counts[lessonId].lc];
			}, (e) => {
				console.error(e);
			});*/
			$.post('/xk/stdElectCourse!batchOperator.action?profileId=404',
			{ optype: 'true', operator0: lessonId + ':true:0' }, (data) => {
				printState(data);
				
				if (data.indexOf('成功') > 0 || data.indexOf('success') > 0) {

					clearInterval(window.intervalId);
					
					$('#selectHelper').append(`
						<div class="alert alert-success" role="alert">
						  <strong>Well done!</strong> You successfully select this course.
						</div>
					`);
				}
			});
		}
		
		window.intervalId = setInterval(doSelect, 230);
	}
	
	function getCourseId() {
		let course = $("#myinput").val();
		course = course.trim();
		var lessonId = -1;
		for (let lesson of lessonJSONs) {
			if (lesson.no == course) {
				lessonId = lesson.id;
				break;
			}
		}
		if (lessonId < 0) {
			alert('无法该选择课程');
			return -1;
		}
		selectLoop(lessonId);
	};
	
	$('#startBtn').click(getCourseId);
	$('#stopBtn').click(() => { clearInterval(window.intervalId); });


}


let script = document.createElement('script');
script.appendChild(document.createTextNode('(' + main + ')();'));
document.body.appendChild(script);

chrome.runtime.sendMessage({getToken: true}, (response) => {
	console.log(response.token);
});
