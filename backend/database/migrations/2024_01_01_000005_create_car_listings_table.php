<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('car_listings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('make', 100);
            $table->string('model', 100);
            $table->year('year');
            $table->string('mileage', 50);
            $table->decimal('price', 12, 2);
            $table->enum('fuel_type', ['petrol', 'diesel', 'electric', 'hybrid'])->default('petrol');
            $table->enum('transmission', ['automatic', 'manual'])->default('automatic');
            $table->string('location', 255);
            $table->text('description')->nullable();
            $table->boolean('is_featured')->default(false);
            $table->enum('status', ['active', 'sold', 'expired'])->default('active');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('car_listings');
    }
};
