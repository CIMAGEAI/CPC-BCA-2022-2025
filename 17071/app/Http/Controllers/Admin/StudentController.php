<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\AssetController;
use App\Http\Controllers\Controller;
use App\Http\Requests\StudentRequest;
use App\Models\FeeMaster;
use App\Models\Student;
use App\Models\StudentFeePayment;
use App\Scopes\BlockStatusScope;
use App\Utils\SelectionList;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;


class StudentController extends Controller
{

    //view
    public function index(Request $req)
    {
        $student = Student::withoutGlobalScope(BlockStatusScope::class);
        if($req->name){
            $student = $student->where("name","like","%".$req->name."%");
        }
        if($req->email){
            $student = $student->where("email","like","%".$req->email."%");
        }
        if($req->phone){
            $student = $student->where("mobile_no","like","%".$req->phone."%")->orWhere("second_mobile_no","like","%".$req->phone."%");
        }
        if($req->status){
            $student = $student->where("status", $req->status);
        }

        $students = $student->latest()->paginate(PAGINATE_LIMIT);
        return view('admin.student.students', compact('students'));

    }


    public function create()
    {
        return view('admin.student.students');
    }


    public function store(StudentRequest $req)
    {
        if($req->photo){
            $image = AssetController::uploadResize('students', $req->photo, $req->name . '-' . Student::max('id'), 300, 300);
            $req->merge(['image' => $image]);
        }

        $student = Student::create(array_filter($req->all()));
        return redirect()->route('admin.student.index')->with(bindMsg('Student Added Success','success'));
    }

    public function show(string $id)
    {

    }

    public function edit(string $id)
    {
        $student = Student::findOrFail($id);
        return view('admin.student.students', compact('student'));
    }


    public function update(StudentRequest $req, string $id)
    {
        if($req->photo){
            $image = AssetController::uploadResize('students', $req->photo, $req->name . '-' . Student::max('id'), 300, 300);
            $req->merge(['image' => $image]);
        }
        $student = Student::withoutGlobalScope(BlockStatusScope::class)->findOrFail($id);
        $student->update( array_filter($req->all()));
        return response()->json(['response'=>true,'msg'=>'student updated successfully']);
    }


    public function studentStatus(Request $req, string $id)
    {
        $studentStatus = Student::withoutGlobalScope(BlockStatusScope::class)->findOrFail($id);
        $studentStatus->status = $req->status;
        $studentStatus->save();

        return response()->json(['response'=>true,'msg'=>'student Status successfully']);
    }

    public function studentFeeCollet($id){
         $student = Student::findOrFail($id);
         if(!isset($student->admission_date)){
            return back()->with(bindMsg('Please add first addmission date first','error'));
         }
         $admissionMonth = $student->admission_date->format('F');
         $fees = FeeMaster::where('class', $student->class)
            ->where(function ($query) use ($admissionMonth) {
                $query->whereRaw("
                    FIELD(month, 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December')
                    >= FIELD(?, 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December')
                ", [$admissionMonth])
                ->orWhereIn('feeType', SelectionList::feeTypeList());
            })
            ->orderByRaw("
                FIELD(month, 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December')
            ")
            ->get();

         return view('admin.student.studentFeeDetail', compact('student','fees'));
    }

    public function studentPayment(Request $req ,$id,$feeId){

        $student = Student::findOrFail($id);
        $fee =  FeeMaster::where('id',$feeId)->first();
        if(!$fee || !$student){
            return back()->with(bindMsg('Some thing went wrong','error'));
        }

       $studentPayment =  new StudentFeePayment();
       $studentPayment->student_id = $id;
       $studentPayment->fee = $fee->fee;
       $studentPayment->feeType = $fee->feeType;
       $studentPayment->class = $fee->class;
       $studentPayment->month = $fee->month;
       $studentPayment->other = $req->other;
       $studentPayment->remark = $req->remark;
       $studentPayment->save();

       return back()->with(bindMsg('Fee collect successfully','success'));

    }


    public function studentPaymentDelete($id){
       StudentFeePayment::findOrFail($id)->delete();
       return back()->with(bindMsg('Fee Undo successfully','success'));
    }

    public function studentPaymentInvoice($id)
    {
        $studentFee= StudentFeePayment::with('student')->find($id);
        if (!$studentFee) {
            return response('Student Payment not found', 404);
        }
        $pdf = Pdf::loadView('common.resipt',compact('studentFee'));
        $pdf->setPaper('A6', 'portrait');
        return response($pdf->stream("$studentFee->class.$studentFee->student->name.pdf"), 200)->header('Content-Type', 'application/pdf')->header('Content-Disposition', 'inline');
    }

    public function studentClass(Request $req,$class){
      if(!$class){
        return back()->with(bindMsg('class not found!!','error'));
      }
      $student = Student::where('class',$class)->withoutGlobalScope(BlockStatusScope::class);
        if($req->name){
            $student = $student->where("name","like","%".$req->name."%");
        }
        if($req->email){
            $student = $student->where("email","like","%".$req->email."%");
        }
        if($req->phone){
            $student = $student->where("mobile_no","like","%".$req->phone."%")->orWhere("second_mobile_no","like","%".$req->phone."%");
        }
        if($req->status){
            $student = $student->where("status", $req->status);
        }

        $students = $student->latest()->paginate(PAGINATE_LIMIT);
        $classwise = true;
        return view('admin.student.students', compact('students','classwise'));
    }


    public function destroy(string $id)
    {

    }

    public function studentPrint(Request $req){
        $ids = explode(',', $req->query('ids'));
        $studentFee = StudentFeePayment::with('student')->whereIn('id', $ids)->get();

        if ($studentFee->isEmpty()) {
            return redirect()->back()->with(bindMsg('No fees found.','error'));
        }

        $lateFees = $studentFee->where('feeType', 'Late Fee')->first();
        $examFees = $studentFee->where('feeType', 'Examination Fee')->first();
        $developmentFees = $studentFee->where('feeType', 'Development Fee')->first();

       $student =  $studentFee->first()->student();

       $months = $studentFee->pluck('month')->unique();
        $pdf = Pdf::loadView('common.print_invoice',compact('studentFee','student','months','lateFees','examFees','developmentFees'));
        $pdf->setPaper('A6', 'portrait');

        return response($pdf->stream("$studentFee[0]->student.$studentFee[0]->student->name.pdf"), 200)->header('Content-Type', 'application/pdf')->header('Content-Disposition', 'inline');

        //return view('common.print_invoice', compact('studentFee','student'));
    }
}
