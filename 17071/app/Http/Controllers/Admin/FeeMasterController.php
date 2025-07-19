<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Requests\FeeMasterRequest;
use App\Models\FeeMaster;

class FeeMasterController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $req)
    {
        $query = FeeMaster::query();
        if($req->month){
            $query->where("month", $req->month);
        }
        if($req->class){
            $query->where("class", $req->class);
        }
        if($req->feeType){
            $query->where("feeType", $req->feeType);
        }
        if ($req->fee) {
            $query->where("fee", "LIKE", "%{$req->fee}%");
        }
        $fees = $query->orderBy('class')
      ->orderByRaw("FIELD(month, 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December')")->get();
        return view('admin.fee-master',compact('fees'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(FeeMasterRequest $req)
    {
        $adta = FeeMaster::create(array_filter($req->all()));
        return response()->json(['response'=>true,'msg'=> 'Fee Added Successfully']);
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
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(FeeMasterRequest $req, string $id)
    {
        $adta = FeeMaster::findOrFail($id)->update(array_filter($req->all()));
        return response()->json(['response'=>true,'msg'=> 'Fee Updated Successfully']);
    }

    public function duplicateFee($id)
    {
        $originalFee = FeeMaster::findOrFail($id);
        $newFee = $originalFee->replicate();
        $newFee->created_at = now();
        $newFee->updated_at = now();
        $newFee->save();
        return redirect()->back()->with(bindMsg( 'Fee record duplicated successfully!','success'));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $adta = FeeMaster::findOrFail($id)->delete();
        return back()->with(bindMsg('Fee Deleted SuccessFully','success'));

    }
}
