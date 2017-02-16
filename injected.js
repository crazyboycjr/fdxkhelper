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
			      <button id="dropBtn" type="button">退课</button>
			    </form>
			    <ul id="resultArea" class="well"></ul>
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
		$("head").append('<script src="//cdn.bootcss.com/bootstrap/3.3.5/js/bootstrap.min.js"></script>');
	};

	function getConfig() {
		window.config = window.electCourseTable.config;
		window.profileId = window.config.profileId;
	}

	getConfig();
	modifyPage();
	
	function getCourseId() {
		return new Promise((resolve, reject) => {
			let course = $("#myinput").val();
			course = course.trim();
			let res = lessonJSONs.filter((val) => { return val.no === course; });
			if (res.length === 0) {
				reject('没有找到该课程，请检查选课号。');
			}
			resolve([res[0].id, course]);
		});
	};

	function work(operation) {
		getCourseId().then((arr) => {
			lessonId = arr[0];
			course = arr[1];
			setTimeout(() => {
				document.dispatchEvent(new CustomEvent('RW759_connectExtension', {
					detail: {0: lessonId, 1: course, 2: window.profileId, 3: operation}
				}));
			}, 0);

		}, (errMsg) => {
			alert(errMsg);
		});
	}

	$('#startBtn').click(() => {
		work('choose');
	});

	$('#stopBtn').click(() => {
		setTimeout(() => {
			document.dispatchEvent(new CustomEvent('RW759_connectExtension', {
				detail: {0: null, 1: null, 2: null, 3: 'stop'}
			}));
		}, 	0);
	});

	$('#dropBtn').click(() => {
		work('drop');
	});

}

main();
