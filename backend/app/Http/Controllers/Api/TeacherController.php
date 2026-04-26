<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class TeacherController extends Controller
{
    public function uploadCV(Request $request): JsonResponse
    {
        $request->validate([
            'cv' => ['required', 'file', 'mimes:pdf', 'max:5120'], // Max 5MB
        ]);

        $user = auth()->user();
        
        if (!$user->hasRole('teacher')) {
            return $this->error('Only teachers can upload a CV', 403);
        }

        $profile = $user->teacherProfile()->firstOrCreate(['user_id' => $user->id]);

        if ($profile->cv_path) {
            Storage::disk('public')->delete($profile->cv_path);
        }

        $path = $request->file('cv')->store('cvs', 'public');
        $profile->update(['cv_path' => $path]);

        return $this->success(new UserResource($user->load('teacherProfile')), 'CV uploaded successfully');
    }

    public function getProfile(): JsonResponse
    {
        return $this->success(new UserResource(auth()->user()->load('teacherProfile')));
    }
}
