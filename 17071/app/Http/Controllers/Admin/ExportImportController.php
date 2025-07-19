<?php

namespace App\Http\Controllers\Admin;

use App\Exports\StudentExport;
use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Scopes\BlockStatusScope;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Maatwebsite\Excel\Facades\Excel;

class ExportImportController extends Controller
{
    public function studentFilters()
    {
        return view('admin.export.filter-student');
    }

    public function studentClassWise(Request $req)
    {
        if ($req->class == 'all') {
            $students = Student::withoutGlobalScope(BlockStatusScope::class)->get();
        } else {
            $students = Student::where('class', $req->class)
                ->withoutGlobalScope(BlockStatusScope::class)
                ->orderBy('roll_no','asc')
                ->get();
        }

        $html = view('admin.export.students', compact('students'))->render();
        return response()->json(['response' => true, 'html' => $html], 200);
    }

    public function exportStudentClassWise(Request $req)
    {
        return Excel::download(new StudentExport($req->class), "town_school_class{$req->class}.csv");
    }

    public function updateBulkStudent(Request $req)
    {
        $validation = Validator::make($req->all(), [
            'file' => 'required|file|mimes:csv,xlsx',
        ]);

        if ($validation->fails()) {
            return response()->json(
                [
                    'status' => false,
                    'errors' => $validation->errors(),
                ],
                422,
            );
        }

        $file = $req->file('file');
      //  try {
            $handle = fopen($file->getRealPath(), 'r');
            DB::transaction(function () use ($handle, $req) {
                while (($data = fgetcsv($handle)) !== false) {

                    $sno = 1;
                    if (count(array_filter($data)) === 0 || $data[0] == 'Admission No') {
                        continue;
                    }
                    if (!empty($data[5])) {
                        try {
                            $dob = Carbon::parse($data[5])->format('Y-m-d');
                        } catch (Exception $e) {
                            $dob = null;
                        }
                    }
                    $student = new Student();
                    $student->name = $data['1'];
                    $student->roll_no = $data['2'];
                    $student->class = $req->class;
                    $student->father_name = $data['4'];
                    $student->dob = $dob;
                    $student->gender = $data['6'];
                    $student->mobile_no = $data['8'];
                    $student->save();
                }
            });
            fclose($handle);
            return redirect(route('admin.student.index'))->with(bindMsg('File Imported Successfully', 'success'));
       // } catch (Exception $e) {
            return back()->with(bindMsg('Something went wrong', 'error'));
      //  }
    }
}
