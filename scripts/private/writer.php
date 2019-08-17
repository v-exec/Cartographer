<?php
include 'crypt.php';

session_start();

//check tokens
if (!hash_equals($_SESSION['t'], $_POST['t']) || !password_verify($frontDoor, $_POST['t']) || !hash_equals($_SESSION['k'], $_POST['k']) || !password_verify($backDoor, $_POST['k'])) return echo 'token error';

//check for text
if ($_POST['text'] === null || $_POST['text'] === '') return;

//sanitize
$uText = $_POST['text'];
$uTime = $_POST['time'];
$uX = $_POST['x'];
$uY = $_POST['y'];

$uText = htmlspecialchars($uText, ENT_QUOTES, 'UTF-8');
$uTime = htmlspecialchars($uTime, ENT_QUOTES, 'UTF-8');
$uX = htmlspecialchars($uX, ENT_QUOTES, 'UTF-8');
$uY = htmlspecialchars($uY, ENT_QUOTES, 'UTF-8');

//check if text is appropriate length
if (strlen($uText) > 40) return;

include 'clean.php';
$clean = clean($uText);

//check if time is formatted properly
$noon = substr($uTime, strlen($uTime) - 2, strlen($uTime));
if ($noon !== 'am' && $noon !== 'pm') return;

$nums = substr($uTime, 0, strlen($uTime) - 2);
$nums = str_replace(':', '', $nums);
$nums = str_replace('-', '', $nums);
$nums = str_replace('/', '', $nums);
$nums = str_replace(' ', '', $nums);
if (!is_numeric($nums)) return;

//check if x and y are appropriate numbers
if (!is_numeric($uX) || !is_numeric($uY)) return;
if ($uX < 5 && $uX > -5 && $uY < 5 && $uY > -5) return;
if ($uX > 50000 || $uX < -50000 || $uY > 50000 || $uY < -50000) return;

//create json object
$newObject = (object) [
	'x' => $uX,
	'y' => $uY,
	'text' => $uText,
	'time' => $uTime
];

//feed to stories or moderation file
if ($clean) {
	if ($liveUpdate) {
		//parse json
		$c = file_get_contents('../../stories/stories.json');
		$j = json_decode($c, TRUE);
		array_push($j['stories'], $newObject);
		$j = json_encode($j);

		//append to stories
		$f = fopen('../../stories/stories.json','w');
		fwrite($f, $j);
		fclose($f);
	} else {
		//append to moderation file
		$c = file_get_contents('filter/moderation.txt');
		$write = json_encode($newObject, TRUE);
		$f = fopen('filter/stories/moderation.txt', 'w');
		fwrite($f, $c . $write . ",\n");
		fclose($f);
	}
}

echo 'pin processed';
return;
?>