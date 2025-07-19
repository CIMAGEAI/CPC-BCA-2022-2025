<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Admin;
use App\Models\Lead;
use App\Models\Manager;
use App\Models\StudentFeePayment;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function dashboard(Request $req)
    {

        $fromDate = isset($req->fromDate) ? $req->fromDate . ' 00:00:00' : null;
        $toDate = isset($req->fromDate) ? $req->toDate . ' 23:59:59' : null;


        // $leads = Lead::when($fromDate != null && $toDate != null, function ($query) use ($fromDate, $toDate) {
        //     return $query->whereBetween('created_at', [$fromDate, $toDate]);
        // })->count();
        // $completedLeads = Lead::when($fromDate != null && $toDate != null, function ($query) use ($fromDate, $toDate) {
        //     return $query->whereBetween('created_at', [$fromDate, $toDate]);
        // })->where('status','Completed')->count();
        // $inProgressLeads = Lead::when($fromDate != null && $toDate != null, function ($query) use ($fromDate, $toDate) {
        //     return $query->whereBetween('created_at', [$fromDate, $toDate]);
        // })->where('status','In Progress')->count();
        // $failedLeads = Lead::when($fromDate != null && $toDate != null, function ($query) use ($fromDate, $toDate) {
        //     return $query->whereBetween('created_at', [$fromDate, $toDate]);
        // })->where('status','Failed')->count();

        // $manager = Manager::when($fromDate != null && $toDate != null, function ($query) use ($fromDate, $toDate) {
        //     return $query->whereBetween('created_at', [$fromDate, $toDate]);
        // })->count();
        // $user = User::when($fromDate != null && $toDate != null, function ($query) use ($fromDate, $toDate) {
        //     return $query->whereBetween('created_at', [$fromDate, $toDate]);
        // })->count();




        // return view('admin.dashboard',compact('leads','completedLeads','inProgressLeads','failedLeads','manager','user'));
        $today = StudentFeePayment::whereDate('created_at', Carbon::today())
            ->selectRaw('SUM(fee) as total_fee, SUM(other) as total_other')
            ->first();

        $month = StudentFeePayment::whereYear('created_at', Carbon::now()->year)
                    ->whereMonth('created_at', Carbon::now()->month)
                    ->selectRaw('SUM(fee) as total_fee, SUM(other) as total_other')
                    ->first();

        $year = StudentFeePayment::whereYear('created_at', Carbon::now()->year)
                    ->selectRaw('SUM(fee) as total_fee, SUM(other) as total_other')
                    ->first();

        return view('admin.dashboard',compact('today','month','year') );

    }
}
