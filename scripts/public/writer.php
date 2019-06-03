<?php
$referer = $_SERVER['HTTP_REFERER'];

session_start();
if (hash_equals($_SESSION['token'], $_POST['t'])) {
	if ($referer == 'http://exp.v-os.ca/cartographer/') {
		if ($_POST['request'] === 'write') {
			if (($_POST['text']) != null) {

				$f=fopen('../../stories/stories.json','w');
				fwrite($f, $_POST['text']);
				fclose($f);

				echo 'Saved pin.';
				return;
				
			} else echo 'improper data';
		} else echo 'improper request type';
	} else echo 'improper referer';
} else echo 'improper token';
?>