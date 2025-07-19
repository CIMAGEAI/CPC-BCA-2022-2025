<?php

namespace App\Http\Controllers\Admin\Master;

use App\Http\Controllers\Controller;
use App\Http\Requests\CityRequest;
use App\Models\City;
use App\Scopes\BlockStatusScope;
use Illuminate\Http\Request;

class CityController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $req)
    {
        $query = City::with('state.country');

        if ($req->name) {
            $query->where('name',  $req->name);
        }
        if ($req->state_id) {
            $query->whereHas('state', function($q) use ($req) {
                $q->where('id', $req->state_id);
            });
        }
        if ($req->country_id) {
            $query->whereHas('state.country', function($q) use ($req) {
                $q->where('id', $req->country_id);
            });
        }
        if ($req->status) {
            $query->where('status', $req->status);
        }

        $cities = $query->withoutGlobalScope(BlockStatusScope::class)->paginate(PAGINATE_LIMIT);

        return view('admin.master.city', compact('cities'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return view('admin.master.city');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CityRequest $req)
    {
       City::create($req->all());
       return back()->with(bindMsg('City added successfully','success'));
    }

    /**
     * Display the specified resource.
     */
    public function show(CityRequest $req)
    {

    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit( $id)
    {

        $city = City::with('state.country')->withoutGlobalScope(BlockStatusScope::class)->findOrFail($id);
        return view('admin.master.city',compact('city'));

    }

    /**
     * Update the specified resource in storage.
     */
    public function update(CityRequest $req, $id)
    {
        $city = City::with('state.country')->findOrFail($id);
        $city->update(array_filter($req->all()));
        return back()->with(bindMsg('City updated successfully','success'));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $city = City::with('state.country')->withoutGlobalScope(BlockStatusScope::class)->findOrFail($id);
        $city->delete();
        return back()->with(bindMsg('City deleted successfully','success'));
    }

    public function cityStatus(Request $req){
            $city = City::withoutGlobalScope(BlockStatusScope::class)->where('id',$req->id)->first();
            if(!$city){
                return response()->json(['response' => false, 'msg' => 'City Not found']);
            }
            $city->status = $req->status;
            $city->save();
            dd($req->all());
            return response()->json(['response' => true, 'msg' => 'City updated successfully!!']);
    }
}
