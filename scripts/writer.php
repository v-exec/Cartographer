<?php
if ($_GET['request'] === 'write') {
	if (($_GET['text']) != null) {

		$f=fopen('../assets/stories.json','w');
		fwrite($f, $_GET['text']);
		fclose($f);

		echo 'Saved pin.';
		return;
	} else echo 'false';
}
?>