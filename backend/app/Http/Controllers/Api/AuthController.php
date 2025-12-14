<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Mail\PasswordResetEmail;
use App\Mail\WelcomeEmail;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules\Password;

class AuthController extends Controller
{
    public function register(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'full_name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'confirmed', Password::defaults()],
            'phone' => ['required', 'string', 'max:50'],
            'user_type' => ['required', 'in:buyer,seller'],
            'business_name' => ['nullable', 'string', 'max:255'],
            'business_address' => ['nullable', 'string'],
            'specialty' => ['nullable', 'string', 'max:255'],
        ]);

        $user = User::create([
            'full_name' => $validated['full_name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'phone' => $validated['phone'],
            'user_type' => $validated['user_type'],
            'business_name' => $validated['business_name'] ?? null,
            'business_address' => $validated['business_address'] ?? null,
            'specialty' => $validated['specialty'] ?? null,
        ]);

        // Send welcome email
        try {
            Mail::to($user->email)->send(new WelcomeEmail($user));
        } catch (\Exception $e) {
            // Log error but don't fail registration
            \Log::error('Failed to send welcome email: ' . $e->getMessage());
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Registration successful',
            'user' => array_merge($user->toArray(), [
                'profile_photo_url' => $user->profile_photo_url,
            ]),
            'token' => $token,
        ], 201);
    }

    public function login(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => ['required', 'string', 'email'],
            'password' => ['required', 'string'],
        ]);

        if (!Auth::attempt($validated)) {
            return response()->json([
                'message' => 'Invalid credentials',
            ], 401);
        }

        $user = User::where('email', $validated['email'])->firstOrFail();
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Login successful',
            'user' => array_merge($user->toArray(), [
                'profile_photo_url' => $user->profile_photo_url,
            ]),
            'token' => $token,
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logged out successfully',
        ]);
    }

    public function user(Request $request): JsonResponse
    {
        $user = $request->user();
        return response()->json(array_merge($user->toArray(), [
            'profile_photo_url' => $user->profile_photo_url,
        ]));
    }

    public function updateProfile(Request $request): JsonResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'full_name' => ['sometimes', 'string', 'max:255'],
            'phone' => ['sometimes', 'string', 'max:50'],
            'business_name' => ['nullable', 'string', 'max:255'],
            'business_address' => ['nullable', 'string'],
            'specialty' => ['nullable', 'string', 'max:255'],
        ]);

        $user->update($validated);

        return response()->json([
            'message' => 'Profile updated successfully',
            'user' => array_merge($user->fresh()->toArray(), [
                'profile_photo_url' => $user->profile_photo_url,
            ]),
        ]);
    }

    public function uploadPhoto(Request $request): JsonResponse
    {
        $request->validate([
            'photo' => ['required', 'image', 'max:5120'],
        ]);

        $user = $request->user();

        // Clear existing profile photo
        $user->clearMediaCollection('profile_photo');

        // Add new profile photo
        $media = $user->addMediaFromRequest('photo')
            ->toMediaCollection('profile_photo');

        return response()->json([
            'message' => 'Photo uploaded successfully',
            'photo_url' => $media->getUrl(),
            'thumb_url' => $media->getUrl('thumb'),
        ]);
    }

    public function updatePushToken(Request $request): JsonResponse
    {
        $request->validate([
            'expo_push_token' => ['required', 'string'],
        ]);

        $request->user()->update([
            'expo_push_token' => $request->expo_push_token,
        ]);

        return response()->json([
            'message' => 'Push token updated successfully',
        ]);
    }

    public function changePassword(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'current_password' => ['required', 'string'],
            'new_password' => ['required', 'confirmed', Password::defaults()],
        ]);

        $user = $request->user();

        if (!Hash::check($validated['current_password'], $user->password)) {
            return response()->json([
                'message' => 'Current password is incorrect',
            ], 422);
        }

        $user->update([
            'password' => Hash::make($validated['new_password']),
        ]);

        return response()->json([
            'message' => 'Password changed successfully',
        ]);
    }

    public function deleteAccount(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'password' => ['required', 'string'],
        ]);

        $user = $request->user();

        if (!Hash::check($validated['password'], $user->password)) {
            return response()->json([
                'message' => 'Password is incorrect',
            ], 422);
        }

        // Revoke all tokens
        $user->tokens()->delete();

        // Delete the user (or soft delete if using SoftDeletes)
        $user->delete();

        return response()->json([
            'message' => 'Account deleted successfully',
        ]);
    }

    public function forgotPassword(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => ['required', 'string', 'email'],
        ]);

        $user = User::where('email', $validated['email'])->first();

        if (!$user) {
            // Return success even if user not found (security best practice)
            return response()->json([
                'message' => 'If an account exists with this email, you will receive a password reset code.',
            ]);
        }

        // Generate a 6-digit code
        $token = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);

        // Delete any existing tokens for this email
        DB::table('password_reset_tokens')->where('email', $validated['email'])->delete();

        // Store the token (hashed for security)
        DB::table('password_reset_tokens')->insert([
            'email' => $validated['email'],
            'token' => Hash::make($token),
            'created_at' => now(),
        ]);

        // Send the email
        try {
            Mail::to($user->email)->send(new PasswordResetEmail($user, $token));
        } catch (\Exception $e) {
            \Log::error('Failed to send password reset email: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to send email. Please try again later.',
            ], 500);
        }

        return response()->json([
            'message' => 'If an account exists with this email, you will receive a password reset code.',
        ]);
    }

    public function resetPassword(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => ['required', 'string', 'email'],
            'token' => ['required', 'string', 'size:6'],
            'password' => ['required', 'confirmed', Password::defaults()],
        ]);

        // Find the token record
        $record = DB::table('password_reset_tokens')
            ->where('email', $validated['email'])
            ->first();

        if (!$record) {
            return response()->json([
                'message' => 'Invalid or expired reset code.',
            ], 422);
        }

        // Check if token is expired (60 minutes)
        if (now()->diffInMinutes($record->created_at) > 60) {
            DB::table('password_reset_tokens')->where('email', $validated['email'])->delete();
            return response()->json([
                'message' => 'Reset code has expired. Please request a new one.',
            ], 422);
        }

        // Verify the token
        if (!Hash::check($validated['token'], $record->token)) {
            return response()->json([
                'message' => 'Invalid reset code.',
            ], 422);
        }

        // Find the user and update password
        $user = User::where('email', $validated['email'])->first();

        if (!$user) {
            return response()->json([
                'message' => 'User not found.',
            ], 404);
        }

        $user->update([
            'password' => Hash::make($validated['password']),
        ]);

        // Delete the used token
        DB::table('password_reset_tokens')->where('email', $validated['email'])->delete();

        // Revoke all existing tokens (log out from all devices)
        $user->tokens()->delete();

        return response()->json([
            'message' => 'Password has been reset successfully. Please login with your new password.',
        ]);
    }
}
