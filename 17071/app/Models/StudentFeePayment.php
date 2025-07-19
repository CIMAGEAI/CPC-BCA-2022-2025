<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StudentFeePayment extends Model
{
    protected $fillable=[
     "student_id",
     "month",
     "fee",
     "class",
     "feeType",
     "other",
     'remark',
     'resiptNo',
     'print'
    ];
    protected static function boot()
    {
        parent::boot();
        static::creating(function ($student) {
            $student->resiptNo = self::generateResiptNo();
        });
    }
    public static function generateResiptNo()
    {
        $latestReceipt = self::count();
        return str_pad($latestReceipt + 1, 6, '0', STR_PAD_LEFT);
    }


    public function student(){
        return $this->belongsTo(Student::class);
    }

}
