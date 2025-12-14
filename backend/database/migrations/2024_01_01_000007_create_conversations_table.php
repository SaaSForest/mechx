<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('conversations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('participant_one_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('participant_two_id')->constrained('users')->onDelete('cascade');
            $table->enum('context_type', ['part_request', 'car_listing']);
            $table->unsignedBigInteger('context_id');
            $table->timestamp('last_message_at')->nullable();
            $table->timestamps();

            $table->unique(['participant_one_id', 'participant_two_id', 'context_type', 'context_id'], 'unique_conversation');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('conversations');
    }
};
