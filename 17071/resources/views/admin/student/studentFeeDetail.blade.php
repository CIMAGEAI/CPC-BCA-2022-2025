@extends('admin.layouts.main')
@push('header')
<title>Student List </title>
<link rel="stylesheet" href="{{ publicPath('assets/vendor/libs/select2/select2.css') }}" />
<style>
    .tabel-x tr th {
        text-transform: capitalize;
        border: 1px solid;
        text-wrap: nowrap;
        font-size: 12px;

    }

    .tabel-x tr td {
        font-size: 12px;
        border: 1px solid;
    }
    .modal-backdrop.fade.show{
        display: none;
    }
    table tr th{
        border: 1px solid;
    }
    table tr td{
        border: 1px solid;
    }
</style>
@endpush
@section('content')
        <div class="card">
            <h5 class="card-header">Students Fees</h5>


            <div class="table-responsive text-nowrap">
                <table class="table tabel-x">
                <tr>
                    <td rowspan="6" style="text-align: center;border: 1px solid #000">
                        <img class="shadow-lg" src="{{ route('uploads', ['folder' => 'assets', 'file' => 'logo.jpg']) }}"
                        height="150px" style="border-radius: 50%;border: 1px solid rgba(160, 35, 255, 0.933)">
                    </td>

                    <th>Name</th>
                    <td>{{ $student->name }}</td>
                    <th>Class (Section)</th>
                    <td>{{ $student->class }}</td>
                </tr>
                <tr>
                    <th>Father Name</th>
                    <td>{{ $student->father_name }}</td>
                    <th>Admission No</th>
                    <td>{{ $student->admission_no }}</td>
                </tr>
                <tr>
                    <th>Mobile Number</th>
                    <td>{{ $student->mobile_no }}</td>
                    <th>Roll Number</th>
                    <td>{{ $student->roll_no }}</td>
                </tr>
                <tr>
                    <th>Admission Date</th>
                    <td>{{ isset($student->admission_date)?$student->admission_date->format('Y-m-d'):null }}</td>
                    <th>RTE</th>
                    <td class="no">No</td>
                </tr>
                <tr>
                    <td colspan="4" style="text-align: right;">Date: 02/02/2025</td>
                </tr>
            </table>
            <div class="buttons my-3">
                <a href="javascript:void(0);" id="print-selected" class="btn btn-sm bg-black text-white" style="border-radius: 0">Print Selected</a>

                <button class="btn btn-sm bg-warning text-white" style="border-radius: 0">Collect Selected</button>

                <button class="btn btn-sm bg-primary editBtn text-white" style="border-radius: 0" data-bs-toggle="modal"
                data-bs-target="#editDataModal" data-bs-name="{{ $student->name }}"
                data-bs-father_name="{{ $student->father_name }}"  data-bs-mobile_no="{{ $student->mobile_no }}"
                data-bs-email="{{ $student->email }}"  data-bs-class="{{ $student->class }}"  data-bs-admission_date="{{ isset($student->admission_date)? $student->admission_date->format('Y-m-d'):null}}"
                data-bs-roll_no="{{ $student->roll_no }}"  data-bs-dob="{{ $student->dob->format('Y-m-d')}}"
                data-bs-gender="{{ $student->gender }}"  data-bs-category="{{ $student->category }}"
                data-bs-second_mobile_no="{{ $student->second_mobile_no }}"  data-bs-religion="{{ $student->religion }}"
                data-bs-cast="{{ $student->cast }}"  data-bs-cast="{{ $student->cast }}"
                data-bs-address="{{ $student->address }}" data-bs-pincode="{{ $student->pincode }}"
                data-bs-url="{{ route('admin.student.update', $student->id) }}"> Edit Student</button>

            </div>
            </div>

            <br>
            <div class="table-responsive text-nowrap">
                <table class="table">
                    <thead>
                        <tr>
                            <th><input type="checkbox" id="select-all"></th>
                            <th>Month</th>
                            <th>Fee</th>
                            <th>Status</th>
                            <th>Fee Type</th>
                            <th class="text-center" width="10%">Action</th>
                        </tr>
                    </thead>
                    <tbody>

                        @php
                            $feeAmount=0;
                            $otherAmount=0;
                            $payAmount=0;
                        @endphp
                        @foreach ($fees as $fee)
                            @php
                                $feeMonth =   \App\Models\StudentFeePayment::where('student_id',$student->id)->where('month',$fee->month)->first();
                            @endphp
                            <tr>
                                <td></td>
                                <td>{{ $fee->month }}  <span class="fw-bold">Type: {{ $fee->feeType }}</span> </td>
                                <td>
                                  {{ $fee->fee }}
                                </td>
                                <td>
                                    @if(!$feeMonth)
                                     <span class="bg-danger px-2 py-1 rounded text-white " style="font-size: 12px;border-radius: 0">Not Paid</span>
                                     @else
                                     <span class="bg-success px-2 py-1 rounded text-white " style="font-size: 12px;border-radius: 0">Paid</span>

                                    @endif
                                </td>
                                <td>{{ $fee->month }}</td>
                                <td>

                                   <div class="d-flex gap-2">
                                    @if(!$feeMonth)
                                        <button class="btn btn-sm bg-success text-white btnCollect" style="border-radius: 0"   data-bs-toggle="modal"
                                        data-bs-target="#collectMoney" data-bs-name="{{ $student->name }}"
                                        data-bs-amount={{ $fee->fee }}
                                        data-bs-url="{{ route('admin.studentPayment',['id'=>$student->id,'feeId'=>$fee->id]) }}"> <span class="mdi mdi-currency-rupee"></span> Collect</button>
                                    @else
                                    <a class="btn btn-sm btn-danger" href="javascript:void(0);" style="border-radius: 0"
                                        onclick="confirmRetrieval('{{ route('admin.studentPaymentDelete',['id'=>$feeMonth->id]) }}')">
                                        <span class="mdi mdi-undo-variant"></span> Retrieve
                                    </a>
                                        <a target="_blank" href="{{ route('admin.studentPaymentInvoice',['id'=>$feeMonth->id]) }}" class="btn btn-sm bg-primary text-white" style="border-radius: 0"> <span class="mdi mdi-printer-outline"></span> Print </a>
                                    @endif
                                   </div>
                                </td>
                            </tr>
                            @isset($feeMonth)
                            @php
                             $payAmount+=$feeMonth->fee;
                             $otherAmount+=$feeMonth->other;
                            @endphp
                            <tr>
                                <td>   <input type="checkbox" class="fee-checkbox" value="{{ $feeMonth->id }}"></td>
                                <td></td>
                                <td>{{ $feeMonth->fee }}</td>
                                <td>{{ $feeMonth->other }}</td>
                                <td>{{ $feeMonth->remark }}</td>
                            </tr>
                            @endisset


                        @endforeach
                        <tr>
                            <td><b>Total</b></td>
                            <td><b>{{ numberFormat($fees->sum('fee') ) }}</b></td>
                            <td style="font-weight: bold">{{ numberFormat($payAmount) }}</td>
                            <td><b>{{ numberFormat($otherAmount) }}</b></td>
                            <td></td>
                            {{--  <td><b>{{ numberFormat($fees->sum('fee') - ($payAmount) ) }}</b></td>  --}}
                        </tr>
                        <td>
                            <td colspan="3">Grand Total</td>
                            <td colspan="2">{{ numberFormat($otherAmount+$fees->sum('fee')) }}</td>
                        </td>
                    </tbody>
                </table>
            </div>
        </div>
@endsection

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
                        <x-text-area label="Address" id="edit" name="address" value="{{ old('address') }}"/>
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

<div class="modal fade" id="collectMoney" tabindex="-1" role="dialog" aria-labelledby="collectMoney" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title border-bottom" id="editModal">Student Fee Collect</h5>
                <button  type="button"
                    class="btn-sm btn btn-icon btn-label-github waves-effect close closeModal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            {!! html()->form('PUT', route('admin.student.create'))->id('modalPaymentForm')->open() !!}
            <div class="modal-body">
                <div class="row">
                 <div class="d-flex justify-content-between align-items-center">
                    <p class="p-0 m-0 mb-1"><strong>Student Name:</strong> <span id="modalStudentName"></span></p>
                    <p class="p-0 m-0 mb-1"><strong>Amount:</strong> ₹<span id="modalAmount"></span></p>
                 </div>
                    <!-- Name -->
                    <div class="col-md-6 my-2">
                        <x-input label="Name" name="name" />
                    </div>

                    <!-- Religion -->
                    <div class="col-md-6 my-2">
                        <x-input label="other" name="other"  />
                    </div>

                    <!-- Address -->
                    <div class="col-md-12 my-2">
                        <x-text-area label="Remark"  name="remark" value="{{ old('remark') }}" />
                    </div>
                </div>

            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary btn-sm closeModal" >Close</button>
                <button  type="submit" class="btn btn-primary btn-sm">Collect</button>
            </div>
            {{ html()->form()->close() }}
        </div>
    </div>
</div>

@push('script')
<script src="{{ publicPath('assets/vendor/libs/select2/select2.js') }}"></script>
<script src="{{ publicPath('assets/js/forms-selects.js') }}"></script>
<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
<script>
    function confirmRetrieval(url) {
        Swal.fire({
            title: "Are you sure?",
            text: "Do you really want to retrieve this payment?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, Retrieve it!",
            cancelButtonText: "Cancel"
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = url;
            }
        });
    }
</script>
<script>
    document.addEventListener("DOMContentLoaded", function () {
        // Select all checkboxes
        document.getElementById("select-all").addEventListener("change", function () {
            let checkboxes = document.querySelectorAll(".fee-checkbox");
            checkboxes.forEach((checkbox) => {
                checkbox.checked = this.checked;
            });
        });

        // Print Selected Button Click
        document.getElementById("print-selected").addEventListener("click", function () {
            let selectedFees = [];
            document.querySelectorAll(".fee-checkbox:checked").forEach((checkbox) => {
                selectedFees.push(checkbox.value);
            });

            if (selectedFees.length === 0) {
                alert("Please select at least one fee to print.");
                return;
            }

            let url = "{{ route('admin.studentPrint') }}?ids=" + selectedFees.join(",");
            window.open(url, "_blank");
        });
    });
</script>

<script>
    document.addEventListener("DOMContentLoaded", function () {
        document.querySelectorAll(".btnCollect").forEach(button => {
            button.addEventListener("click", function () {
                let studentName = this.getAttribute("data-bs-name");
                let amount = this.getAttribute("data-bs-amount");
                let paymentUrl = this.getAttribute("data-bs-url");
                console.log(studentName);
                document.getElementById("add-name").value = studentName;
                document.getElementById("modalStudentName").textContent = studentName;
                document.getElementById("modalAmount").textContent = amount;
                document.getElementById("modalPaymentForm").setAttribute("action", paymentUrl);
                let modal = new bootstrap.Modal(document.getElementById("collectMoney"));
                modal.show();
            });
        });

        document.querySelectorAll(".closeModal").forEach(button => {
            button.addEventListener("click", function () {
                let modal = bootstrap.Modal.getInstance(document.getElementById("collectMoney"));
                if (modal) {
                    modal.hide();
                    console.log(123);
                }
            });
        });

    });

</script>
@endpush
