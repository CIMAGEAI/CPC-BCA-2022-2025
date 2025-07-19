<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FeeMaster extends Model
{
    protected $fillable=[
       "fee","month",'class','feeType'
    ];
}
