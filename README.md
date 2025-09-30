# OAuth2 Dashboard with Laravel Passport & Next.js

A modern, enterprise-ready OAuth2 authentication system using Laravel Passport as the authorization server and Next.js as the client application with PKCE flow.

## Architecture Overview

- **Laravel Backend**: Acts as the OAuth2 Authorization Server using Passport
- **Next.js Frontend**: SPA client using PKCE (Proof Key for Code Exchange) for secure authentication
- **Permissions**: Spatie Laravel Permission package for role and permission management
- **Security**: httpOnly cookies, automatic token refresh, CSRF protection
- **Development URLs**: `laravel.test` (backend) and `next.test` (frontend)

## Features

- Full OAuth2 Authorization Code Flow with PKCE
- Secure session management with httpOnly cookies
- Automatic token refresh with transparent retry logic
- Role-based access control using Spatie Laravel Permission
- User management with granular permissions
- Active session tracking and revocation
- Activity logging and audit trails
- Modern, responsive dashboard UI with dark mode
- Advanced collapsible sidebar navigation
- Real-time statistics and analytics

## Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Laravel 11+ with PHP 8.2+
- Composer
- Local development environment (Laravel Valet, Herd, or similar)
- MySQL/PostgreSQL database

## Next.js Setup

### 1. Install Dependencies

\`\`\`bash
npm install
# or
yarn install
# or
pnpm install
\`\`\`

### 2. Configure Environment Variables

Copy `.env.example` to `.env.local` and configure:

\`\`\`env
# OAuth2 Configuration - Base URL for Laravel backend
NEXT_PUBLIC_OAUTH_BASE_URL=https://laravel.test

# OAuth2 Client Configuration (get from Laravel)
NEXT_PUBLIC_OAUTH_CLIENT_ID=your-client-id-from-laravel
NEXT_PUBLIC_OAUTH_REDIRECT_URI=https://next.test/auth/callback
\`\`\`

**Note**: The system automatically constructs OAuth2 endpoints from the base URL:
- Authorization: `{BASE_URL}/oauth/authorize`
- Token: `{BASE_URL}/oauth/token`
- User Info: `{BASE_URL}/api/user`
- Logout: `{BASE_URL}/api/auth/logout`

### 3. Run Development Server

\`\`\`bash
npm run dev
# or
yarn dev
# or
pnpm dev
\`\`\`

Visit `https://next.test` (or `http://localhost:3000`)

## Laravel Backend Implementation

Complete guide for setting up the Laravel Passport OAuth2 server with Spatie permissions.

### 1. Install Required Packages

\`\`\`bash
# Install Laravel Passport
composer require laravel/passport

# Install Spatie Laravel Permission
composer require spatie/laravel-permission
\`\`\`

### 2. Publish and Run Migrations

\`\`\`bash
# Publish Spatie config
php artisan vendor:publish --provider="Spatie\Permission\PermissionServiceProvider"

# Run all migrations
php artisan migrate
\`\`\`

### 3. Install Passport

\`\`\`bash
php artisan passport:install
\`\`\`

This will create encryption keys and OAuth2 clients. Save the client ID and secret.

### 4. Configure Passport

#### `config/auth.php`

\`\`\`php
'guards' => [
    'web' => [
        'driver' => 'session',
        'provider' => 'users',
    ],

    'api' => [
        'driver' => 'passport',
        'provider' => 'users',
    ],
],
\`\`\`

#### `app/Models/User.php`

\`\`\`php
<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Passport\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    use HasApiTokens, Notifiable, HasRoles;

    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    /**
     * Get user permissions for API response
     */
    public function getPermissionsAttribute(): array
    {
        return $this->getAllPermissions()->pluck('name')->toArray();
    }

    /**
     * Get user role for API response
     */
    public function getRoleAttribute(): string
    {
        return $this->roles->first()?->name ?? 'viewer';
    }
}
\`\`\`

### 5. Create OAuth2 Client

Create a public client for the Next.js app (PKCE):

\`\`\`bash
php artisan passport:client --public
\`\`\`

When prompted:
- **Name**: Next.js OAuth2 Client
- **Redirect URI**: `https://next.test/auth/callback`

Save the Client ID - you'll need it for the Next.js `.env.local` file.

### 6. Setup Roles and Permissions

Create a seeder to set up initial roles and permissions:

\`\`\`bash
php artisan make:seeder RolesAndPermissionsSeeder
\`\`\`

#### `database/seeders/RolesAndPermissionsSeeder.php`

\`\`\`php
<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolesAndPermissionsSeeder extends Seeder
{
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Create permissions
        $permissions = [
            'read',
            'write',
            'delete',
            'manage-users',
            'manage-roles',
            'view-logs',
            'manage-settings',
        ];

        foreach ($permissions as $permission) {
            Permission::create(['name' => $permission]);
        }

        // Create roles and assign permissions
        $admin = Role::create(['name' => 'admin']);
        $admin->givePermissionTo(Permission::all());

        $editor = Role::create(['name' => 'editor']);
        $editor->givePermissionTo(['read', 'write', 'view-logs']);

        $viewer = Role::create(['name' => 'viewer']);
        $viewer->givePermissionTo(['read']);
    }
}
\`\`\`

Run the seeder:

\`\`\`bash
php artisan db:seed --class=RolesAndPermissionsSeeder
\`\`\`

### 7. API Routes

#### `routes/api.php`

\`\`\`php
<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\SessionController;
use App\Http\Controllers\Api\ActivityLogController;
use App\Http\Controllers\Api\StatsController;

// Public routes
Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/auth/register', [AuthController::class, 'register']);

// Protected routes (require authentication)
Route::middleware('auth:api')->group(function () {
    // Current user
    Route::get('/user', [UserController::class, 'current']);
    
    // Authentication
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::post('/auth/refresh', [AuthController::class, 'refresh']);
    
    // Users management (requires manage-users permission)
    Route::middleware('permission:manage-users')->group(function () {
        Route::get('/users', [UserController::class, 'index']);
        Route::get('/users/{id}', [UserController::class, 'show']);
        Route::put('/users/{id}', [UserController::class, 'update']);
        Route::delete('/users/{id}', [UserController::class, 'destroy']);
    });
    
    // Role and permission management (requires manage-roles permission)
    Route::middleware('permission:manage-roles')->group(function () {
        Route::put('/users/{id}/roles', [UserController::class, 'updateRoles']);
        Route::put('/users/{id}/permissions', [UserController::class, 'updatePermissions']);
    });
    
    // Sessions
    Route::get('/sessions', [SessionController::class, 'index']);
    Route::delete('/sessions/{id}', [SessionController::class, 'destroy']);
    Route::post('/sessions/revoke-all', [SessionController::class, 'revokeAll']);
    
    // Activity logs (requires view-logs permission)
    Route::middleware('permission:view-logs')->group(function () {
        Route::get('/activity-logs', [ActivityLogController::class, 'index']);
        Route::get('/users/{id}/activity-logs', [ActivityLogController::class, 'userLogs']);
    });
    
    // OAuth2 tokens
    Route::get('/oauth/tokens', [AuthController::class, 'tokens']);
    Route::delete('/oauth/tokens/{id}', [AuthController::class, 'revokeToken']);
    Route::post('/oauth/tokens/revoke-all', [AuthController::class, 'revokeAllTokens']);
    
    // Statistics
    Route::get('/stats/dashboard', [StatsController::class, 'dashboard']);
    Route::get('/stats/auth', [StatsController::class, 'auth']);
});
\`\`\`

### 8. Controllers

#### `app/Http/Controllers/Api/AuthController.php`

\`\`\`php
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ActivityLog;

class AuthController extends Controller
{
    /**
     * Logout user and revoke tokens
     */
    public function logout(Request $request)
    {
        $user = $request->user();
        
        // Log activity
        ActivityLog::create([
            'user_id' => $user->id,
            'action' => 'logout',
            'description' => 'User logged out',
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);
        
        // Revoke current access token
        $user->token()->revoke();
        
        return response()->json(['message' => 'Successfully logged out']);
    }
    
    /**
     * Get all tokens for current user
     */
    public function tokens(Request $request)
    {
        $tokens = $request->user()->tokens()
            ->where('revoked', false)
            ->get();
        
        return response()->json($tokens);
    }
    
    /**
     * Revoke a specific token
     */
    public function revokeToken(Request $request, $tokenId)
    {
        $token = $request->user()->tokens()->find($tokenId);
        
        if (!$token) {
            return response()->json(['error' => 'Token not found'], 404);
        }
        
        $token->revoke();
        
        return response()->json(['message' => 'Token revoked']);
    }
    
    /**
     * Revoke all tokens for current user
     */
    public function revokeAllTokens(Request $request)
    {
        $request->user()->tokens()->update(['revoked' => true]);
        
        return response()->json(['message' => 'All tokens revoked']);
    }
}
\`\`\`

#### `app/Http/Controllers/Api/UserController.php`

\`\`\`php
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    /**
     * Get current authenticated user with roles and permissions
     */
    public function current(Request $request)
    {
        $user = $request->user();
        
        return response()->json([
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->roles->first()?->name ?? 'viewer',
            'permissions' => $user->getAllPermissions()->pluck('name')->toArray(),
            'email_verified_at' => $user->email_verified_at,
            'created_at' => $user->created_at,
            'updated_at' => $user->updated_at,
        ]);
    }
    
    /**
     * Get all users (paginated) with roles
     */
    public function index(Request $request)
    {
        $perPage = $request->input('per_page', 15);
        
        $users = User::with('roles')
            ->paginate($perPage);
        
        return response()->json($users);
    }
    
    /**
     * Get user by ID with roles and permissions
     */
    public function show($id)
    {
        $user = User::with('roles', 'permissions')->findOrFail($id);
        
        return response()->json($user);
    }
    
    /**
     * Update user
     */
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);
        
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,' . $id,
        ]);
        
        $user->update($validated);
        
        return response()->json($user);
    }
    
    /**
     * Delete user
     */
    public function destroy($id)
    {
        $user = User::findOrFail($id);
        $user->delete();
        
        return response()->json(['message' => 'User deleted']);
    }
    
    /**
     * Update user roles
     */
    public function updateRoles(Request $request, $id)
    {
        $user = User::findOrFail($id);
        
        $validated = $request->validate([
            'roles' => 'required|array',
            'roles.*' => 'exists:roles,name',
        ]);
        
        $user->syncRoles($validated['roles']);
        
        return response()->json($user->load('roles'));
    }
    
    /**
     * Update user permissions
     */
    public function updatePermissions(Request $request, $id)
    {
        $user = User::findOrFail($id);
        
        $validated = $request->validate([
            'permissions' => 'required|array',
            'permissions.*' => 'exists:permissions,name',
        ]);
        
        $user->syncPermissions($validated['permissions']);
        
        return response()->json($user->load('permissions'));
    }
}
\`\`\`

#### `app/Http/Controllers/Api/SessionController.php`

\`\`\`php
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SessionController extends Controller
{
    /**
     * Get all active sessions for current user
     */
    public function index(Request $request)
    {
        $sessions = DB::table('sessions')
            ->where('user_id', $request->user()->id)
            ->orderBy('last_activity', 'desc')
            ->get()
            ->map(function ($session) {
                return [
                    'id' => $session->id,
                    'ip_address' => $session->ip_address,
                    'user_agent' => $session->user_agent,
                    'last_activity' => $session->last_activity,
                    'is_current' => $session->id === session()->getId(),
                ];
            });
        
        return response()->json($sessions);
    }
    
    /**
     * Revoke a specific session
     */
    public function destroy(Request $request, $id)
    {
        DB::table('sessions')
            ->where('id', $id)
            ->where('user_id', $request->user()->id)
            ->delete();
        
        return response()->json(['message' => 'Session revoked']);
    }
    
    /**
     * Revoke all sessions except current
     */
    public function revokeAll(Request $request)
    {
        DB::table('sessions')
            ->where('user_id', $request->user()->id)
            ->where('id', '!=', session()->getId())
            ->delete();
        
        return response()->json(['message' => 'All other sessions revoked']);
    }
}
\`\`\`

#### `app/Http/Controllers/Api/ActivityLogController.php`

\`\`\`php
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use Illuminate\Http\Request;

class ActivityLogController extends Controller
{
    /**
     * Get all activity logs (paginated)
     */
    public function index(Request $request)
    {
        $perPage = $request->input('per_page', 20);
        
        $logs = ActivityLog::with('user')
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);
        
        return response()->json($logs);
    }
    
    /**
     * Get activity logs for specific user
     */
    public function userLogs(Request $request, $userId)
    {
        $perPage = $request->input('per_page', 20);
        
        $logs = ActivityLog::where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);
        
        return response()->json($logs);
    }
}
\`\`\`

#### `app/Http/Controllers/Api/StatsController.php`

\`\`\`php
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class StatsController extends Controller
{
    /**
     * Get dashboard statistics
     */
    public function dashboard(Request $request)
    {
        return response()->json([
            'total_users' => User::count(),
            'active_sessions' => DB::table('sessions')->count(),
            'auth_requests' => DB::table('oauth_access_tokens')
                ->where('revoked', false)
                ->count(),
            'recent_activities' => ActivityLog::count(),
        ]);
    }
    
    /**
     * Get authentication statistics
     */
    public function auth(Request $request)
    {
        $successfulLogins = ActivityLog::where('action', 'login')
            ->where('created_at', '>=', now()->subDays(30))
            ->count();
            
        $failedLogins = ActivityLog::where('action', 'failed_login')
            ->where('created_at', '>=', now()->subDays(30))
            ->count();
        
        return response()->json([
            'successful_logins' => $successfulLogins,
            'failed_logins' => $failedLogins,
            'token_refreshes' => ActivityLog::where('action', 'token_refresh')
                ->where('created_at', '>=', now()->subDays(30))
                ->count(),
            'active_tokens' => DB::table('oauth_access_tokens')
                ->where('revoked', false)
                ->count(),
        ]);
    }
}
\`\`\`

### 9. Database Migration for Activity Logs

\`\`\`bash
php artisan make:migration create_activity_logs_table
\`\`\`

#### `database/migrations/xxxx_xx_xx_create_activity_logs_table.php`

\`\`\`php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('activity_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('action');
            $table->text('description')->nullable();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->json('metadata')->nullable();
            $table->timestamps();
            
            $table->index(['user_id', 'created_at']);
            $table->index('action');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('activity_logs');
    }
};
\`\`\`

#### `app/Models/ActivityLog.php`

\`\`\`php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ActivityLog extends Model
{
    protected $fillable = [
        'user_id',
        'action',
        'description',
        'ip_address',
        'user_agent',
        'metadata',
    ];

    protected $casts = [
        'metadata' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
\`\`\`

### 10. Configure CORS

#### `config/cors.php`

\`\`\`php
<?php

return [
    'paths' => ['api/*', 'oauth/*'],
    'allowed_methods' => ['*'],
    'allowed_origins' => [
        'https://next.test',
        'http://localhost:3000',
    ],
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => true,
];
\`\`\`

### 11. Run Migrations

\`\`\`bash
php artisan migrate
\`\`\`

### 12. Seed Test Data

\`\`\`bash
php artisan make:seeder UserSeeder
\`\`\`

#### `database/seeders/UserSeeder.php`

\`\`\`php
<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Create admin user
        $admin = User::create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
        ]);
        $admin->assignRole('admin');

        // Create editor user
        $editor = User::create([
            'name' => 'Editor User',
            'email' => 'editor@example.com',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
        ]);
        $editor->assignRole('editor');

        // Create viewer user
        $viewer = User::create([
            'name' => 'Viewer User',
            'email' => 'viewer@example.com',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
        ]);
        $viewer->assignRole('viewer');
    }
}
\`\`\`

Run the seeders:

\`\`\`bash
php artisan db:seed --class=RolesAndPermissionsSeeder
php artisan db:seed --class=UserSeeder
\`\`\`

## Spatie Permission Usage

### Checking Permissions in Controllers

\`\`\`php
// Check if user has permission
if ($request->user()->can('manage-users')) {
    // User has permission
}

// Check if user has role
if ($request->user()->hasRole('admin')) {
    // User is admin
}

// Check multiple permissions
if ($request->user()->hasAnyPermission(['read', 'write'])) {
    // User has at least one permission
}
\`\`\`

### Using Middleware

\`\`\`php
// In routes
Route::middleware(['permission:manage-users'])->group(function () {
    // Routes that require manage-users permission
});

Route::middleware(['role:admin'])->group(function () {
    // Routes that require admin role
});
\`\`\`

### Assigning Roles and Permissions

\`\`\`php
// Assign role to user
$user->assignRole('admin');

// Assign multiple roles
$user->assignRole(['admin', 'editor']);

// Sync roles (removes all existing roles and assigns new ones)
$user->syncRoles(['admin']);

// Give permission to user
$user->givePermissionTo('manage-users');

// Revoke permission
$user->revokePermissionTo('manage-users');

// Sync permissions
$user->syncPermissions(['read', 'write']);
\`\`\`

## Testing the Integration

1. Start Laravel: `php artisan serve` or use Valet/Herd at `laravel.test`
2. Start Next.js: `npm run dev` at `next.test`
3. Visit `https://next.test` (or `http://localhost:3000`)
4. Click "Sign in with OAuth2"
5. You'll be redirected to Laravel's OAuth authorization page
6. Enter credentials (e.g., `admin@example.com` / `password`)
7. Authorize the application
8. You'll be redirected back to Next.js dashboard with full authentication

## Key Features Explained

### Automatic Token Refresh
The API client automatically detects expired tokens and refreshes them before making requests. This happens transparently without user interaction.

### PKCE Flow
The system uses PKCE (Proof Key for Code Exchange) for enhanced security. This eliminates the need for a client secret and protects against authorization code interception attacks.

### Role-Based Access Control
Using Spatie Laravel Permission, the system provides granular control over user permissions. Roles can be assigned to users, and permissions can be checked both in the backend and frontend.

### Session Management
Users can view all active sessions and revoke them individually or all at once. This provides security and control over account access.

### Activity Logging
All important actions are logged with IP address, user agent, and metadata for audit trails and security monitoring.

## Security Considerations

- Always use HTTPS in production
- Keep your OAuth2 client secret secure (not needed for PKCE public clients)
- Implement rate limiting on authentication endpoints
- Use strong password hashing (Laravel does this by default)
- Regularly rotate encryption keys
- Monitor failed login attempts
- Implement CSRF protection (Laravel does this by default)
- Validate redirect URIs strictly
- Use Spatie permissions to restrict sensitive operations
- Log all security-relevant activities
- Implement two-factor authentication for sensitive accounts

## Troubleshooting

### CORS Issues
- Ensure `config/cors.php` includes your Next.js domain
- Check that `supports_credentials` is set to `true`
- Verify the `allowed_origins` array includes both development and production URLs

### Token Exchange Fails
- Verify the client ID matches between Laravel and Next.js
- Check that the redirect URI is exactly the same in both systems
- Ensure PKCE is enabled for the OAuth2 client (use `--public` flag)
- Check Laravel logs: `tail -f storage/logs/laravel.log`

### Session Not Persisting
- Check that cookies are being set with the correct domain
- Verify `sameSite` and `secure` cookie settings in Next.js
- Ensure the Next.js middleware is properly configured
- Check browser console for cookie-related errors

### Permission Denied Errors
- Verify roles and permissions are properly seeded
- Check that the user has the required role/permission
- Clear permission cache: `php artisan permission:cache-reset`
- Verify middleware is applied correctly to routes

### Database Connection Issues
- Check `.env` database credentials in Laravel
- Ensure database server is running
- Run migrations: `php artisan migrate`
- Check database user permissions

## Production Deployment

### Next.js
- Set `NODE_ENV=production`
- Update environment variables with production URLs
- Enable `secure: true` for cookies
- Deploy to Vercel or your preferred platform
- Set up proper domain with SSL certificate
- Configure environment variables in deployment platform

### Laravel
- Run `php artisan config:cache`
- Run `php artisan route:cache`
- Run `php artisan permission:cache-reset`
- Set up proper database (MySQL/PostgreSQL)
- Configure Redis for sessions and cache
- Set up queue workers for background jobs
- Enable HTTPS with valid SSL certificates
- Set `APP_ENV=production` and `APP_DEBUG=false`
- Use strong `APP_KEY` (generate with `php artisan key:generate`)
- Configure proper CORS origins for production domain
- Set up monitoring and logging (Laravel Telescope, Sentry, etc.)

## License

MIT
