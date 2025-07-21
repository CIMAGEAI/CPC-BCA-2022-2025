<?php
echo "<h1>📁 Checking XAMPP htdocs folders</h1>";

$htdocs_path = 'C:/xampp/htdocs/';

if (is_dir($htdocs_path)) {
    echo "<h2>Folders in htdocs:</h2>";
    echo "<ul>";
    
    $folders = scandir($htdocs_path);
    foreach ($folders as $folder) {
        if ($folder != '.' && $folder != '..' && is_dir($htdocs_path . $folder)) {
            echo "<li><strong>$folder</strong></li>";
        }
    }
    echo "</ul>";
    
    echo "<h2>Current working directory:</h2>";
    echo "<p>" . getcwd() . "</p>";
    
    echo "<h2>Files in current directory:</h2>";
    echo "<ul>";
    $files = scandir('.');
    foreach ($files as $file) {
        if ($file != '.' && $file != '..') {
            echo "<li>$file</li>";
        }
    }
    echo "</ul>";
    
} else {
    echo "<p>❌ Cannot access htdocs directory</p>";
    echo "<p>Path: $htdocs_path</p>";
}
?> 