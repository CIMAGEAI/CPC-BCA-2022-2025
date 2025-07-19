<?php

namespace App\Utils;

use Illuminate\Support\Facades\Log;

class HandleException
{
    public static function storeError($error, $controller = '', $lineNo = '')
    {
        if (isDebug()) {
            Log::error($error . '-' . $controller . '-' . $lineNo);
        }
    }
}
