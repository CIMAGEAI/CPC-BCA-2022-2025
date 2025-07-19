<?php

namespace App\Utils;


class SelectionList
{
    public static function statusList()
    {
        return [
            'Active' => 'Active',
            'Blocked' => 'Blocked',
        ];
    }
    public static function sectionList()
    {
        return [
            'class' => 'Class',
            'teacher' => 'Teacher',
        ];
    }
    public static function classList()
    {
        return [
            'NUR' => 'NUR',
            'LKG' => 'LKG',
            'UKG' => 'UKG',
            'One' => 'One',
            'Two' => 'Two',
            'Three' => 'Three',
            'Four' => 'Four',
            'Five' => 'Five',
            'Six' => 'Six',
            'Seven' => 'Seven',
            'Eight' => 'Eight',
            'Nine' => 'Nine',
            'Ten' => 'Ten',
        ];
    }
    public static function monthList()
    {
        return [
            'January' => 'January',
            'February' => 'February',
            'March' => 'March',
            'April' => 'April',
            'May' => 'May',
            'June' => 'June',
            'July' => 'July',
            'August' => 'August',
            'September' => 'September',
            'October' => 'October',
            'November' => 'November',
            'December' => 'December',
            'Other'=> 'Other',
        ];
    }

    public static function feeTypeList()
    {
        return [
            'School Fee' => 'School Fee',
            'Late Fee' => 'Late Fee',
            'Examination Fee' => 'Examination Fee',
            'Development Fee' => 'Development Fee',
            'Other Fee' => 'Other Fee',

        ];
    }


    public static function genderList()
    {
        return ['male' => 'Male', 'female' => 'Female','other'=>'Other'];
    }
    public static function partnerStatusList()
    {
        return ['Pending' => 'Pending', 'Verified' => 'Verified', 'Rejected' => 'Rejected'];
    }




    public static function YesNoList()
    {
        return [
            'Yes' => 'Yes',
            'No' => 'No',
        ];
    }


}
