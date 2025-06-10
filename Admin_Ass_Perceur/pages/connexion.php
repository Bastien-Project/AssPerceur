<?php include("header.php");

$header = array(
    'Authorization: SUB',
    'Content-Type: application/json'
);
$context = stream_context_create([
    'http' => [
        'header' => $header
    ]
]);

$url = 'http://localhost:3000/utilisateurs'; // URL de votre API REST
$data = file_get_contents($url, false, $context);
$users = json_decode($data, true)['utilisateurs'];
foreach ($users as $user) {
        $connexion[] = [
            'username' => $user['nom'],
            'password' => $user['mot_de_passe']
        ];
}

//si le couple clé/valeur existe dans le tableau alors on peut se connecter
if (isset($_POST['username']) && isset($_POST['password'])) {
    foreach ($connexion as $user) {
        if ($_POST['username'] === $user['username'] && $_POST['password'] === $user['password']) {
            $_SESSION['username'] = $_POST['username'];
            header("Location: ../index.php");
            exit;
        } else {
            $error = "Nom d'utilisateur ou mot de passe incorrect.";
        }
    }
}
?>

<body>
    <section id="connexion">
        <div class="login-container">
            <form action="#" method="post">
                <div class="form-group">
                    <label for="username">Nom d'utilisateur :</label>
                    <input type="text" id="username" name="username" required>
                </div>
                <div class="form-group">
                    <label for="password">Mot de passe :</label>
                    <input type="password" id="password" name="password" required>
                </div>
                <div class="form-group">
                    <button type="submit">Se Connecter</button>
                </div>
            </form>
        </div>
    </section>
</body>

</html>

<?php include("footer.php") ?>