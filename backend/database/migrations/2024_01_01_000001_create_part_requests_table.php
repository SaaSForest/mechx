<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('part_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('car_make', 100);
            $table->string('car_model', 100);
            $table->year('car_year');
            $table->string('engine', 100)->nullable();
            $table->string('part_name', 255);
            $table->text('description')->nullable();
            $table->enum('condition_preference', ['new', 'used', 'any'])->default('any');
            $table->timestamp('offer_deadline')->nullable();
            $table->decimal('budget_min', 10, 2)->nullable();
            $table->decimal('budget_max', 10, 2)->nullable();
            $table->string('location', 255)->nullable();
            $table->enum('urgency', ['flexible', 'standard', 'urgent'])->default('standard');
            $table->enum('status', ['active', 'pending', 'completed', 'cancelled'])->default('active');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('part_requests');
    }
};
