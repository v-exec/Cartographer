<?php
session_start();
$_SESSION['t'] = substr(base_convert(sha1(uniqid(mt_rand())), 16, 36), 0, 32);
$_SESSION['k'] = substr(base_convert(sha1(uniqid(mt_rand())), 16, 36), 0, 32);
setcookie('t', $_SESSION['t'], time() + (86400 * 30), "/");
?>

<!DOCTYPE html>
<html lang="">
	<head>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<title>Cartographer</title>
		<link href="https://fonts.googleapis.com/css?family=Comfortaa:400,600" rel="stylesheet">
		<script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.7.3/p5.js"></script>
		<script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.7.3/addons/p5.dom.min.js"></script>
		<link rel='icon' href='https://exp.v-os.ca/cartographer/assets/cartographer.ico' type='image/x-icon'>

		<script src="scripts/private/helpers.js"></script>
		<script src="scripts/private/biome.js"></script>
		<script src="scripts/private/point.js"></script>
		<script src="scripts/private/grid.js"></script>
		<script src="scripts/private/story.js"></script>

		<script src="scripts/private/init.js"></script>
		<script src="scripts/private/main.js"></script>

		<link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/5.0.0/normalize.css">
		<link rel="stylesheet" href="assets/style.css">
	</head>
	<body>
		<a id="root" href="https://v-os.ca/cartographer">cartographer</a>
		<div id="inputBoxHolder">
			<input type="text" id="inputBox" value="" placeholder="pin" maxlength = "40" onkeypress="handleInput(event)">
		</div>
		<div id="main">
			<div id="canvasParent"></div>
		</div>
		<div id="uibox">
			<span class="ui" id="northtext">0.0</span>
			<span class="ui" id="northsymbol">°lo</span>
			<span class="ui" id="easttext">0.0</span>
			<span class="ui" id="eastsymbol">°la</span>
		</div>
		<div id="k" class="<?php echo $_SESSION['k'] ?>" style="display:none"></div>
	</body>
</html>