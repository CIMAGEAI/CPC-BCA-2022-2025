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
        Schema::create('student_fee_payments', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('student_id');
            $table->foreign('student_id')->references('id')->on('students')->onDelete('cascade');
            $table->decimal('fee',20,2)->default(0);
            $table->string('feeType');
            $table->string('month');
            $table->string('class');
            $table->string('other')->nullable();
            $table->text('remark')->nullable();
            $table->text('resiptNo')->nullable(); 
            $table->boolean('print')->default(0);
            $table->string('status')->default('paid'); // pending, paid, due
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('student_fee_payments');
    }
};
