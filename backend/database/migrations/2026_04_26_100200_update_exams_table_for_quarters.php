<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('exams', function (Blueprint $table) {
            $table->enum('quarter', ['Q1', 'Q2', 'Q3', 'Q4'])->after('group_id');
            $table->time('start_time')->nullable()->after('exam_date');
            $table->time('end_time')->nullable()->after('start_time');
            $table->string('classroom')->nullable()->after('end_time');
            
            // Convert exam_date to date only if it was datetime
            $table->date('exam_date')->change();
            
            // Remove duration_minutes as we have start/end times
            $table->dropColumn('duration_minutes');
        });

        Schema::table('grades', function (Blueprint $table) {
            // Rename columns to match user request if preferred, 
            // but let's keep score/remarks and just add aliases in the model to avoid breaking changes.
            // However, the user specifically asked for 'grade', 'remark', 'teacher_id'.
            // To be safe and compliant, I'll rename them.
            $table->renameColumn('score', 'grade');
            $table->renameColumn('remarks', 'remark');
            $table->renameColumn('graded_by', 'teacher_id');
        });
    }

    public function down(): void
    {
        Schema::table('exams', function (Blueprint $table) {
            $table->dropColumn(['quarter', 'start_time', 'end_time', 'classroom']);
            $table->integer('duration_minutes')->default(60)->after('exam_date');
            $table->datetime('exam_date')->change();
        });

        Schema::table('grades', function (Blueprint $table) {
            $table->renameColumn('grade', 'score');
            $table->renameColumn('remark', 'remarks');
            $table->renameColumn('teacher_id', 'graded_by');
        });
    }
};
