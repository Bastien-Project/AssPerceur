<!DOCTYPE html>
<?php

session_start();

if (empty($_SESSION)) {
    header('Location: ../../index.php');
}

$header = array(
    'Authorization: SUB',
    'Content-Type: application/json'
);
$context = stream_context_create([
    'http' => [
        'header' => $header
    ]
]);
?>
<html lang="fr">

<head>
    <meta charset="UTF-8" />
    <title>Ass-Perceur</title>
    <link rel="stylesheet" media="screen" href="../../stylesheets/style.css" type="text/css" />
    <link rel="stylesheet" media="screen" href="../../stylesheets/admin.css" type="text/css" />
    <script src="https://kit.fontawesome.com/3cff230019.js" crossorigin="anonymous"></script>
</head>

<body class="admin-accueil">
    <nav>
        <h1><a href="../../index.php">Ass-Perceur</a></h1>
        <div class="onglets">
            <p class="link"><a href="../../index.php">Accueil</a></p>
            <p class="link"><a href="admin_index.php">Admin</a></p>
            <p class="link"><a href="../API.php">API</a></p>

            <p class="link"><a href="../logout.php"><i class="fas fa-sign-out-alt"></i></a></p>
        </div>
    </nav>

    <h1>Administration</h1>
    <div class="admin">
        <div class="onglets">
            <p class="link"><a href="admin_index.php">Accueil</a></p>
            <p class="link"><a href="utilisateurs.php">Utilisateurs</a></p>
            <p class="link"><a href="annonces.php">Annonces</a></p>
            <p class="link"><a href="roles.php">Rôles</a></p>
            <p class="link"><a href="localisations.php">Localisations</a></p>
            <p class="link"><a href="plantes.php">Plantes</a></p>
            <p class="link"><a href="messages.php">Messages</a></p>
            <p class="link"><a href="candidate.php">Candidatures</a></p>
        </div>
    </div>