<?php

namespace Database\Seeders;

use App\Models\Language;
use App\Models\Level;
use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DemoDataSeeder extends Seeder
{
    public function run(): void
    {
        // ── Admin User ──────────────────────────────────────
        $admin = User::firstOrCreate(
            ['email' => 'admin@ecole.com'],
            [
                'name' => 'Admin User',
                'first_name' => 'Admin',
                'last_name' => 'System',
                'password' => Hash::make('password'),
                'phone' => '+212600000001',
                'is_active' => true,
            ]
        );
        $admin->roles()->syncWithoutDetaching(Role::where('name', 'admin')->pluck('id'));

        // ── Director ────────────────────────────────────────
        $director = User::firstOrCreate(
            ['email' => 'director@ecole.com'],
            [
                'name' => 'Mohamed Alami',
                'first_name' => 'Mohamed',
                'last_name' => 'Alami',
                'password' => Hash::make('password'),
                'phone' => '+212600000002',
                'is_active' => true,
            ]
        );
        $director->roles()->syncWithoutDetaching(Role::where('name', 'director')->pluck('id'));

        // ── Teachers ────────────────────────────────────────
        $teacher1 = User::firstOrCreate(
            ['email' => 'teacher1@ecole.com'],
            [
                'name' => 'Sarah Martin',
                'first_name' => 'Sarah',
                'last_name' => 'Martin',
                'password' => Hash::make('password'),
                'phone' => '+212600000003',
                'is_active' => true,
            ]
        );
        $teacher1->roles()->syncWithoutDetaching(Role::where('name', 'teacher')->pluck('id'));
        $teacher1->teacherProfile()->firstOrCreate([
            'specialization' => 'English Language',
            'bio' => 'Certified English teacher with 5 years of experience.',
            'hire_date' => '2024-09-01',
            'hourly_rate' => 150.00,
            'contract_type' => 'full-time',
        ]);

        $teacher2 = User::firstOrCreate(
            ['email' => 'teacher2@ecole.com'],
            [
                'name' => 'Pierre Dupont',
                'first_name' => 'Pierre',
                'last_name' => 'Dupont',
                'password' => Hash::make('password'),
                'phone' => '+212600000004',
                'is_active' => true,
            ]
        );
        $teacher2->roles()->syncWithoutDetaching(Role::where('name', 'teacher')->pluck('id'));
        $teacher2->teacherProfile()->firstOrCreate([
            'specialization' => 'French Language',
            'bio' => 'Native French speaker with DALF certification.',
            'hire_date' => '2023-09-01',
            'hourly_rate' => 180.00,
            'contract_type' => 'full-time',
        ]);

        // ── Accountant ──────────────────────────────────────
        $accountant = User::firstOrCreate(
            ['email' => 'accountant@ecole.com'],
            [
                'name' => 'Fatima Benali',
                'first_name' => 'Fatima',
                'last_name' => 'Benali',
                'password' => Hash::make('password'),
                'phone' => '+212600000005',
                'is_active' => true,
            ]
        );
        $accountant->roles()->syncWithoutDetaching(Role::where('name', 'accountant')->pluck('id'));

        // ── Secretary ───────────────────────────────────────
        $secretary = User::firstOrCreate(
            ['email' => 'secretary@ecole.com'],
            [
                'name' => 'Laila Bensouda',
                'first_name' => 'Laila',
                'last_name' => 'Bensouda',
                'password' => Hash::make('password'),
                'phone' => '+212600000006',
                'is_active' => true,
            ]
        );
        $secretary->roles()->syncWithoutDetaching(Role::where('name', 'secretary')->pluck('id'));

        // ── Students ────────────────────────────────────────
        $students = [];
        $studentData = [
            ['Ahmed', 'Khalil', 'ahmed@student.com'],
            ['Yasmine', 'Ouazzani', 'yasmine@student.com'],
            ['Omar', 'Tazi', 'omar@student.com'],
            ['Lina', 'Fassi', 'lina@student.com'],
        ];

        foreach ($studentData as $data) {
            $student = User::firstOrCreate(
                ['email' => $data[2]],
                [
                    'name' => "{$data[0]} {$data[1]}",
                    'first_name' => $data[0],
                    'last_name' => $data[1],
                    'password' => Hash::make('password'),
                    'is_active' => true,
                ]
            );
            $student->roles()->syncWithoutDetaching(Role::where('name', 'student')->pluck('id'));
            $students[] = $student;
        }

        // ── Parent ──────────────────────────────────────────
        $parent = User::firstOrCreate(
            ['email' => 'parent@ecole.com'],
            [
                'name' => 'Hassan Khalil',
                'first_name' => 'Hassan',
                'last_name' => 'Khalil',
                'password' => Hash::make('password'),
                'phone' => '+212600000010',
                'is_active' => true,
            ]
        );
        $parent->roles()->syncWithoutDetaching(Role::where('name', 'parent')->pluck('id'));
        $parent->children()->syncWithoutDetaching([$students[0]->id]);

        // ── Languages & Levels ──────────────────────────────
        $english = Language::firstOrCreate(['code' => 'EN'], ['name' => 'English', 'code' => 'EN', 'description' => 'English Language', 'is_active' => true]);
        $french = Language::firstOrCreate(['code' => 'FR'], ['name' => 'French', 'code' => 'FR', 'description' => 'French Language', 'is_active' => true]);
        $spanish = Language::firstOrCreate(['code' => 'ES'], ['name' => 'Spanish', 'code' => 'ES', 'description' => 'Spanish Language', 'is_active' => true]);

        $cefr = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
        foreach ([$english, $french, $spanish] as $lang) {
            foreach ($cefr as $i => $level) {
                Level::firstOrCreate(
                    ['name' => $level, 'language_id' => $lang->id],
                    ['description' => "{$level} - {$lang->name}", 'order' => $i, 'is_active' => true]
                );
            }
        }

        // ── Groups ──────────────────────────────────────────
        $enA1 = Level::where('name', 'A1')->where('language_id', $english->id)->first();
        $frB1 = Level::where('name', 'B1')->where('language_id', $french->id)->first();

        $group1 = \App\Models\Group::firstOrCreate(
            ['name' => 'EN-A1-G1', 'level_id' => $enA1->id],
            ['teacher_id' => $teacher1->id, 'max_students' => 15, 'academic_year' => '2025-2026', 'status' => 'active']
        );
        $group1->students()->syncWithoutDetaching([
            $students[0]->id => ['enrolled_at' => '2025-09-15', 'status' => 'active'],
            $students[1]->id => ['enrolled_at' => '2025-09-15', 'status' => 'active'],
        ]);

        $group2 = \App\Models\Group::firstOrCreate(
            ['name' => 'FR-B1-G1', 'level_id' => $frB1->id],
            ['teacher_id' => $teacher2->id, 'max_students' => 12, 'academic_year' => '2025-2026', 'status' => 'active']
        );
        $group2->students()->syncWithoutDetaching([
            $students[2]->id => ['enrolled_at' => '2025-09-15', 'status' => 'active'],
            $students[3]->id => ['enrolled_at' => '2025-09-15', 'status' => 'active'],
        ]);

        // ── Courses ─────────────────────────────────────────
        $course1 = \App\Models\Course::firstOrCreate(
            ['title' => 'English Foundations', 'group_id' => $group1->id],
            ['description' => 'Beginner English course', 'teacher_id' => $teacher1->id, 'start_date' => '2025-09-15', 'end_date' => '2026-01-15', 'status' => 'active']
        );
        $course2 = \App\Models\Course::firstOrCreate(
            ['title' => 'French Intermediate', 'group_id' => $group2->id],
            ['description' => 'Intermediate French conversation course', 'teacher_id' => $teacher2->id, 'start_date' => '2025-09-15', 'end_date' => '2026-01-15', 'status' => 'active']
        );

        // ── Timetable ───────────────────────────────────────
        \App\Models\Timetable::firstOrCreate(
            ['group_id' => $group1->id, 'day_of_week' => 'monday', 'start_time' => '09:00'],
            ['course_id' => $course1->id, 'teacher_id' => $teacher1->id, 'end_time' => '11:00', 'room' => 'Room 101', 'academic_year' => '2025-2026', 'is_active' => true]
        );
        \App\Models\Timetable::firstOrCreate(
            ['group_id' => $group1->id, 'day_of_week' => 'wednesday', 'start_time' => '09:00'],
            ['course_id' => $course1->id, 'teacher_id' => $teacher1->id, 'end_time' => '11:00', 'room' => 'Room 101', 'academic_year' => '2025-2026', 'is_active' => true]
        );
        \App\Models\Timetable::firstOrCreate(
            ['group_id' => $group2->id, 'day_of_week' => 'tuesday', 'start_time' => '14:00'],
            ['course_id' => $course2->id, 'teacher_id' => $teacher2->id, 'end_time' => '16:00', 'room' => 'Room 202', 'academic_year' => '2025-2026', 'is_active' => true]
        );

        // ── Announcements ───────────────────────────────────
        \App\Models\Announcement::firstOrCreate(
            ['title' => 'Welcome to the 2025-2026 Academic Year'],
            ['content' => 'We are excited to welcome all students to the new academic year. Classes begin September 15th.', 'author_id' => $director->id, 'target_audience' => 'all', 'priority' => 'high', 'is_published' => true, 'published_at' => now()]
        );
    }
}
