<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\AssetController;
use App\Http\Controllers\Controller;
use App\Models\Admin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Crypt;


class AdminController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $admins = Admin::where('added_by', auth('admin')->user()->id) ->where('id', '!=', auth('admin')->user()->id)->get();
        
        return view('admin.admin', compact('admins'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return view('admin.admin');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $req)
    {


        $data = $req->validate([
            'name' => 'required',
            'password' => 'required',
            'mobile' => 'required|digits:10|numeric|unique:admins,mobile',
            'email' => 'required|unique:admins,email',
            'options' => 'required|array',
            'options.*' => 'required|string',
            'image' => 'nullable|image|mimes:png,jpg,webp|max:2024',
        ]);

        if ($req->options) {
            $jsonData = [];
            foreach ($req->options as  $key => $value) {
                $jsonData[] = ['id' => $key, 'value' => $value];
            }
            $req->merge(['authorization' => $jsonData]);
        }

        if ($req->file('image')) {
            $image = AssetController::uploadResize('admins', $req->image, $req->name . '-' . Admin::max('id'), 300, 300);
            $req->merge(['profile_pic' => $image, 'added_by' => auth('admin')->user()->id]);
        }

        $req->merge(['added_by' => auth('admin')->user()->id]);

        Admin::create($req->all());
        return back()->with(bindMsg('Admin Staff Created Successfully!', 'success'));
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $admin = Admin::findOrFail($id);
        return view('admin.admin', compact('admin'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $req, string $id)
    {

        $data = $req->validate([
            'email' => 'required|email|max:100|unique:admins,email,' . $id,
            'password' => 'nullable',
            'options' => 'required|array',
            'options.*' => 'required|string',
            'name' => 'required|string|max:50',
            'image' => 'nullable|file|mimes:jpg,png,webp|max:1024',
            'mobile' => 'required|digits:10|numeric|unique:admins,mobile,' . $id
        ]);
        if ($req->options) {
            $jsonData = [];
            foreach ($req->options as  $key => $value) {
                $jsonData[] = ['id' => $key, 'value' => $value];
            }
            $req->merge(['authorization' => $jsonData]);
        }

        if ($req->file('image')) {
            $image = AssetController::uploadResize('admins', $req->image, $req->name . '-' . time() . Auth::guard('admin')->user()->id, 300, 300);
            $req->merge(['profile_pic' => $image]);
        }
        Admin::findOrFail($id)->update(array_filter($req->all()));
        return back()->with(bindMsg('Admin Staff Updated Successfully!', 'success'));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $admin =   Admin::findOrFail($id);
        $admin->delete();
        return back()->with(bindMsg('Admin Staff Deleted Successfully!', 'success'));
    }
}
