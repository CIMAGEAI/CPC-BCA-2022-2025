<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('students', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('father_name');
            $table->string('admission_no')->unique();
            $table->integer('roll_no');
            $table->string('class');
            $table->date('dob')->nullable();
            $table->enum('gender', ['male', 'female', 'other']);
            $table->string('category')->nullable();
            $table->string('mobile_no')->nullable();
            $table->string('second_mobile_no')->nullable();
            $table->string('email')->nullable();
            $table->string('religion')->nullable();
            $table->string('cast')->nullable();
            $table->string('address')->nullable();
            $table->string('pincode')->nullable();
            $table->string('image')->nullable();
            $table->date('admission_date')->nullable();
            $table->enum('status', ['Active', 'Blocked'])->default('Active');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('students');
    }
};
