<?php
include("header.php");

session_destroy();

if (!empty($_SESSION)) {
    header("Location: logout.php");
}
?>
<div class="logout">
    <h2>Vous avez été déconnecté avec succès.</h2>
    <p>Si vous n'êtes pas automaquement redirigé vers l'acceuil : <br>
        <a href="../index.php">Cliquez-ici</a>
    </p>
</div>

<script>
    setTimeout(function() {
        window.location.href = "../index.php";
    }, 5000);
</script>
</body>

<?php include("footer.php") ?>