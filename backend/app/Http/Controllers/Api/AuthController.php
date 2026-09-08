<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TradingAccount;
use App\Models\User;
use App\Models\ZoneType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    private const DEFAULT_ZONE_TYPES = [
        ['code' => 'OB', 'label' => 'Order Block'],
        ['code' => 'FVG', 'label' => 'Fair Value Gap'],
        ['code' => 'FIBO', 'label' => 'Fibonacci'],
        ['code' => 'OTE', 'label' => 'OTE'],
        ['code' => 'BOS', 'label' => 'BOS'],
        ['code' => 'CHOCH', 'label' => 'CHoCH'],
        ['code' => 'LIQUIDITY', 'label' => 'Liquidity'],
    ];

    public function register(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8'],
        ]);

        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
        ]);

        // New accounts start with a default trading account and the standard
        // zone-type set so the analysis form works immediately, with no
        // manual seeding step required (there is no shell access on Render's
        // free tier).
        $account = TradingAccount::create([
            'user_id' => $user->id,
            'name' => 'Compte principal',
            'currency' => 'USD',
            'starting_balance' => 0,
            'is_default' => true,
        ]);

        foreach (self::DEFAULT_ZONE_TYPES as $zone) {
            ZoneType::create([
                'user_id' => $user->id,
                'code' => $zone['code'],
                'label' => $zone['label'],
            ]);
        }

        return response()->json([
            'user' => $user,
            'token' => $user->createToken('spa')->plainTextToken,
            'trading_account_id' => $account->id,
        ], 201);
    }

    public function login(Request $request)
    {
        $data = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        $user = User::where('email', $data['email'])->first();

        if (! $user || ! Hash::check($data['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Identifiants incorrects.'],
            ]);
        }

        $account = TradingAccount::where('user_id', $user->id)
            ->where('is_default', true)
            ->first() ?? TradingAccount::where('user_id', $user->id)->first();

        return response()->json([
            'user' => $user,
            'token' => $user->createToken('spa')->plainTextToken,
            'trading_account_id' => $account?->id,
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(null, 204);
    }

    public function me(Request $request)
    {
        return response()->json($request->user());
    }
}
