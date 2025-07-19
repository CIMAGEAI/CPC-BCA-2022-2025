<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class FeeCollectionController extends Controller
{
    public function feeCollect(){
        $fee = true;
        return view('admin.export.filter-student',compact('fee'));
    }

}
