<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use Illuminate\Database\Seeder;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        // ── Create Roles ────────────────────────────────────
        $roles = [
            ['name' => 'admin', 'display_name' => 'Administrator', 'description' => 'Full system access'],
            ['name' => 'director', 'display_name' => 'Director', 'description' => 'School direction and management'],
            ['name' => 'teacher', 'display_name' => 'Teacher', 'description' => 'Teaching and course management'],
            ['name' => 'accountant', 'display_name' => 'Accountant', 'description' => 'Financial management'],
            ['name' => 'secretary', 'display_name' => 'Secretary', 'description' => 'Administrative support and announcements'],
            ['name' => 'student', 'display_name' => 'Student', 'description' => 'Student access'],
            ['name' => 'parent', 'display_name' => 'Parent', 'description' => 'Parent/guardian access'],
        ];

        foreach ($roles as $roleData) {
            Role::firstOrCreate(['name' => $roleData['name']], $roleData);
        }

        // ── Create Permissions ──────────────────────────────
        $permissions = [
            // Users
            ['name' => 'manage_users', 'display_name' => 'Manage Users', 'module' => 'users'],
            ['name' => 'view_users', 'display_name' => 'View Users', 'module' => 'users'],

            // Students
            ['name' => 'manage_students', 'display_name' => 'Manage Students', 'module' => 'students'],
            ['name' => 'view_students', 'display_name' => 'View Students', 'module' => 'students'],

            // Teachers
            ['name' => 'manage_teachers', 'display_name' => 'Manage Teachers', 'module' => 'teachers'],
            ['name' => 'view_teachers', 'display_name' => 'View Teachers', 'module' => 'teachers'],

            // Languages & Levels
            ['name' => 'manage_languages', 'display_name' => 'Manage Languages', 'module' => 'languages'],
            ['name' => 'manage_levels', 'display_name' => 'Manage Levels', 'module' => 'levels'],

            // Groups
            ['name' => 'manage_groups', 'display_name' => 'Manage Groups', 'module' => 'groups'],
            ['name' => 'view_groups', 'display_name' => 'View Groups', 'module' => 'groups'],

            // Courses
            ['name' => 'manage_courses', 'display_name' => 'Manage Courses', 'module' => 'courses'],
            ['name' => 'view_courses', 'display_name' => 'View Courses', 'module' => 'courses'],

            // Assignments
            ['name' => 'manage_assignments', 'display_name' => 'Manage Assignments', 'module' => 'assignments'],
            ['name' => 'view_assignments', 'display_name' => 'View Assignments', 'module' => 'assignments'],

            // Exams & Grades
            ['name' => 'manage_exams', 'display_name' => 'Manage Exams', 'module' => 'exams'],
            ['name' => 'manage_grades', 'display_name' => 'Manage Grades', 'module' => 'grades'],
            ['name' => 'view_grades', 'display_name' => 'View Grades', 'module' => 'grades'],

            // Absences
            ['name' => 'manage_absences', 'display_name' => 'Manage Absences', 'module' => 'absences'],
            ['name' => 'view_absences', 'display_name' => 'View Absences', 'module' => 'absences'],

            // Payments
            ['name' => 'manage_payments', 'display_name' => 'Manage Payments', 'module' => 'payments'],
            ['name' => 'view_payments', 'display_name' => 'View Payments', 'module' => 'payments'],

            // Announcements
            ['name' => 'manage_announcements', 'display_name' => 'Manage Announcements', 'module' => 'announcements'],
            ['name' => 'view_announcements', 'display_name' => 'View Announcements', 'module' => 'announcements'],

            // Timetable
            ['name' => 'manage_timetable', 'display_name' => 'Manage Timetable', 'module' => 'timetable'],
            ['name' => 'view_timetable', 'display_name' => 'View Timetable', 'module' => 'timetable'],

            // Registrations
            ['name' => 'manage_registrations', 'display_name' => 'Manage Registrations', 'module' => 'registrations'],
            ['name' => 'submit_registration', 'display_name' => 'Submit Registration', 'module' => 'registrations'],
        ];

        foreach ($permissions as $permData) {
            Permission::firstOrCreate(['name' => $permData['name']], $permData);
        }

        // ── Assign Permissions to Roles ─────────────────────
        $rolePermissions = [
            'admin' => Permission::all()->pluck('id')->toArray(),
            'director' => Permission::whereIn('module', [
                'students', 'teachers', 'languages', 'levels', 'groups',
                'courses', 'assignments', 'exams', 'grades', 'absences',
                'announcements', 'timetable', 'registrations',
            ])->pluck('id')->toArray(),
            'teacher' => Permission::whereIn('name', [
                'view_students', 'view_groups', 'manage_courses', 'view_courses',
                'manage_assignments', 'manage_exams', 'manage_grades',
                'manage_absences', 'manage_announcements', 'view_timetable',
            ])->pluck('id')->toArray(),
            'secretary' => Permission::whereIn('name', [
                'view_students', 'view_groups', 'view_courses', 'manage_announcements',
                'view_announcements', 'view_timetable', 'view_users',
            ])->pluck('id')->toArray(),
            'accountant' => Permission::whereIn('name', [
                'manage_payments', 'view_payments', 'view_students', 'view_users',
            ])->pluck('id')->toArray(),
            'student' => Permission::whereIn('name', [
                'view_courses', 'view_assignments', 'view_grades',
                'view_announcements', 'view_timetable', 'submit_registration',
            ])->pluck('id')->toArray(),
            'parent' => Permission::whereIn('name', [
                'view_absences', 'view_timetable', 'view_grades', 'view_announcements',
            ])->pluck('id')->toArray(),
        ];

        foreach ($rolePermissions as $roleName => $permissionIds) {
            $role = Role::where('name', $roleName)->first();
            if ($role) {
                $role->permissions()->sync($permissionIds);
            }
        }
    }
}
