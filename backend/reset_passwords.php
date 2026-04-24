<?php

use App\Models\User;
use Illuminate\Support\Facades\Hash;

require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

User::all()->each(function($user) {
    $user->password = 'password';
    $user->save();
});

echo "All passwords updated to 'password'\n";
