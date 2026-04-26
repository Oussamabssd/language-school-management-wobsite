<?php

namespace App\Http\Controllers;

use App\Models\TeacherApplication;
use App\Models\User;
use App\Models\Role;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class TeacherApplicationController extends Controller
{
    // Public endpoint to apply
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|unique:teacher_applications,email|unique:users,email',
            'phone' => 'required|string|max:20',
            'specialization' => 'required|string|max:255',
            'cv' => 'required|file|mimes:pdf|max:5120', // 5MB max
        ]);

        $path = $request->file('cv')->store('teacher_applications', 'public');

        $application = TeacherApplication::create([
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'email' => $request->email,
            'phone' => $request->phone,
            'specialization' => $request->specialization,
            'cv_path' => $path,
            'status' => 'pending',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Application submitted successfully',
            'data' => $application
        ], 201);
    }

    // Admin/Secretary: List all applications
    public function index(): JsonResponse
    {
        $applications = TeacherApplication::orderBy('created_at', 'desc')->get()->map(function ($app) {
            $app->cv_url = asset('storage/' . $app->cv_path);
            return $app;
        });

        return response()->json([
            'success' => true,
            'data' => $applications
        ]);
    }

    // Admin/Secretary: Accept application and create teacher account
    public function accept(TeacherApplication $application): JsonResponse
    {
        if ($application->status !== 'pending') {
            return response()->json(['success' => false, 'message' => 'Application already processed'], 400);
        }

        // Generate a random password
        $password = Str::random(10);

        // Create User
        $user = User::create([
            'name' => $application->first_name . ' ' . $application->last_name,
            'first_name' => $application->first_name,
            'last_name' => $application->last_name,
            'email' => $application->email,
            'phone' => $application->phone,
            'password' => Hash::make($password),
            'must_change_password' => true,
            'is_active' => true,
        ]);

        // Assign Teacher role
        $teacherRole = Role::where('name', 'teacher')->first();
        if ($teacherRole) {
            $user->roles()->attach($teacherRole->id);
        }

        // Create Teacher Profile
        // Copy CV from applications to cvs
        $newCvPath = 'cvs/' . basename($application->cv_path);
        Storage::disk('public')->copy($application->cv_path, $newCvPath);

        $user->teacherProfile()->create([
            'specialization' => $application->specialization,
            'cv_path' => $newCvPath,
            'contract_type' => 'full-time', // Default
        ]);

        // Update application status
        $application->update(['status' => 'accepted']);

        // In a real app, send an email to the teacher with their credentials ($user->email, $password)

        return response()->json([
            'success' => true,
            'message' => 'Teacher account created successfully.',
            'data' => [
                'user' => $user,
                'temporary_password' => $password // Sending back so secretary can give it to them or trigger email
            ]
        ]);
    }

    // Admin/Secretary: Reject application
    public function reject(TeacherApplication $application): JsonResponse
    {
        if ($application->status !== 'pending') {
            return response()->json(['success' => false, 'message' => 'Application already processed'], 400);
        }

        $application->update(['status' => 'rejected']);

        return response()->json([
            'success' => true,
            'message' => 'Application rejected successfully.'
        ]);
    }
}
