<?php
$referer = $_SERVER['HTTP_REFERER'];

session_start();
if (hash_equals($_SESSION['t'], $_POST['t']) && hash_equals($_SESSION['k'], $_POST['k'])) {
	if ($referer == 'https://exp.v-os.ca/cartographer/') {
		if (($_POST['text']) != null) {

			$f=fopen('../../stories/stories.json','w');
			fwrite($f, $_POST['text']);
			fclose($f);

			//echo 'Pinning currently offline.';
			echo 'Pin saved.';
			return;
			
		} else echo 'improper data';
	} else echo 'improper referer';
} else echo 'improper token';
?>