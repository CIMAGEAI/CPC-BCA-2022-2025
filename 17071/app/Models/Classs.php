<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Classs extends Model
{
    protected $fillable=[
            'image',
            'title',
            'description',
            'age',
            'type',
            'class'
    ];

     protected static function boot()
    {
        parent::boot();

        static::deleting(function ($class) {
            if ($class->image && Storage::disk('public')->exists('sections/' . $class->image)) {
                Storage::disk('public')->delete('sections/' . $class->image);
            }
        });

        static::updating(function ($class) {
            $oldImage = $class->getOriginal('image');

            if ($class->isDirty('image') && $oldImage && Storage::disk('public')->exists('sections/' . $oldImage)) {
                Storage::disk('public')->delete('sections/' . $oldImage);
            }
        });
    }
}
