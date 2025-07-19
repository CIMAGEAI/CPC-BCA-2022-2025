<?php

namespace App\Http\Controllers\Admin\Master;

use App\Http\Controllers\Controller;
use App\Http\Requests\StateRequest;
use App\Models\State;
use App\Scopes\BlockStatusScope;
use Exception;
use Illuminate\Http\Request;

class StateController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $req)
    {

        $query = State::with('country');

        if ($req->input('status')) {
            $query->where('status', $req->status);
        }

        if ($req->input('name')) {
            $query->where('name', $req->name);
        }

        if ($req->input('country_id')) {
            $query->whereHas('country', function($q) use ($req) {
                $q->where('id', $req->country_id);
            });
        }

        $states = $query->withoutGlobalScope(BlockStatusScope::class)->paginate(PAGINATE_LIMIT);

        return view('admin.master.state', compact('states'));

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
    public function store(StateRequest $req)
    {

        State::create(array_filter($req->all()));
        return response()->json(['response' => true, 'msg' => 'State Created Successfully']);
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
    public function update(StateRequest $req, string $id)
    {

        $state = State::withoutGlobalScope(BlockStatusScope::class)->findOrFail($id);
        $state->update(array_filter($req->all()));
        return response()->json(['response' => true, 'msg' => 'State Updated Successfully']);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            State::withoutGlobalScope(BlockStatusScope::class)->findOrFail($id)->delete();
            return back()->with(bindMsg('Country Deleted Successfully!', 'success'));
        } catch (Exception $e) {
            return back()->with(bindMsg($e->getMessage(), 'error'));
        }
    }
}
