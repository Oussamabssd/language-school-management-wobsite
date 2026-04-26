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
        Schema::create('employee_payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->decimal('amount', 10, 2);
            $table->date('payment_date');
            $table->string('month'); // e.g., "2026-04"
            $table->enum('status', ['paid', 'pending'])->default('paid');
            $table->timestamps();
            $table->unique(['user_id', 'month']); // Prevent duplicate payments for the same month
        });

        Schema::create('student_payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('users')->onDelete('cascade');
            $table->decimal('amount', 10, 2);
            $table->date('payment_date');
            $table->string('period'); // e.g., "Q1-2026"
            $table->enum('status', ['paid', 'unpaid'])->default('paid');
            $table->timestamps();
        });

        Schema::create('expenses', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description')->nullable();
            $table->decimal('amount', 10, 2);
            $table->string('category'); // rent, utilities, supplies, etc.
            $table->date('expense_date');
            $table->timestamps();
        });

        Schema::create('receipts', function (Blueprint $table) {
            $table->id();
            $table->string('reference_number')->unique();
            $table->enum('payment_type', ['student', 'employee']);
            $table->unsignedBigInteger('payment_id');
            $table->timestamp('generated_at');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('receipts');
        Schema::dropIfExists('expenses');
        Schema::dropIfExists('student_payments');
        Schema::dropIfExists('employee_payments');
    }
};
