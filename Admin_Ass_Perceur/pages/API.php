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

    <!-- user -->
    <section id="API">
        <span style="padding-top: 50px; display:flex;"></span>
        <h2>Utilisateurs</h2>
        <div id="post">
            <div class="left">
                <p>POST /utilisateurs</p>
            </div>
            <div class="right">
                <p>Crée un nouvel utilisateur</p>
            </div>
        </div>
        <div id="get">
            <div class="left">
                <p>GET /utilisateurs</p>
            </div>
            <div class="right">
                <p>Récupère tous les utilisateur</p>
            </div>
        </div>
        <div id="get">
            <div class="left">
                <p>GET /utilisateurs/</p>
            </div>
            <div class="right">
                <p>Récupère un utilisateur par ID</p>
            </div>
        </div>
        <div id="put">
            <div class="left">
                <p>PATCH /utilisateurs/</p>
            </div>
            <div class="right">
                <p>Met à jour un utilisateur par ID</p>
            </div>
        </div>
        <div id="delete">
            <div class="left">
                <p>DELETE /utilisateurs/</p>
            </div>
            <div class="right">
                <p>Supprime un utilisateur par ID</p>
            </div>
        </div>
    </section>

    <!-- anonce -->
    <section id="API">
        <h2>Annonces</h2>
        <div id="post">
            <div class="left">
                <p>POST /annonces</p>
            </div>
            <div class="right">
                <p>Crée une nouvelle annonce</p>
            </div>
        </div>
        <div id="get">
            <div class="left">
                <p>GET /annonces</p>
            </div>
            <div class="right">
                <p>Récupère toutes les annonces</p>
            </div>
        </div>
        <div id="get">
            <div class="left">
                <p>GET /annonces/</p>
            </div>
            <div class="right">
                <p>Récupère une annonce par ID</p>
            </div>
        </div>
        <div id="put">
            <div class="left">
                <p>PATCH /annonces/</p>
            </div>
            <div class="right">
                <p>Met à jour une annonce par ID</p>
            </div>
        </div>
        <div id="delete">
            <div class="left">
                <p>DELETE /annonces/</p>
            </div>
            <div class="right">
                <p>Supprime une annonce par ID</p>
            </div>
        </div>

        <!--get-->
        <div id="get">
            <div class="left">
                <p>GET /nextidannonce</p>
            </div>
            <div class="right">
                <p>Trouve le prochain ID d'annonce disponible</p>
            </div>
        </div>
    </section>

    <!-- role -->
    <section id="API">
        <h2>Rôles</h2>
        <div id="post">
            <div class="left">
                <p>POST /roles</p>
            </div>
            <div class="right">
                <p>Crée un nouveau rôle</p>
            </div>
        </div>
        <div id="get">
            <div class="left">
                <p>GET /roles</p>
            </div>
            <div class="right">
                <p>Récupère tout les rôles</p>
            </div>
        </div>
        <div id="get">
            <div class="left">
                <p>GET /roles/</p>
            </div>
            <div class="right">
                <p>Récupère un rôle par ID</p>
            </div>
        </div>
        <div id="put">
            <div class="left">
                <p>PATCH /roles/</p>
            </div>
            <div class="right">
                <p>Met à jour un rôle par ID</p>
            </div>
        </div>
        <div id="delete">
            <div class="left">
                <p>DELETE /roles/</p>
            </div>
            <div class="right">
                <p>Supprime un rôle par ID</p>
            </div>
        </div>
    </section>

    <!-- localisation -->
    <section id="API">
        <h2>Localisations</h2>
        <div id="post">
            <div class="left">
                <p>POST /localisations</p>
            </div>
            <div class="right">
                <p>Crée une nouvelle localisation</p>
            </div>
        </div>
        <div id="get">
            <div class="left">
                <p>GET /localisations</p>
            </div>
            <div class="right">
                <p>Récupère toutes les localisation</p>
            </div>
        </div>
        <div id="get">
            <div class="left">
                <p>GET /localisations/</p>
            </div>
            <div class="right">
                <p>Récupère une localisation par ID</p>
            </div>
        </div>
        <div id="put">
            <div class="left">
                <p>PATCH /localisations/</p>
            </div>
            <div class="right">
                <p>Met à jour une localisation par ID</p>
            </div>
        </div>
        <div id="delete">
            <div class="left">
                <p>DELETE /localisations/</p>
            </div>
            <div class="right">
                <p>Supprime une localisation par ID</p>
            </div>
        </div>
        <div id="get">
            <div class="left">
                <p>GET /nextidlocalisations</p>
            </div>
            <div class="right">
                <p>Trouve le prochain ID de localisation disponible</p>
            </div>
        </div>
    </section>

    <!-- plantes -->
    <section id="API">
        <h2>Plantes</h2>
        <div id="post">
            <div class="left">
                <p>POST /plantes</p>
            </div>
            <div class="right">
                <p>Crée uen nouvelle plante</p>
            </div>
        </div>
        <div id="get">
            <div class="left">
                <p>GET /plantes</p>
            </div>
            <div class="right">
                <p>Récupère toutes les plantes</p>
            </div>
        </div>
        <div id="get">
            <div class="left">
                <p>GET /plantes/</p>
            </div>
            <div class="right">
                <p>Récupère une plante par ID</p>
            </div>
        </div>
        <div id="put">
            <div class="left">
                <p>PATCH /plantes/</p>
            </div>
            <div class="right">
                <p>Met à jour une plante par ID</p>
            </div>
        </div>
        <div id="delete">
            <div class="left">
                <p>DELETE /plantes/</p>
            </div>
            <div class="right">
                <p>Supprime une plante par ID</p>
            </div>
        </div>
    </section>

    <!-- message -->
    <section id="API">
        <h2>Messages</h2>
        <div id="post">
            <div class="left">
                <p>POST /messages</p>
            </div>
            <div class="right">
                <p>Crée un nouveau message</p>
            </div>
        </div>
        <div id="get">
            <div class="left">
                <p>GET /messages</p>
            </div>
            <div class="right">
                <p>Récupère tout les messages</p>
            </div>
        </div>
        <div id="get">
            <div class="left">
                <p>GET /messages/</p>
            </div>
            <div class="right">
                <p>Récupère les messages par userId</p>
            </div>
        </div>
        <div id="put">
            <div class="left">
                <p>PATCH /messages/</p>
            </div>
            <div class="right">
                <p>Met à jour un message par ID</p>
            </div>
        </div>
        <div id="delete">
            <div class="left">
                <p>DELETE /messages/</p>
            </div>
            <div class="right">
                <p>Supprime un message par ID</p>
            </div>
        </div>
    </section>

    <!-- candidature -->
    <section id="API">
        <h2>Candidatures</h2>
        <div id="post">
            <div class="left">
                <p>POST /candidater</p>
            </div>
            <div class="right">
                <p>Crée une nouvelle candidature</p>
            </div>
        </div>
        <div id="get">
            <div class="left">
                <p>GET /candidater</p>
            </div>
            <div class="right">
                <p>Récupère toutes les candidatures</p>
            </div>
        </div>
        <div id="get">
            <div class="left">
                <p>GET /candidater/</p>
            </div>
            <div class="right">
                <p>Récupère une candidature par ID</p>
            </div>
        </div>
        <div id="put">
            <div class="left">
                <p>PATCH /candidater/</p>
            </div>
            <div class="right">
                <p>Met à jour une candidature par ID</p>
            </div>
        </div>
        <div id="delete">
            <div class="left">
                <p>DELETE /candidater/</p>
            </div>
            <div class="right">
                <p>Supprime une candidature par ID</p>
            </div>
        </div>
        <span style="padding-bottom: 30px; display:flex;"></span>
    </section>

</body>

</html>

<?php include("footer.php") ?>