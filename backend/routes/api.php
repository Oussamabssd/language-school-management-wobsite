<?php

use App\Http\Controllers\Api\AbsenceController;
use App\Http\Controllers\Api\AnnouncementController;
use App\Http\Controllers\Api\AssignmentController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CourseController;
use App\Http\Controllers\Api\ExamController;
use App\Http\Controllers\Api\GroupController;
use App\Http\Controllers\Api\LanguageController;
use App\Http\Controllers\Api\LevelController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\RegistrationController;
use App\Http\Controllers\Api\TimetableController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// ── Public Auth Routes ─────────────────────────────────────
Route::prefix('auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/register', [AuthController::class, 'register']);
});

// Guest registration & Language selection
Route::post('/registrations', [RegistrationController::class, 'store']);
Route::get('/languages', [LanguageController::class, 'index']);
Route::get('/languages/{languageId}/levels', [LevelController::class, 'byLanguage']);

// ── Authenticated Routes ───────────────────────────────────
Route::middleware('auth:sanctum')->group(function () {

    // Auth
    Route::prefix('auth')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me', [AuthController::class, 'me']);
    });

    // ── Users & Roles (Admin) ──────────────────────────────
    Route::middleware('role:admin')->group(function () {
        Route::apiResource('users', UserController::class);
        Route::patch('/users/{id}/toggle-status', [UserController::class, 'toggleStatus']);
        Route::post('/users/{userId}/roles/{roleId}', [UserController::class, 'assignRole']);
        Route::delete('/users/{userId}/roles/{roleId}', [UserController::class, 'removeRole']);
    });

    // ── Students (Admin, Director) ─────────────────────────
    Route::middleware('role:admin,director')->group(function () {
        Route::get('/students', [UserController::class, 'students']);
    });

    // ── Teachers (Admin, Director) ─────────────────────────
    Route::middleware('role:admin,director')->group(function () {
        Route::get('/teachers', [UserController::class, 'teachers']);
    });

    // ── Languages, Levels, Groups (Director) ───────────────
    Route::middleware('role:admin,director')->group(function () {
        Route::apiResource('languages', LanguageController::class)->except(['index']);
        Route::apiResource('levels', LevelController::class)->except(['index']);

        Route::apiResource('groups', GroupController::class);
        Route::post('/groups/{groupId}/students/{studentId}', [GroupController::class, 'addStudent']);
        Route::delete('/groups/{groupId}/students/{studentId}', [GroupController::class, 'removeStudent']);
    });

    // ── Courses & Assignments (Director, Teacher) ──────────
    Route::middleware('role:admin,director,teacher')->group(function () {
        Route::apiResource('courses', CourseController::class);
        Route::get('/courses/teacher/{teacherId}', [CourseController::class, 'byTeacher']);
        Route::get('/courses/group/{groupId}', [CourseController::class, 'byGroup']);

        Route::apiResource('assignments', AssignmentController::class);
        Route::get('/assignments/course/{courseId}', [AssignmentController::class, 'byCourse']);
    });

    // ── Exams & Grades (Director, Teacher) ──────────────────
    Route::middleware('role:admin,director,teacher')->group(function () {
        Route::apiResource('exams', ExamController::class);
        Route::post('/grades', [ExamController::class, 'storeGrade']);
        Route::put('/grades/{id}', [ExamController::class, 'updateGrade']);
        Route::get('/grades/exam/{examId}', [ExamController::class, 'gradesByExam']);
    });

    // ── Grades (Student view) ──────────────────────────────
    Route::middleware('role:admin,director,teacher,student,parent')->group(function () {
        Route::get('/grades/student/{studentId}', [ExamController::class, 'gradesByStudent']);
    });

    // ── Absences (Teacher, Admin, Director) ─────────────────
    Route::middleware('role:admin,director,teacher')->group(function () {
        Route::apiResource('absences', AbsenceController::class);
        Route::get('/absences/group/{groupId}', [AbsenceController::class, 'byGroup']);
    });

    // ── Absences (Student/Parent view) ─────────────────────
    Route::middleware('role:admin,director,teacher,student,parent')->group(function () {
        Route::get('/absences/student/{studentId}', [AbsenceController::class, 'byStudent']);
    });

    // ── Payments (Accountant, Admin) ────────────────────────
    Route::middleware('role:admin,accountant')->group(function () {
        Route::apiResource('payments', PaymentController::class);
        Route::post('/payments/{id}/pay', [PaymentController::class, 'markAsPaid']);
        Route::post('/payments/{id}/receipt', [PaymentController::class, 'generateReceipt']);
        Route::get('/payments/user/{userId}', [PaymentController::class, 'byUser']);
    });

    // ── Announcements (Admin, Director, Teacher) ────────────
    Route::middleware('role:admin,director,teacher')->group(function () {
        Route::apiResource('announcements', AnnouncementController::class);
    });

    // ── Announcements (All authenticated - read only) ───────
    Route::get('/announcements-feed', [AnnouncementController::class, 'index']);

    // ── Timetable (Director, Admin) ─────────────────────────
    Route::middleware('role:admin,director')->group(function () {
        Route::apiResource('timetables', TimetableController::class);
    });

    // ── Timetable (view for all authenticated) ──────────────
    Route::get('/timetables/group/{groupId}', [TimetableController::class, 'byGroup']);
    Route::get('/timetables/teacher/{teacherId}', [TimetableController::class, 'byTeacher']);

    // ── Registrations (Admin) ───────────────────────────────
    Route::middleware('role:admin')->group(function () {
        Route::get('/registrations', [RegistrationController::class, 'index']);
        Route::get('/registrations/{id}', [RegistrationController::class, 'show']);
        Route::put('/registrations/{id}/accept', [RegistrationController::class, 'accept']);
        Route::put('/registrations/{id}/reject', [RegistrationController::class, 'reject']);
    });
});
