<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\AssetController;
use App\Http\Controllers\Controller;
use App\Models\Admin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;


class AuthController extends Controller
{

    public function authenticate(Request $req)
    {

        if ($req->isMethod('GET')) {
            if (auth('admin')->check()) {
                return redirect(route('admin.dashboard'));
            } else {
                return view('admin.login');
            }
        } elseif ($req->isMethod('POST')) {
            $data = $req->validate([
                'email' => 'required|email|exists:admins,email',
                'password' => 'required|string',
            ]);
            if (Auth::guard('admin')->attempt(['email' => $req->email, 'password' => $req->password], isset($req->remember))) {
                return redirect(route('admin.dashboard'));
            } else {
                return back()->with(bindMsg('Invalid Credentials!', 'error'));
            }
        }
    }


    function profile(Request $req)
    {
        if ($req->isMethod('GET')) {
            return view('admin.profile');
        } elseif ($req->isMethod('PUT')) {
            $data = $req->validate([
                'email' => 'required|email|max:100',
                'password' => 'nullable',
                'name' => 'required|string|max:50',
                'image' => 'nullable|file|mimes:jpg,png,webp|max:1024',
                'mobile' => 'required|digits:10|numeric'
            ]);
            if ($req->file('image')) {
                $image = AssetController::uploadResize('admins', $req->image, $req->name . '-' . Auth::guard('admin')->user()->id, 300, 300);
                $req->merge(['profile_pic' => $image]);
            }
            Admin::findOrFail(Auth::guard('admin')->user()->id)->update(array_filter($req->all()));
            return response()->json(['response' => true, 'msg' => 'Profile Updated Successfully']);
        }
    }
    public function logout()
    {
        Auth::guard('admin')->logout();
        return redirect(route('admin.login'));
    }
}
