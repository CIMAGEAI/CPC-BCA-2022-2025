<?php
require('../inc/essentials.php');
require('../inc/db_config.php');
adminLogin();

if (isset($_POST['get_general'])) {
    $q = "SELECT * FROM `setting` WHERE `sr_no`=?";
    $values = [1];
    $res = select($q, $values, "i");
    $data = mysqli_fetch_assoc($res);
    $json_data = json_encode($data);
    echo $json_data;
}

if (isset($_POST['upd_general'])) {
    $frm_data = filteration($_POST);

    // Fixed SQL query: removed the extra comma after `site_about`
    $q = "UPDATE `setting` SET `site_title`=?, `site_about`=? WHERE `sr_no`=?";
    $values = [$frm_data['site_title'], $frm_data['site_about'], 1];
    $res = update($q, $values, 'ssi');
    echo $res;
}

if (isset($_POST['upd_shutdown'])) {
    $frm_data =( $_POST['upd_shutdown']==0) ? 1 : 0;

    // Fixed SQL query: removed the extra comma after `site_about`
    $q = "UPDATE `setting` SET `shutdown`=? WHERE `sr_no`=?";
    $values = [$frm_data, 1];
    $res = update($q, $values, 'ii');
    echo $res;
}

if (isset($_POST['get_contacts'])) {
    $q = "SELECT * FROM `contact_details` WHERE `sr_no`=?";
    $values = [1];
    $res = select($q, $values, "i");
    $data = mysqli_fetch_assoc($res);
    $json_data = json_encode($data);
    echo $json_data;
}

?>