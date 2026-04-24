<?php

namespace App\Http\Controllers;

use OpenApi\Attributes as OA;

#[OA\Info(
    title: 'Language School Management API',
    version: '1.0.0',
    description: 'RESTful API for managing a private language school. Includes authentication, role-based access control, student management, course management, payments, and more.',
    contact: new OA\Contact(email: 'admin@ecole-langues.com', name: 'API Support')
)]
#[OA\Server(url: '/api', description: 'API Server')]
#[OA\SecurityScheme(
    securityScheme: 'bearerAuth',
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'JWT'
)]
#[OA\Tag(name: 'Auth', description: 'Authentication endpoints')]
#[OA\Tag(name: 'Users', description: 'User management endpoints')]
#[OA\Tag(name: 'Languages', description: 'Language management endpoints')]
#[OA\Tag(name: 'Levels', description: 'Level management endpoints')]
#[OA\Tag(name: 'Groups', description: 'Group management endpoints')]
#[OA\Tag(name: 'Courses', description: 'Course management endpoints')]
#[OA\Tag(name: 'Assignments', description: 'Assignment management endpoints')]
#[OA\Tag(name: 'Exams', description: 'Exam management endpoints')]
#[OA\Tag(name: 'Grades', description: 'Grade management endpoints')]
#[OA\Tag(name: 'Absences', description: 'Absence tracking endpoints')]
#[OA\Tag(name: 'Payments', description: 'Payment management endpoints')]
#[OA\Tag(name: 'Announcements', description: 'Announcement management endpoints')]
#[OA\Tag(name: 'Timetable', description: 'Timetable management endpoints')]
#[OA\Tag(name: 'Registrations', description: 'Registration management endpoints')]
abstract class Controller
{
    /**
     * Return a standardized success response.
     */
    protected function success($data = null, string $message = 'Success', int $code = 200)
    {
        return response()->json([
            'success' => true,
            'message' => $message,
            'data' => $data,
        ], $code);
    }

    /**
     * Return a standardized error response.
     */
    protected function error(string $message = 'Error', int $code = 400, $errors = null)
    {
        $response = [
            'success' => false,
            'message' => $message,
        ];

        if ($errors) {
            $response['errors'] = $errors;
        }

        return response()->json($response, $code);
    }
}
