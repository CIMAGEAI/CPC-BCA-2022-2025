<?php

namespace App\Utils;


class UtilityHelper
{
    public static function transformNameToErrorKey($name)
    {
        if (strpos($name, '[') === false && strpos($name, ']') === false) {
            return $name;
        }
        return preg_replace(['/\\[/', '/\\]/'], ['.', ''], $name);
    }

    public static function convertToReadable($input)
    {
        $output = str_replace('_', ' ', $input);
        $output = preg_replace('/(?<=\w)(?=[A-Z])/', ' ', $output);
        $output = ucwords($output);
        return $output;
    }

    public static function convertNameToId($name)
    {
        if (strpos($name, '[') === false && strpos($name, ']') === false) {
            return $name;
        }
        return str_replace(['[', ']'], ['.', ''], $name);
    }

    public static function sendOtp($mobile, $otp)
    {
        return true;
    }

    public static function validateOtpType(): array
    {
        return [
            'REGISTER',
            'FORGET_PASSWORD',
            'LOGIN',
            'ORDERVERIFY',
        ];
    }
}
