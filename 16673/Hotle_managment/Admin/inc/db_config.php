<?php

$hname = 'localhost';
$uname = 'root';
$pass = '';
$db = 'hotal_man';
$con = mysqli_connect($hname, $uname, $pass, $db);

if (!$con) {
    die("Cannot connect to Database: " . mysqli_connect_error());
}

// Input sanitization function
function filteration($data)
{
    foreach ($data as $key => $value) {
        $data[$key] = trim($value);
        $data[$key] = stripslashes($value);
        $data[$key] = htmlspecialchars($value);
        $data[$key] = strip_tags($value);
    }
    return $data;
}

// Select query function
function select($sql, $values, $datatypes)
{
    $con = $GLOBALS['con'];
    if ($stmt = mysqli_prepare($con, $sql)) {
        // Correct the reference to $values in the parameter binding
        mysqli_stmt_bind_param($stmt, $datatypes, ...$values);

        // Execute the query
        if (mysqli_stmt_execute($stmt)) {
            $res = mysqli_stmt_get_result($stmt);
            mysqli_stmt_close($stmt);
            return $res;  // Return result set
        } else {
            mysqli_stmt_close($stmt);
            die("Query cannot be executed - select: " . mysqli_stmt_error($stmt)); // More specific error message
        }
    } else {
        die("Query cannot be prepared - select: " . mysqli_error($con)); // More specific error message
    }
   
}


function update($sql, $values, $datatypes)
{
    $con = $GLOBALS['con'];
    if ($stmt = mysqli_prepare($con, $sql)) {
        // Correct the reference to $values in the parameter binding
        mysqli_stmt_bind_param($stmt, $datatypes, ...$values);

        // Execute the query
        if (mysqli_stmt_execute($stmt)) {
            $res = mysqli_stmt_affected_rows($stmt);
            mysqli_stmt_close($stmt);
            return $res;  // Return result set
        } else {
            mysqli_stmt_close($stmt);
            die("Query cannot be executed - update: " ); // More specific error message
        }
    } else {
        die("Query cannot be prepared - update: " ); // More specific error message
    }
   
}

?>