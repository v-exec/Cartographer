var readerPath = 'https://exp.v-os.ca/cartographer/scripts/private/reader.php';

function updateStories() {
	var xhr = new XMLHttpRequest();
	xhr.open('POST', readerPath, true);
	xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	xhr.onload = function() {
		if (xhr.status === 200) {
			//update stories
			var newStories = xhr.responseText;
			storyData = JSON.parse(newStories);

			//add new stories to list
			for (var i = stories.length; i < storyData['stories'].length; i++) {
				var currentStory = storyData['stories'][i];
				p.append(stories, new Story(currentStory['x'], currentStory['y'], currentStory['text'], currentStory['time']));
			}
			if (document.getElementById('main').className != 'ready') document.getElementById('main').className = 'ready';
		}
		else {
			//handle error
			console.log('Had trouble loading stories during this ping.');
		}
	};
	xhr.send(encodeURI('request=text' + '&r=' + Math.random(0, 100000)));
}

var writerPath = 'https://exp.v-os.ca/cartographer/scripts/private/writer.php';

function issueRequest(text, time, x, y) {
	var xhr = new XMLHttpRequest();
	xhr.open('POST', writerPath, true);
	xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	xhr.onload = function() {
		if (xhr.status === 200) {
			//handle response
			console.log(xhr.responseText);
			if (liveUpdate) updateStories();
		}
		else {
			//handle error
			console.log('Did not recieve reply.');
		}
	};
	var k = document.getElementById('k').className;
	var t = getCookie('t');
	xhr.send(encodeURI('k=' + k + '&t=' + t + '&text=' + text + '&time=' + time + '&x=' + x + '&y=' + y));
}