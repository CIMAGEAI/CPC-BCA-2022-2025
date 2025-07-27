<?php
require 'config.php'; // Database connection

// Handle delete request
if (isset($_GET['delete_id'])) {
    $delete_id = intval($_GET['delete_id']);
    $stmt = $conn->prepare("DELETE FROM feedback WHERE id = ?");
    $stmt->bind_param("i", $delete_id);
    if ($stmt->execute()) {
        header("Location: ratinghistry.php?msg=deleted");
        exit;
    } else {
        echo "<script>alert('Error deleting feedback.');</script>";
    }
    $stmt->close();
}

// Fetch all feedback records
$sql = "SELECT * FROM feedback ORDER BY created_at DESC";
$result = $conn->query($sql);
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Feedback History</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
    /* General Body Styling */
    body {
        font-family: 'Exo 2', sans-serif;
        background: linear-gradient(180deg, #0f172a 0%, #1e293b 100%);
        margin: 0;
        padding: 0;
        color: #e0e0e0;
        overflow-x: hidden;
    }

    /* Container Styling */
    .container {
        max-width: 1200px;
        margin: 50px auto;
        background: rgba(15, 23, 42, 0.9);
        padding: 40px;
        border-radius: 20px;
        box-shadow: 0 0 30px rgba(59, 130, 246, 0.4), 0 0 60px rgba(236, 72, 153, 0.3);
        border: 1px solid rgba(59, 130, 246, 0.3);
        backdrop-filter: blur(12px);
        position: relative;
        overflow: hidden;
        color: black;
    }

    /* Container Hover Animation */
    .container::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.2), transparent);
        transition: 0.6s;
    }

    .container:hover::before {
        left: 100%;
    }

    /* Heading Styling */
    h2.text-center {
        color: #3b82f6;
        font-size: 32px;
        text-transform: uppercase;
        letter-spacing: 3px;
        text-shadow: 0 0 15px rgba(59, 130, 246, 0.8);
        margin-bottom: 30px;
        position: relative;
        z-index: 1;
    }

    /* Alert Styling */
    .alert-success {
        background: rgba(34, 197, 94, 0.2);
        border: 1px solid #22c55e;
        color: #22c55e;
        padding: 15px;
        border-radius: 10px;
        margin-bottom: 20px;
        text-align: center;
        font-weight: 500;
        box-shadow: 0 0 15px rgba(34, 197, 94, 0.4);
        backdrop-filter: blur(5px);
    }

    /* Table Container */
    .table-container {
        overflow-x: auto;
    }

    /* Table Styling */
    .table {
        width: 100%;
        border-collapse: separate;
        border-spacing: 0;
        background: rgba(20, 20, 50, 0.7);
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
    }

    /* Table Headers */
    .table thead th {
        background: linear-gradient(45deg, #3b82f6, #ec4899);
        color: #fff;
        padding: 15px;
        text-transform: uppercase;
        font-weight: 600;
        letter-spacing: 1px;
        text-shadow: 0 0 5px rgba(255, 255, 255, 0.5);
        border-bottom: 2px solid rgba(59, 130, 246, 0.5);
    }

    /* Table Cells */
    .table td {
        padding: 15px;
        text-align: center;
        color: black;
        border-bottom: 1px solid rgba(59, 130, 246, 0.2);
        transition: all 0.3s ease;
    }

    /* Striped Rows */
    .table-striped tbody tr:nth-child(even) {
        background: rgba(30, 41, 59, 0.3);
    }

    /* Hover Effect on Rows */
    .table tbody tr:hover {
        background: rgba(59, 130, 246, 0.2);
        box-shadow: 0 0 15px rgba(59, 130, 246, 0.4);
    }

    /* No Feedback Message */
    .table td.text-center {
        color: #94a3b8;
        font-style: italic;
        padding: 20px;
    }

    /* Delete Button */
    .btn-danger {
        background: linear-gradient(45deg, #ef4444, #f87171);
        border: none;
        padding: 8px 16px;
        font-size: 14px;
        border-radius: 8px;
        color: #fff;
        text-transform: uppercase;
        letter-spacing: 1px;
        transition: all 0.3s ease;
        box-shadow: 0 0 10px rgba(239, 68, 68, 0.5);
        text-decoration: none;
    }

    .btn-danger:hover {
        background: linear-gradient(45deg, #f87171, #ef4444);
        box-shadow: 0 0 15px rgba(239, 68, 68, 0.8);
        transform: translateY(-2px);
    }

    /* Responsive Design */
    @media (max-width: 768px) {
        .container {
            max-width: 95%;
            padding: 20px;
        }

        h2.text-center {
            font-size: 24px;
        }

        .table thead th,
        .table td {
            padding: 10px;
            font-size: 14px;
        }

        .btn-danger {
            padding: 6px 12px;
            font-size: 12px;
        }
    }
    </style>
</head>

<body>

    <div class="container">
        <h2 class="text-center">Feedback History</h2>
        <?php if (isset($_GET['msg']) && $_GET['msg'] == 'deleted'): ?>
        <div class="alert alert-success">Feedback deleted successfully.</div>
        <?php endif; ?>

        <div class="table-container">
            <table class="table table-bordered table-striped">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Payment ID</th>
                        <th>Rating</th>
                        <th>Feedback</th>
                        <th>Created At</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    <?php if ($result->num_rows > 0): ?>
                    <?php while ($row = $result->fetch_assoc()): ?>
                    <tr>
                        <td><?= htmlspecialchars($row['id']) ?></td>
                        <td><?= htmlspecialchars($row['payment_id']) ?></td>
                        <td><?= htmlspecialchars($row['rating']) ?> ⭐</td>
                        <td><?= nl2br(htmlspecialchars($row['feedback'])) ?></td>
                        <td><?= htmlspecialchars($row['created_at']) ?></td>
                        <td>
                            <a href="ratinghistry.php?delete_id=<?= $row['id'] ?>"
                                onclick="return confirm('Are you sure you want to delete this feedback?');"
                                class="btn btn-danger btn-sm">Delete</a>
                        </td>
                    </tr>
                    <?php endwhile; ?>
                    <?php else: ?>
                    <tr>
                        <td colspan="6" class="text-center">No feedback found</td>
                    </tr>
                    <?php endif; ?>
                </tbody>
            </table>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>

</html>

<?php $conn->close(); ?>