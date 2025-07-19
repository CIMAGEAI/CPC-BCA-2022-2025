<?php

namespace App\Http\Controllers\Admin\Master;

use App\Http\Controllers\Controller;
use App\Http\Requests\PincodeRequest;
use App\Models\Pincode;
use App\Scopes\BlockStatusScope;
use Exception;
use Illuminate\Http\Request;

class PincodeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $req)
    {

        $pincode = Pincode::with('city.state.country');
        if ($req->input('pincode')) {
            $pincode->whereStatus($req->pincode);
        }
        
        if ($req->input('pincode')) {
            $pincode->wherePincode($req->pincode);
        }
        $pincodes =  $pincode->withoutGlobalScope(BlockStatusScope::class)->paginate(PAGINATE_LIMIT);

        return view('admin.master.pincode', compact('pincodes'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return view('admin.master.pincode');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(PincodeRequest $req)
    {

        Pincode::create(array_filter($req->all()));
        return back()->with(bindMsg('Pincode Created Successfully', 'success'));
        //return response()->json(['response' => true, 'msg' => 'Pincode Created Successfully']);
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
        $pincode = Pincode::withoutGlobalScope(BlockStatusScope::class)->with('city.state.country')->findOrFail($id);
        return view('admin.master.pincode', compact('pincode'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(PincodeRequest $req, string $id)
    {
        $pincode = Pincode::withoutGlobalScope(BlockStatusScope::class)->findOrFail($id);
        $pincode->update(array_filter($req->all()));
        return back()->with(bindMsg('Pincode Updated Successfully', 'success'));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            Pincode::withoutGlobalScope(BlockStatusScope::class)->findOrFail($id)->delete();
            return back()->with(bindMsg('Pincode Deleted Successfully!', 'success'));
        } catch (Exception $e) {
            return back()->with(bindMsg($e->getMessage(), 'error'));
        }
    }


    public function pincodeStatus(Request $req)
    {
        $pincode = Pincode::withoutGlobalScope(BlockStatusScope::class)->where('id', $req->id)->first();
        if (!$pincode) {
            return response()->json(['response' => false, 'msg' => 'Pincode Not found']);
        }
        $pincode->status = $req->status;
        $pincode->save();

        return response()->json(['response' => true, 'msg' => 'Pincode updated successfully!!']);
    }
}
