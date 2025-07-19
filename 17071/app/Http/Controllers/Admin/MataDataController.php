<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\MetaDataRequest;
use App\Models\MetaData;
use App\Scopes\BlockStatusScope;
use Exception;
use Illuminate\Http\Request;

class MataDataController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $req)
    {
        $query = MetaData::query();
        if ($req->name) {
            $query->whereKey($req->name);
        }

        $metadatas = $query->withoutGlobalScope(BlockStatusScope::class)->paginate(PAGINATE_LIMIT);
        return view('admin.meta-data', compact('metadatas'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return view('admin.meta-data');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(MetaDataRequest $req)
    {

        MetaData::create($req->all());
        return response()->json(['response' => true, 'msg' => 'Category Created Successfully']);
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
        abort(404);

    }

    /**
     * Update the specified resource in storage.
     */
    public function update(MetaDataRequest $req, string $id)
    {

        MetaData::withoutGlobalScope(BlockStatusScope::class)->findOrFail($id)->update(array_filter($req->all()));
        return response()->json(['response' => true, 'msg' => 'Metadata Updated Successfully']);


    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            MetaData::withoutGlobalScope(BlockStatusScope::class)->findOrFail($id)->delete();
            return back()->with(bindMsg('MetaData Deleted Successfully!', 'success'));
        } catch (Exception $e) {
            return back()->with(bindMsg($e->getMessage(), 'error'));
        }
    }
}
