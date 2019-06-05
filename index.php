<?php
session_start();
include 'scripts/private/crypt.php';
setcookie('t', $_SESSION['t'], time() + (86400 * 30), "/");

?>

<!DOCTYPE html>
<html lang="">
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
		<title>Cartographer</title>
		<link href="https://fonts.googleapis.com/css?family=Comfortaa:400,600" rel="stylesheet">
		<script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.7.3/p5.js"></script>
		<script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.7.3/addons/p5.dom.min.js"></script>
		<link rel='icon' href='https://exp.v-os.ca/cartographer/assets/cartographer.ico' type='image/x-icon'>

		<script src="scripts/public/helpers.js"></script>
		<script src="scripts/public/biome.js"></script>
		<script src="scripts/public/point.js"></script>
		<script src="scripts/public/grid.js"></script>
		<script src="scripts/public/story.js"></script>

		<script src="scripts/public/init.js"></script>
		<script src="scripts/public/main.js"></script>

		<link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/5.0.0/normalize.css">
		<link rel="stylesheet" href="assets/style.css">
	</head>
	<body>
		<a id="root" href="https://v-os.ca/cartographer">cartographer</a>
		<div id="inputBoxHolder">
			<input type="text" id="inputBox" value="" placeholder="pin" maxlength = "40" onkeypress="handleInput(event)">
		</div>
		<div id="main">
			<div id="p5_loading" style="display: none"></div>
			<div id="canvasParent"></div>
		</div>
		<div id="uibox">
			<span class="ui" id="northtext">0.0</span>
			<span class="ui" id="northsymbol">°lo</span>
			<span class="ui" id="easttext">0.0</span>
			<span class="ui" id="eastsymbol">°la</span>
		</div>
		<div id="k" class="<?php echo $_SESSION['k'] ?>" style="display:none"></div>
		<script>liveUpdate = <?php echo ($liveUpdate) ? 'true' : 'false' ?>;</script>
	</body>
</html>