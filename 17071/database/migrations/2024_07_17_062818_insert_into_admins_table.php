<?php

use App\Models\Admin;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $admin = new Admin();
        $admin->name = 'Admin';
        $admin->password = Hash::make(12345);
        $admin->email = 'admin@gmail.com';
        $admin->mobile = 1234567890;
        $admin->status = 'Active';
        $admin->isSuperAdmin = 1;
        $admin->save();
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
