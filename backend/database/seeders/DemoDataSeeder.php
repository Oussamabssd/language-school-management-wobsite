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

        // ── Languages & Levels ──────────────────────────────
        // Keeping these as they are structural data
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
    }
}
