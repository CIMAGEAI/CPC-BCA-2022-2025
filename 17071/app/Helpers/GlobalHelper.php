<?php

use Carbon\Carbon;

define('PAGINATE_LIMIT', 10);
define('FACEBOOK_URL', "#");
define('TWITTER_URL', '#');
define('INSTAGRAM_URL', '#');
define('LINKEDIN_URL', '#');
define('PINTEREST_URL', '#');
define('YOUTUBE_URL', '#');
define('TITLE', 'admin dashboard');

if (!function_exists('publicPath')) {
    function publicPath($str = null)
    {
       // $string = config('app.env') == 'local' ? '' : 'public/';
        $string = config('app.env') == 'local' ? '' : '';
        return  config('app.url') .  $string . $str;
    }
}

if (!function_exists('baseUrl')) {
    function baseUrl()
    {
        return  config('app.url');
    }
}

if (!function_exists('isDebug')) {
    function isDebug()
    {
        return  config('app.env') == 'local';
    }
}

if (!function_exists('envIsTesting')) {
    function envIsTesting()
    {
        return  config('app.env') == 'local' || config('app.env') == 'testing';
    }
}
if (!function_exists('hasAuthorization')) {
    function hasAuthorization($key)
    {

        $user = auth('admin')->user();
        if (!$user) {
            return false;
        }
        if (isSuperAdmin()) {
            return true;
        }

        $authorizations = $user->authorization ?? [];
        return in_array($key, array_column($authorizations, 'value'));
    }
}


if (!function_exists('hasManagerAuthorization')) {
    function hasManagerAuthorization($key)
    {

        $user = auth('manager')->user();
        if (!$user) {
            return false;
        }
        if (isSuperManager()) {
            return true;
        }

        $authorizations = $user->authorization ?? [];
        return in_array($key, array_column($authorizations, 'value'));
    }
}

if (!function_exists('isSuperAdmin')) {
    function isSuperAdmin()
    {
        return  auth('admin')->user()->isSuperAdmin == 1 ? true : false;
    }
}

if (!function_exists('isSuperManager')) {
    function isSuperManager()
    {
        return  auth('manager')->user()->isSuperManager == 1 ? true : false;
    }
}


if (!function_exists('bindMsg')) {
    function bindMsg($msg, $class)
    {
        return compact('msg', 'class');
    }
}





if (!function_exists('getStatusColor')) {
    function getStatusColor($status)
    {
        switch ($status) {
            case 'Pending':
                return '<span  class="badge bg-warning">Pending</span>';
            case 'Draft':
                return '<span class="badge bg-warning">Draft</span>';
            case 'Active':
                return '<span class="badge bg-info">Active</span>';
            case 'Verified':
                return '<span class="badge bg-success">Verified</span>';
            case 'Completed':
                return '<span class="badge bg-success">Completed</span>';
            case 'Block':
                return '<span class="badge bg-danger">Blocked</span>';
            case 'Rejected':
                return '<span class="badge bg-danger">Rejected</span>';
            default:
                return '<span class="badge bg-secondary">Unknown</span>';
        }
    }
}
if (!function_exists('getBoolean')) {
    function getBoolean($value)
    {
        switch ($value) {
            case 0:
                return '<span class="badge bg-danger">No</span>';
            case 1:
                return '<span class="badge bg-success">Yes</span>';
            default:
                return '<span class="badge bg-secondary">Unknown</span>';
        }
    }
}
if (!function_exists('ifDefined')) {
    function ifDefined($value)
    {
        return isset($value) ? $value : null;
    }
}

if (!function_exists('getActiveImage')) {
    function getFirstActiveImage($images)
    {
        $activeImages = array_filter($images, function ($item) {
            return $item['active'] === true;
        });

        if (!empty($activeImages)) {
            return reset($activeImages)['image'];
        }
        if (!empty($images)) {
            return $images[0]['image'];
        }
        return null;
    }
}



if (!function_exists('numberFormat')) {
    function numberFormat($number)
    {
        return number_format($number, 2);
    }
}

if (!function_exists('generateDateRangeQueryString')) {
    function generateDateRangeQueryString($range)
    {
        switch ($range) {
            case 'yesterday':
                $start = Carbon::yesterday()->startOfDay();
                $end = Carbon::yesterday()->endOfDay();
                break;
            case 'last_week':
                $start = Carbon::now()->subWeek()->startOfWeek();
                $end = Carbon::now()->subWeek()->endOfWeek();
                break;
            case 'last_month':
                $start = Carbon::now()->subMonth()->startOfMonth();
                $end = Carbon::now()->subMonth()->endOfMonth();
                break;
            case 'last_year':
                $start = Carbon::now()->subYear()->startOfYear();
                $end = Carbon::now()->subYear()->endOfYear();
                break;
            default:
                return '';
        }

        return "?fromDate=" . $start->format('Y-m-d') . "&toDate=" . $end->format('Y-m-d');
    }
}





if (!function_exists('adminAuthList')) {
    function adminAuthList()
    {
        return [
            'Lead History' => 'Lead History',
            'Lead Import Export' => 'Lead Import Export',
            'Lead Source' => 'Lead Source',
            'Manage Lead' => 'Manage Lead',
            'Add Lead' => 'Add Lead',
            'Edit Lead' => 'Edit Lead',
            'Delete Lead' => 'Delete Lead',
            'Assign Lead' => 'Assign Lead',
            'Bulk Assign Lead' => 'Bulk Assign Lead',
        ];
    }
}



if (!function_exists('statusColor')) {
    function statusColor($status)
    {
        switch (strtolower($status)) {
            case 'pending':
                return 'background:#f9fb8d; color:#c5a209;padding:8px 10px; font-size:14px; font-weight:600;border-radius:18px';
            case 'verified':
                return 'background:#d4fec9; color:#076d0d;padding:8px 10px; font-size:14px; font-weight:600;border-radius:18px';
            case 'reject':
            case 'rejected':
                return 'background:#ffbcbc; color:#bb0000;padding:8px 10px; font-size:14px; font-weight:600;border-radius:18px';
            default:
            return 'background:#e3e3e3; color:#333333;padding:8px 10px; font-size:12px; font-weight:600;border-radius:18px';
        }
    }
}




function getOrdinalSuffix($number)
{
    if (!in_array(($number % 100), [11, 12, 13])) {
        switch ($number % 10) {
            case 1:
                return $number . 'st';
            case 2:
                return $number . 'nd';
            case 3:
                return $number . 'rd';
        }
    }
    return $number . 'th';
}
