<?php
require_once __DIR__ . '/../config/db.php';

function addBook($title, $author, $category, $isbn, $quantity) {
    global $pdo;
    $stmt = $pdo->prepare("INSERT INTO books (title, author, category, isbn, quantity) VALUES (?, ?, ?, ?, ?)");
    return $stmt->execute([$title, $author, $category, $isbn, $quantity]);
}

function getAllBooks() {
    global $pdo;
    $stmt = $pdo->query("SELECT * FROM books ORDER BY added_on DESC");
    return $stmt->fetchAll();
}
?>
