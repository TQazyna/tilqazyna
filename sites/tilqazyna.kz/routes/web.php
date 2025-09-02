<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

// Contacts page
Route::get('/contacts', function () {
    return Inertia::render('about');
})->name('contacts');
Route::permanentRedirect('/about', '/contacts');

Route::get('/directors', function () {
    return Inertia::render('directors');
})->name('directors');

Route::get('/structure', function () {
    return Inertia::render('structure');
})->name('structure');

Route::get('/centers', function () {
    return Inertia::render('centers');
})->name('centers');

Route::get('/departments', function () {
    return Inertia::render('departments');
})->name('departments');

Route::get('/main-docs', function () {
    return Inertia::render('main-docs');
})->name('main-docs');

Route::get('/blogs', function () {
    return Inertia::render('blogs');
})->name('blogs');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
