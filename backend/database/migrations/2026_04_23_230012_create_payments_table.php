<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->enum('type', ['registration_fee', 'tuition', 'salary', 'expense', 'other']);
            $table->decimal('amount', 10, 2);
            $table->string('currency', 3)->default('MAD');
            $table->enum('status', ['pending', 'paid', 'overdue', 'cancelled', 'refunded'])->default('pending');
            $table->enum('payment_method', ['cash', 'bank_transfer', 'check', 'card', 'other'])->nullable();
            $table->string('reference')->nullable();
            $table->text('description')->nullable();
            $table->date('due_date')->nullable();
            $table->date('paid_at')->nullable();
            $table->foreignId('processed_by')->nullable()->constrained('users')->onDelete('set null');
            $table->string('receipt_number')->nullable()->unique();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
