<?php
if ($_POST['request'] === 'write') {
	if (($_POST['text']) != null) {

		$f=fopen('../../stories/stories.json','w');
		fwrite($f, $_POST['text']);
		fclose($f);

		echo 'Saved pin.';
		return;
	} else echo 'failure';
} else echo 'failure;
?>