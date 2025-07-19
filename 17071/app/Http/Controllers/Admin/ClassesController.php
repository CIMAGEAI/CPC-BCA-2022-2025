<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\AssetController;
use App\Http\Controllers\Controller;
use App\Models\Classs;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ClassesController extends Controller
{
   
  public function index(Request $req)
    {
        $student = Classs::query();

        if($req->title){
            $student = $student->where("title","like","%".$req->title."%");
        }
        if($req->type){
            $student = $student->where("type","like","%".$req->type."%");
        }
      
        $classes = $student->latest()->paginate(PAGINATE_LIMIT);
        return view('admin.student.classes', compact('classes'));

    }


    public function create()
    {
        return view('admin.student.classes');
    }


    public function store(Request $req)
    {
        $req->validate([
            'class'=>'required',
            'title'=>'required',
            'description'=>'nullable',
            'age'=>'required'
        ]);

        if($req->photo){
            $image = AssetController::uploadFile('sections', $req->photo, $req->title . '-' . Classs::max('id'));
            $req->merge(['image' => $image]);
        }

        $student = Classs::create(array_filter($req->all()));
        return redirect()->route('admin.classes.index')->with(bindMsg('Classes Added Success','success'));
    }

    public function show(string $id)
    {

    }

    public function edit(string $id)
    {
        $class = Classs::findOrFail($id);
        return view('admin.student.classes', compact('class'));
    }


    public function update(Request $req, string $id)
    {
       $validator =  Validator::make($req->all(),[
            'class'=>'required',
            'title'=>'required',
            'description'=>'nullable',
            'age'=>'required',
            'photo'=>'nullable|max:4026'
        ]);
        if($validator->fails()){
          return response()->json(['response'=>false,'msg'=>'classes','errors'=>$validator->errors()]);
        }
        if($req->photo){
                        $image = AssetController::uploadFile('sections', $req->photo, $req->title . '-' . Classs::max('id'));
            $req->merge(['image' => $image]);
        }
        $student = Classs::findOrFail($id);
   
        $student->update( array_filter($req->all()));
        return response()->json(['response'=>true,'msg'=>'Classes updated successfully']);
    }
    public function destroy(string $id)
    {
         $student = Classs::findOrFail($id)->delete();
        return redirect()->route('admin.classes.index')->with(bindMsg('Classes Added Success','success'));

    }

   
}
