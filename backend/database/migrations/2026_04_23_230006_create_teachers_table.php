<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('teacher_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('cv_path')->nullable();
            $table->string('specialization')->nullable();
            $table->text('bio')->nullable();
            $table->date('hire_date')->nullable();
            $table->decimal('hourly_rate', 8, 2)->nullable();
            $table->enum('contract_type', ['full-time', 'part-time', 'freelance'])->default('full-time');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('teacher_profiles');
    }
};
