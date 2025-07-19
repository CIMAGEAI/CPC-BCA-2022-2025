<?php

namespace App\Models;

use App\Scopes\BlockStatusScope;
use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    protected $fillable = ['name', 'father_name', 'admission_no', 'roll_no', 'class', 'dob', 'gender', 'category', 'mobile_no', 'second_mobile_no', 'email', 'religion', 'cast', 'address', 'pincode', 'image', 'status','admission_date'];
    protected static function boot()
    {
        parent::boot();
        static::addGlobalScope(new BlockStatusScope());
        static::creating(function ($student) {
            if (empty($student->admission_no)) {
                $student->admission_no = self::generateAdmissionNumber();
            }
        });
    }
    private static function generateAdmissionNumber()
    {
        $lastStudent = self::withoutGlobalScope(BlockStatusScope::class)
            ->where('admission_no', 'LIKE', 'TOWN-%')
            ->orderBy('id', 'desc')
            ->first();

        if ($lastStudent && preg_match('/TOWN-(\d+)/', $lastStudent->admission_no, $matches)) {
            $sequence = (int) $matches[1] + 1;
        } else {
            $sequence = 1;
        }

        return 'TOWN-' . str_pad($sequence, 3, '0', STR_PAD_LEFT);
    }

    protected $casts = [
        'dob' => 'datetime',
        'admission_date' => 'datetime',
    ];
}
