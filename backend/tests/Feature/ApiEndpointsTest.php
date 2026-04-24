<?php

namespace Tests\Feature;

use App\Models\Language;
use App\Models\Role;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ApiEndpointsTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;
    private User $director;
    private User $teacher;
    private User $student;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RolePermissionSeeder::class);

        $this->admin = User::factory()->create();
        $this->admin->roles()->attach(Role::where('name', 'admin')->first());

        $this->director = User::factory()->create();
        $this->director->roles()->attach(Role::where('name', 'director')->first());

        $this->teacher = User::factory()->create();
        $this->teacher->roles()->attach(Role::where('name', 'teacher')->first());

        $this->student = User::factory()->create();
        $this->student->roles()->attach(Role::where('name', 'student')->first());
    }

    // ── Users ───────────────────────────────────────────────

    public function test_admin_can_list_users(): void
    {
        $response = $this->actingAs($this->admin, 'sanctum')
            ->getJson('/api/users');

        $response->assertStatus(200)->assertJsonPath('success', true);
    }

    public function test_non_admin_cannot_list_users(): void
    {
        $response = $this->actingAs($this->student, 'sanctum')
            ->getJson('/api/users');

        $response->assertStatus(403);
    }

    public function test_admin_can_create_user(): void
    {
        $response = $this->actingAs($this->admin, 'sanctum')
            ->postJson('/api/users', [
                'name' => 'New User',
                'first_name' => 'New',
                'last_name' => 'User',
                'email' => 'newuser@test.com',
                'password' => 'password123',
            ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('users', ['email' => 'newuser@test.com']);
    }

    // ── Languages ───────────────────────────────────────────

    public function test_director_can_create_language(): void
    {
        $response = $this->actingAs($this->director, 'sanctum')
            ->postJson('/api/languages', [
                'name' => 'German',
                'code' => 'DE',
                'description' => 'German Language',
            ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('languages', ['code' => 'DE']);
    }

    public function test_director_can_list_languages(): void
    {
        Language::create(['name' => 'English', 'code' => 'EN']);

        $response = $this->actingAs($this->director, 'sanctum')
            ->getJson('/api/languages');

        $response->assertStatus(200)->assertJsonPath('success', true);
    }

    // ── RBAC Tests ──────────────────────────────────────────

    public function test_student_cannot_create_language(): void
    {
        $response = $this->actingAs($this->student, 'sanctum')
            ->postJson('/api/languages', [
                'name' => 'Italian',
                'code' => 'IT',
            ]);

        $response->assertStatus(403);
    }

    public function test_student_can_view_announcements_feed(): void
    {
        $response = $this->actingAs($this->student, 'sanctum')
            ->getJson('/api/announcements-feed');

        $response->assertStatus(200);
    }

    public function test_student_can_submit_registration(): void
    {
        $lang = Language::create(['name' => 'English', 'code' => 'EN']);

        $response = $this->actingAs($this->student, 'sanctum')
            ->postJson('/api/registrations', [
                'user_id' => $this->student->id,
                'language_id' => $lang->id,
                'motivation' => 'I want to learn English',
            ]);

        $response->assertStatus(201);
    }

    public function test_admin_can_toggle_user_status(): void
    {
        $response = $this->actingAs($this->admin, 'sanctum')
            ->patchJson("/api/users/{$this->student->id}/toggle-status");

        $response->assertStatus(200);
        $this->student->refresh();
        $this->assertFalse($this->student->is_active);
    }
}
