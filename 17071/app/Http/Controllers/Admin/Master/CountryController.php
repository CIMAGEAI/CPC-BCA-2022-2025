<?php

namespace App\Http\Controllers\Admin\Master;

use App\Http\Controllers\Controller;
use App\Http\Requests\CountryRequest;
use App\Models\Country;
use App\Models\Pincode;
use App\Scopes\BlockStatusScope;
use Exception;
use Illuminate\Http\Request;

class CountryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function updateStatus(){
        $c = Pincode::withoutGlobalScope(BlockStatusScope::class)->pluck('id');
        Pincode::withoutGlobalScope(BlockStatusScope::class)->whereIn('id', values: $c)->update(['status' => 'Blocked']);
        return 'yes';
    }

    public function index(Request $req)
    {

        $country = Country::query();
        if ($req->input('status')) {
            $country->whereStatus($req->status);
        }
        if ($req->input('name')) {
            $country->whereName($req->name);
        }
        $countries = $country ->withoutGlobalScope(BlockStatusScope::class)->paginate(PAGINATE_LIMIT);
        return view('admin.master.country', compact('countries'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        abort(404);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CountryRequest $req)
    {

        Country::create(array_filter($req->all()));
        return response()->json(['response' => true, 'msg' => 'Country Created Successfully']);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        abort(404);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        abort(404);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(CountryRequest $req, string $id)
    {

        $country = Country::withoutGlobalScope(BlockStatusScope::class)->findOrFail($id);
        $country->update(array_filter($req->all()));
        return response()->json(['response' => true, 'msg' => 'Country Updated Successfully']);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            Country::withoutGlobalScope(BlockStatusScope::class)->findOrFail($id)->delete();
            return back()->with(bindMsg('Country Deleted Successfully!', 'success'));
        } catch (Exception $e) {
            return back()->with(bindMsg($e->getMessage(), 'error'));
        }
    }
}
