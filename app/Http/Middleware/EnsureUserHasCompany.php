<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class EnsureUserHasCompany
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle($request, Closure $next)
    {
        if ($request->routeIs('company.create','company.store')) {
            if(Auth::user()->company){
                return redirect()->route('dashboard');
            }
            return $next($request);
        } else if (Auth::check() && !Auth::user()->company) {
            return redirect()->route('company.create');
        }

        return $next($request);
    }
}
