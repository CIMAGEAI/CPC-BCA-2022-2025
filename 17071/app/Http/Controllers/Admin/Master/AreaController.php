<?php

namespace App\Http\Controllers\Admin\Master;

use App\Http\Controllers\Controller;
use App\Http\Requests\AreaRequest;
use App\Models\Area;
use App\Models\Pincode;
use App\Scopes\BlockStatusScope;
use Illuminate\Http\Request;

class AreaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $req)
    {
        $query = Area::query();

        if ($req->status) {
            $query = $query->where('status', $req->status);
        }
        if ($req->area) {
            $query = $query->where('area', $req->area);
        }

        if ($req->pincode) {
            $query = $query->whereHas('pincode', function ($q) use ($req) {
                $q->where('pincode', $req->pincode)->where('status', 'Active');
            });
        } else {
            $query = $query->whereHas('pincode', function ($q) {
                $q->where('status', 'Active');
            });
        }

        $areas = $query
            ->withoutGlobalScope(BlockStatusScope::class)
            ->with(['pincode.city.state.country'])
            ->paginate(PAGINATE_LIMIT);

        return view('admin.master.area', compact('areas'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return view('admin.master.area');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(AreaRequest $req)
    {
        $validated = $req->validated();
        if ($req->has('pincode_id') && !empty($validated['area'])) {
            $pincode_id = $validated['pincode_id'];
            foreach ($validated['area'] as $areaName) {
                if (!empty($areaName)) {
                    Area::create([
                        'pincode_id' => $pincode_id,
                        'area' => $areaName,
                    ]);
                }
            }
        }
        return redirect()->back()->with(bindMsg('Areas saved successfully!', 'success'));
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
        $pincode = Pincode::withoutGlobalScope(BlockStatusScope::class)
            ->with('areas')
            ->findOrFail($id);
        return view('admin.master.area', compact('pincode'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(AreaRequest $req, $id)
    {
        $validated = $req->validated();

        $areas = Area::withoutGlobalScope(BlockStatusScope::class)
            ->with('pincode')
            ->where('pincode_id', $id)
            ->get();

        $deletedAreaIds = [];
        foreach ($areas as $area) {
            if (!in_array($area->area, $validated['area'])) {
                $deletedAreaIds[] = $area->id;
            }
        }
        if (!empty($deletedAreaIds)) {
            Area::withoutGlobalScope(BlockStatusScope::class)->destroy($deletedAreaIds);
        }
        if ($req->has('pincode_id') && !empty($validated['area'])) {
            $pincode_id = $validated['pincode_id'];
            foreach ($validated['area'] as $areaName) {
                if (!empty($areaName)) {
                    Area::updateOrCreate([
                        'pincode_id' => $pincode_id,
                        'area' => $areaName,
                    ]);
                }
            }
        }
        return redirect()->back()->with(bindMsg('Areas Updated successfully!', 'success'));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $area = Area::withoutGlobalScope(BlockStatusScope::class)->findOrFail($id);
        $area->delete($id);
        return redirect()->back()->with(bindMsg('Areas Deleted successfully!', 'success'));
    }

    public function areaStatus(Request $req)
    {
        $area = Area::withoutGlobalScope(BlockStatusScope::class)
            ->where('id', $req->id)
            ->first();
        if (!$area) {
            return response()->json(['response' => false, 'msg' => 'area Not found']);
        }
        $area->status = 'Active' ? 'Blocked' : 'Active';
        $area->save();
        return response()->json(['response' => true, 'msg' => 'Area updated successfully!!']);
    }
}
