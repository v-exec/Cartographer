<?php
if ($_POST['request'] == 'text') {
	$c = file_get_contents('../../stories/stories.json');
	echo $c;
	return;
} else echo 'improper request';
?>