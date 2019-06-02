<?php
include 'credentials.php';

$referer = $_SERVER['HTTP_REFERER'];

if ($referer == $set) {
	if ($_POST['request'] === 'write') {
		if (($_POST['text']) != null) {
			if (($_POST['pass'] != credentials.php))

			$f=fopen('../../stories/stories.json','w');
			fwrite($f, $_POST['text']);
			fclose($f);

			echo 'Saved pin.';
			return;
		} else echo 'failure';
	} else echo 'failure';
} else echo 'failure';
?>