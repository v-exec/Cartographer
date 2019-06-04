<?php
include 'crypt.php';

session_start();

//check tokens
if (!hash_equals($_SESSION['t'], $_POST['t']) || !password_verify($frontDoor, $_POST['t']) || !hash_equals($_SESSION['k'], $_POST['k']) || !password_verify($backDoor, $_POST['k'])) {
	echo 'improper token';
	return;
}

//check for text
if ($_POST['text'] === null || $_POST['text'] === '') {
	echo 'missing text';
	return;
}

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
if (strlen($uText) > 40) {
	echo 'text length too long';
	return;
}

//check if time is formatted properly
$noon = substr($uTime, strlen($uTime), strlen($uTime));

if ($noon !== 'am' && $noon !== 'pm') {
	echo 'time is not properly formatted';
	return;
}

$nums = substr($uTime, 0, strlen($uTime) - 2);
$nums = str_replace(':', '', $nums);
$nums = str_replace('-', '', $nums);
$nums = str_replace('/', '', $nums);
$nums = str_replace(' ', '', $nums);

if (!is_numeric($nums)) {
	echo 'time is not numeric';
	return;
}

//check if x and y are appropriate numbers
if (!is_numeric($uX) || !is_numeric($uY)) {
	echo 'pin location is not numeric';
	return;
}

if ($uX < 5 && $uX > -5 && $uY < 5 && $uY > -5) {
	echo 'pin location too close to origin';
	return;
}

if ($uX > 50000 || $uX < -50000 || $uY > 50000 || $uY < -50000) {
	echo 'pin location too far';
	return;
}

//create json object
$newObject = (object) [
	'x' => $uX,
	'y' => $uY,
	'text' => $uText,
	'time' => $uTime
];

//parse json
$c = file_get_contents('../../stories/stories.json');
$j = json_decode($c, TRUE);
array_push($j['stories'], $newObject);
$j = json_encode($j);

//append to stories
$f = fopen('../../stories/stories.json','w');
fwrite($f, $j);
fclose($f);

//echo 'Pinning currently offline.';
echo 'Pin saved.';
return;
?>