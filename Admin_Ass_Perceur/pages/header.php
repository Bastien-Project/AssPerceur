<!DOCTYPE html>
<?php

session_start();

if (!empty($_SESSION)) {
	print_r("Vous êtes connecté en tant que " . $_SESSION['username']);
} else {
	print_r("Vous n'êtes pas connecté");
}

if (pathinfo($_SERVER['PHP_SELF'])['basename'] == 'index.php') {
?>

	<head>
		<meta charset="UTF-8" />
		<title>Ass-Perceur</title>
		<link rel="stylesheet" media="screen" href="stylesheets/style.css" type="text/css" />
		<script src="https://kit.fontawesome.com/3cff230019.js" crossorigin="anonymous"></script>
	</head>

	<body id="contenu">
		<nav>
			<h1><a href="index.php">Ass-Perceur</a></h1>
			<div class="onglets">
				<p class="link"><a href="index.php">Accueil</a></p>
				<?php // si l'utilisateur est connecté et que c'est un admin
				if (!empty($_SESSION) && $_SESSION['username'] == 'admin') { ?>
					<p class="link"><a href="pages/admin/admin_index.php">Admin</a></p>
					<p class="link"><a href="pages/API.php">API</a></p>
				<?php }
				//si l'utilisateur n'est pas connecté
				if (empty($_SESSION)) { ?>
					<p><a href="pages/connexion.php">Connexion</a></p>
				<?php } 
				//si l'utilisateur est connecté
				if (!empty($_SESSION)) { ?>
					<p><a href="pages/logout.php"><i class="fas fa-sign-out-alt"></i></a></p>
				<?php } ?>
			</div>
		</nav>
	<?php
} else {
	?>
		<html lang="fr">

		<head>
			<meta charset="UTF-8" />
			<title>Ass-Perceur</title>
			<link rel="stylesheet" media="screen" href="../stylesheets/style.css" type="text/css" />
			<script src="https://kit.fontawesome.com/3cff230019.js" crossorigin="anonymous"></script>
		</head>

		<body id="contenu">
			<nav>
				<h1><a href="../index.php">Ass-Perceur</a></h1>
				<div class="onglets">
					<p class="link"><a href="../index.php">Accueil</a></p>
					<?php // si l'utilisateur est connecté et que c'est un admin
					if (!empty($_SESSION) && $_SESSION['username'] == 'admin') { ?>
						<p class="link"><a href="admin/admin_index.php">Admin</a></p>
						<p class="link"><a href="API.php">API</a></p>
					<?php } //si l'utilisateur n'est pas connecté
					if (empty($_SESSION)) { ?>
						<p><a href="connexion.php">Connexion</a></p>
					<?php }
					//si l'utilisateur est connecté
					if (!empty($_SESSION)) { ?>
						<p><a href="logout.php"><i class="fas fa-sign-out-alt"></i></a></p>
					<?php } ?>
				</div>
			</nav>
		<?php
	}
		?>