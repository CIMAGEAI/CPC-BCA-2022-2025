<?php

namespace App\Models;

use App\Scopes\BlockStatusScope;
use Illuminate\Support\Facades\Storage;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;

class Admin extends Authenticatable
{
    use HasFactory;

    protected $fillable = ['name', 'email', 'mobile', 'profile_pic', 'password', 'authorization','status','added_by','isSuperAdmin'];


    protected static function boot()
    {
        parent::boot();
        static::addGlobalScope(new BlockStatusScope);
        static::updating(function ($admin) {
            $original = $admin->getOriginal('image');
            $new = $admin->image;
            if ($original !== $new) {
                Storage::delete("public/admins/{$original}");
            }
        });
        static::deleting(function ($admin) {
            if ($admin->image) {
                Storage::delete("public/admins/{$admin->image}");
            }
        });
    }

    public function addedBy()
    {
        return $this->belongsTo(Admin::class, 'added_by', 'id');
    }

    /**
     * Get the admins added by this admin.
     */
    public function addedAdmins()
    {
        return $this->hasMany(Admin::class, 'added_by', 'id');
    }


    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'authorization'=>'array'
        ];
    }
}
