<?php
session_start();
include('./db_connect.php');

// Ensure that the user is a student
if ($_SESSION['role'] != 'student') {
    header("Location: index.php");
    exit;
}

// Fetch the list of faculty members
$query = "SELECT id, name FROM users WHERE role = 'faculty'";
$result = $conn->query($query);

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $faculty_id = $_POST['faculty_id'];
    $rating = $_POST['rating'];

    // Insert rating into the database
    $student_id = $_SESSION['login_id'];
    $insert_query = $conn->prepare("INSERT INTO ratings (student_id, faculty_id, rating) VALUES (?, ?, ?)");
    $insert_query->bind_param("iii", $student_id, $faculty_id, $rating);
    $insert_query->execute();

    $_SESSION['message'] = "Your rating has been submitted.";
    header("Location: rate_faculty.php");
    exit;
}
?>

<!DOCTYPE html>
<html lang="en">
<?php include 'header.php'; ?>
<body class="hold-transition bg-white">
    <h2><b>Rate Faculty</b></h2>

    <?php if (isset($_SESSION['message'])): ?>
        <div class="alert alert-success"><?php echo $_SESSION['message']; unset($_SESSION['message']); ?></div>
    <?php endif; ?>

    <form action="rate_faculty.php" method="POST">
        <div class="form-group">
            <label for="faculty">Choose Faculty:</label>
            <select class="form-control" name="faculty_id" required>
                <?php while ($faculty = $result->fetch_assoc()): ?>
                    <option value="<?php echo $faculty['id']; ?>"><?php echo $faculty['name']; ?></option>
                <?php endwhile; ?>
            </select>
        </div>

        <div class="form-group">
            <label for="rating">Rate Faculty:</label><br>
            <input type="radio" name="rating" value="1" required> 1
            <input type="radio" name="rating" value="2"> 2
            <input type="radio" name="rating" value="3"> 3
            <input type="radio" name="rating" value="4"> 4
            <input type="radio" name="rating" value="5"> 5
        </div>

        <button type="submit" class="btn btn-primary">Submit Rating</button>
    </form>
</body>
</html>
