@extends('admin.layouts.main')
@push('header')
<title>Student List </title>
<link rel="stylesheet" href="{{ publicPath('assets/vendor/libs/select2/select2.css') }}" />
<style>
    table tr th {
        text-transform: capitalize;
        border: 1px solid;
        text-wrap: nowrap;
        font-size: 12px;

    }

    table tr td {
        font-size: 12px;
        border: 1px solid;
    }
</style>
@endpush
@section('content')
  {{-- view --}}
    @isset($students)
        <div class="card">
            <div class="card-body d-flex justify-content-between align-items-center">
            <h5 class="card-header">Students LIST</h5>
                <a class="btn btn-sm btn-primary waves-effect waves-light" href="{{ route('admin.student.create') }}">Add
                    New</a>
            </div>
            {!! html()->form('GET', url()->current())->open() !!}
            <div class="row align-items-center mt-1 mx-2 mb-3">
                <div class="col-md-3">
                    <x-input name="phone" :value="request()->get('phone')" label="Mobile No" />
                </div>
                <div class="col-md-3">
                    <x-input name="name" :value="request()->get('name')" label="Name" />
                </div>

                <div class="col-md-3">
                    <x-input name="email" :value="request()->get('email')" label="Email" />
                </div>

                <div class="col-md-3">
                    <x-select name="status" placeholderSelect2="type" :placeholder="true"
                        :list="\App\Utils\SelectionList::statusList()" :value="request()->get('status')"
                        label="Status" />
                </div>
                @isset($classwise)
                @else
                <div class="col-md-3">
                    <x-select name="class" placeholderSelect2="type" :placeholder="true"
                        :list="\App\Utils\SelectionList::classList()" :value="request()->get('class')"
                        label="Classes" />
                </div>
                @endisset
                <div class="col-md-3 mt-3">
                    <button type="reset" class="btn btn-sm btn-secondary">reset</button>
                    <button type="submit" class="btn btn-sm btn-primary">search</button>
                </div>
                {!! html()->form()->close() !!}
            </div>
            <div class="table-responsive text-nowrap">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Admission No</th>
                            <th>Admission</th>
                            <th>Student Name</th>
                            <th>Father Name</th>
                            <th>Phone</th>
                            <th>Email</th>
                            <th>Class</th>
                            <th>Roll no</th>
                            <th>DOB</th>
                            <th>Status</th>
                            <th class="text-center" width="10%">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach ($students as $student)
                            <tr>
                                <td>{{ $student->admission_no }}</td>
                                <td>{{ isset($student->admission_date)?$student->admission_date->format('d-m-Y'):null }}</td>
                                <td>{{ $student->name }}</td>
                                <td>{{ $student->father_name }}</td>
                                <td>{{ $student->mobile_no }}</td>
                                <td>{{ $student->email }}</td>
                                <td>{{ $student->class }}</td>
                                <td>{{ $student->roll_no }}</td>
                                <td>{{ isset($student->dob)?$student->dob->format('d-m-Y'):null }}</td>


                                <td>
                                    <div class="form-check form-switch mb-2">
                                        <input class="form-check-input" value="Active" onchange="studentStatus(event)"
                                            data-url="{{ route('admin.studentStatus', $student->id) }}" type="checkbox"
                                            id="flexSwitchCheckChecked" {{ $student->status == 'Active' ? 'checked' : null }}>
                                    </div>
                                </td>

                                <td>
                                    <div class="dropdown">
                                        <button type="button" class="btn p-0 dropdown-toggle hide-arrow"
                                            data-bs-toggle="dropdown">
                                            <i class="mdi mdi-dots-vertical"></i>
                                        </button>
                                        <div class="dropdown-menu">
                                            <button class="dropdown-item editBtn" data-bs-toggle="modal"
                                            data-bs-target="#editDataModal" data-bs-name="{{ $student->name }}"
                                           data-bs-father_name="{{ $student->father_name }}"  data-bs-mobile_no="{{ $student->mobile_no }}"
                                            data-bs-email="{{ $student->email }}"  data-bs-class="{{ $student->class }}"
                                            data-bs-roll_no="{{ $student->roll_no }}"  data-bs-dob="{{ $student->dob->format('Y-m-d')}}"
                                            data-bs-gender="{{ $student->gender }}"  data-bs-category="{{ $student->category }}"
                                            data-bs-second_mobile_no="{{ $student->second_mobile_no }}"  data-bs-religion="{{ $student->religion }}"
                                            data-bs-cast="{{ $student->cast }}"  data-bs-cast="{{ $student->cast }}"
                                            data-bs-address="{{ $student->address }}" data-bs-pincode="{{ $student->pincode }}" data-bs-admission_date="{{ isset($student->admission_date)?$student->admission_date->format('Y-m-d'):null}}"

                                            data-bs-url="{{ route('admin.student.update', $student->id) }}"><i
                                                class="mdi mdi-pencil-outline me-1"></i> Edit</button>

                                          <a href="{{ route('admin.studentFeeCollet',$student->id) }}" class="dropdown-item " style="font-size: 12px">  Fee</a>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>
            <div class="d-flex justify-content-end px-4 py-4">
                {!! $students->links() !!}
            </div>
        </div>
    @else
        {{-- edit and store --}}
        <div class="card">
            @if (isset($student))
                {!! html()->form('PUT', route('admin.student.update', $student->id))->attribute('enctype', 'multipart/form-data')->open() !!}
            @else
                {!! html()->form('POST', route('admin.student.store'))->attribute('enctype', 'multipart/form-data')->open() !!}
            @endif
            <h5 class="card-header">{{ isset($student) ? 'UPDATE' : 'ADD' }} Student</h5>
            <div class="card-body">

                <div class="row">
                    <!-- Name -->
                    <div class="col-md-4 my-2">
                        <x-input label="Name" name="name" value="{{ old('name', $student->name ?? '') }}" required />
                    </div>

                    <!-- Email -->
                    <div class="col-md-4 my-2">
                        <x-input label="Email" name="email" type="email"
                            value="{{ old('email', $student->email ?? '') }}" />
                    </div>

                    <!-- Mobile -->
                    <div class="col-md-4 my-2">
                        <x-input label="Mobile Number" name="mobile_no"
                            value="{{ old('mobile_no', $student->mobile_no ?? '') }}" required />
                    </div>

                    <div class="col-md-4 my-2">
                        <x-input label="Father's Name" name="father_name"
                            value="{{ old('father_name', $student->father_name ?? '') }}" required />
                    </div>


                    <!-- Roll Number -->
                    <div class="col-md-4 my-2">
                        <x-input label="Roll No" name="roll_no" type="number"
                            value="{{ old('roll_no', $student->roll_no ?? '') }}" required />
                    </div>

                    <!-- Class -->
                    <div class="col-md-4 my-2">
                        <x-select name="class" class="select2"
                        :value=" old('class')"
                        :list="\App\Utils\SelectionList::classList()" label='Class' value="{{ old('class', $student->class ?? '') }}"  placeholderSelect2="Class" />
                    </div>

                    <!-- Date of Birth -->
                    <div class="col-md-4 my-2">
                        <x-input label="Date of Birth" name="dob" type="date"
                            value="{{ old('dob', $student->dob ?? '') }}" required />
                    </div>
                    <div class="col-md-4 my-2">
                        <x-input label="Date of Admission" name="admission_date" type="date"
                            value="{{ old('admission_date', $student->admission_date ?? '') }}" required />
                    </div>

                    <!-- Gender -->
                    <div class="col-md-4 my-2">
                        <x-select class="select2" name="gender" :list="\App\Utils\SelectionList::genderList()"
                            value="{{ isset($student) ? $student->gender : old('gender') }}" />
                    </div>

                    <!-- Category -->
                    <div class="col-md-4 my-2">
                        <x-input label="Category" name="category" value="{{ old('category', $student->category ?? '') }}" />
                    </div>

                    <!-- Secondary Mobile -->
                    <div class="col-md-4 my-2">
                        <x-input label="Secondary Mobile" name="second_mobile_no"
                            value="{{ old('second_mobile_no', $student->second_mobile_no ?? '') }}" />
                    </div>

                    <!-- Religion -->
                    <div class="col-md-4 my-2">
                        <x-input label="Religion" name="religion" value="{{ old('religion', $student->religion ?? '') }}" />
                    </div>

                    <!-- Cast -->
                    <div class="col-md-4 my-2">
                        <x-input label="Cast" name="cast" value="{{ old('cast', $student->cast ?? '') }}" />
                    </div>



                    <!-- Pincode -->
                    <div class="col-md-4 my-2">
                        <x-input label="Pincode" name="pincode" value="{{ old('pincode', $student->pincode ?? '') }}" />
                    </div>

                    <!-- Image -->
                    <div class="col-md-4 my-2">
                        <x-input label="photo" name="photo" type="file" />
                    </div>
                    <!-- Address -->
                    <div class="col-md-12 my-2">
                        <x-text-area label="Address" name="address">{{ old('address', $student->address ?? '') }}</x-text-area>
                    </div>
                </div>


                <div class="d-flex justify-content-end pt-3">
                    <button type="submit" class="btn btn-primary">{{ isset($student) ? 'Update' : 'Add' }}</button>
                </div>
            </div>
            {!! html()->closeModelForm() !!}
        </div>
    @endisset
@endsection


{{-- edit in modal --}}
<div class="modal fade" id="editDataModal" tabindex="-1" role="dialog" aria-labelledby="editModal" aria-hidden="true">
    <div class="modal-dialog modal-xl" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="editModal">Student Edit</h5>
                <button data-bs-dismiss="modal" type="button"
                    class="btn-sm btn btn-icon btn-label-github waves-effect close" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            {!! html()->form('PUT', route('admin.student.create'))->id('ajaxEditForm')->open() !!}
            <div class="modal-body">
                <div class="row">
                    <!-- Name -->
                    <div class="col-md-4 my-2">
                        <x-input label="Name" name="name"  id="edit" required />
                    </div>

                    <!-- Email -->
                    <div class="col-md-4 my-2">
                        <x-input label="Email" name="email" id="edit" type="email"  />
                    </div>

                    <!-- Mobile -->
                    <div class="col-md-4 my-2">
                        <x-input label="Mobile Number" id="edit" name="mobile_no"  required />
                    </div>

                    <div class="col-md-4 my-2">
                        <x-input label="Father's Name" id="edit" name="father_name"
                             required />
                    </div>


                    <!-- Roll Number -->
                    <div class="col-md-4 my-2">
                        <x-input label="Roll No" id="edit" name="roll_no" type="number"
                             required />
                    </div>

                    <!-- Class -->
                    <div class="col-md-4 my-2">
                        <x-select name="class" class="select2"
                        :value=" old('class')"
                        :list="\App\Utils\SelectionList::classList()" label='Class' id="edit"  placeholderSelect2="Class" />
                    </div>

                    <!-- Date of Birth -->
                    <div class="col-md-4 my-2">
                        <x-input label="Date of Birth" name="dob" id="edit" type="date" required />
                    </div>
                    <div class="col-md-4 my-2">
                        <x-input label="Date of Admission" name="admission_date" id="edit" type="date"  required />
                    </div>

                    <!-- Gender -->
                    <div class="col-md-4 my-2">
                        <x-select class="select2" name="gender" :list="\App\Utils\SelectionList::genderList()"
                        id="gender"/>
                    </div>

                    <!-- Category -->
                    <div class="col-md-4 my-2">
                        <x-input label="Category" id="edit" name="category"  />
                    </div>

                    <!-- Secondary Mobile -->
                    <div class="col-md-4 my-2">
                        <x-input label="Secondary Mobile" id="edit" name="second_mobile_no"
                             />
                    </div>

                    <!-- Religion -->
                    <div class="col-md-4 my-2">
                        <x-input label="Religion" name="religion"  id="edit" />
                    </div>

                    <!-- Cast -->
                    <div class="col-md-4 my-2">
                        <x-input label="Cast" name="cast" id="edit" />
                    </div>

                    <!-- Pincode -->
                    <div class="col-md-4 my-2">
                        <x-input label="Pincode" name="pincode"  id="edit" />
                    </div>

                    <!-- Image -->
                    <div class="col-md-4 my-2">
                        <x-input label="Image" name="image" type="file" />
                    </div>
                    <!-- Address -->
                    <div class="col-md-12 my-2">
                        <x-text-area label="Address" id="edit" name="address">{{ old('address') }}</x-text-area>
                    </div>
                </div>

            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary btn-sm" data-bs-dismiss="modal">Close</button>
                <button type="button" id="updateBtn" class="btn btn-primary btn-sm">Update</button>
            </div>
            {{ html()->form()->close() }}
        </div>
    </div>
</div>

@push('script')
<script src="{{ publicPath('assets/vendor/libs/select2/select2.js') }}"></script>
<script src="{{ publicPath('assets/js/forms-selects.js') }}"></script>
<script>

const studentStatus = (event) => {
    const dataUrl = event.target.getAttribute('data-url');
    const status = event.target.checked ? 'Active' : 'Blocked';
    const data = {
        status: status
    };
    toastr.options.timeOut = 1000;
    fetch(dataUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': csrfToken,
            },
            body: JSON.stringify(data),
        }).then(response => {
            if (!response.ok) {
                toastr.error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            toastr.success(`Student Locked status Updated successfully `);
        })
        .catch(error => {
            toastr.error(error);
        });
};
</script>


@endpush
