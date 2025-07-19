<?php
session_start();

// Avoid PHP warning for undefined key
if (!isset($_SESSION['adminlogin']) || $_SESSION['adminlogin'] !== true) {
    header("Location: user/signin.php");
    exit();
}

include('includes/dbconnection.php');
?>


<!DOCTYPE html>
<html>
<head>
    <title>Admin Dashboard - ONSS</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="bg-light">

<div class="container mt-5">
    <h2 class="mb-4 text-center text-primary">Admin Dashboard - ONSS</h2>

    <div class="mb-4 d-flex justify-content-between">
        <h4>Registered Users</h4>
        <a href="logout.php" class="btn btn-danger">Logout</a>
    </div>

    <?php
    // Fetch all users
    $sql = "SELECT * FROM tbluser";
    $query = $dbh->prepare($sql);
    $query->execute();
    $users = $query->fetchAll(PDO::FETCH_OBJ);
    ?>

    <table class="table table-bordered table-hover bg-white shadow-sm">
        <thead class="table-primary">
            <tr>
                <th>#</th>
                <th>Full Name</th>
                <th>Mobile</th>
                <th>Email</th>
                <th>Reg Date</th>
            </tr>
        </thead>
        <tbody>
            <?php
            $cnt = 1;
            foreach ($users as $user) {
                echo "<tr>
                        <td>{$cnt}</td>
                        <td>{$user->FullName}</td>
                        <td>{$user->MobileNumber}</td>
                        <td>{$user->Email}</td>
                        <td>{$user->RegDate}</td>
                      </tr>";
                $cnt++;
            }
            ?>
        </tbody>
    </table>

    <h4 class="mt-5 mb-3">Uploaded Notes</h4>

    <?php
    // Fetch all notes
    $sql = "SELECT * FROM tblnotes";
    $query = $dbh->prepare($sql);
    $query->execute();
    $notes = $query->fetchAll(PDO::FETCH_OBJ);
    ?>

    <table class="table table-bordered table-hover bg-white shadow-sm">
        <thead class="table-success">
            <tr>
                <th>#</th>
                <th>Note Title</th>
                <th>Description</th>
                <th>Category</th>
                <th>Uploaded By (UserID)</th>
                <th>Uploaded On</th>
                <th>File</th>
                <th>Delete</th>
            </tr>
        </thead>
        <tbody>
            <?php
            $cnt = 1;
            foreach ($notes as $note) {
                echo "<tr>
                        <td>{$cnt}</td>
                        <td>{$note->NoteTitle}</td>
                        <td>{$note->NoteDescription}</td>
                        <td>{$note->Category}</td>
                        <td>{$note->UserID}</td>
                        <td>{$note->NoteDate}</td>
                        <td><a href='user/{$note->NoteFile}' target='_blank'>View</a></td>
                        <td><a href='delete_note.php?id={$note->ID}' class='btn btn-sm btn-danger'>Delete</a></td>
                      </tr>";
                $cnt++;
            }
            ?>
        </tbody>
    </table>
</div>

</body>
</html>
