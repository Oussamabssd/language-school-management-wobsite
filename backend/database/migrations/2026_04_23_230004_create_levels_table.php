<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('levels', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // A1, A2, B1, B2, C1, C2
            $table->foreignId('language_id')->constrained()->onDelete('cascade');
            $table->text('description')->nullable();
            $table->integer('order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->unique(['name', 'language_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('levels');
    }
};
