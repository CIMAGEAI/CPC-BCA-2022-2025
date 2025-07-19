@extends('admin.layouts.main')
@push('header')
    <title>Manage Fee Master</title>
    <link rel="stylesheet" href="{{ publicPath('assets/vendor/libs/select2/select2.css') }}" />
@endpush
@section('content')
    <div class="card">
        <h5 class="card-header">Manage Fee Master</h5>
        <div class="card-body">
            <button class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#exampleModal">Add New</button>
        </div>

        <div class="table-responsive text-nowrap">
            <table class="table" id="myTable">
                <thead>
                    <tr>
                        <th>Class </th>
                        <th>Fee</th>
                        <th>Fee Type</th>
                        <th>Month</th>
                        <th class="text-center" width="10%">Action</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach ($fees as $fee)
                        <tr>
                            <td>{{ $fee->class }}</td>
                            <td>
                              {{ $fee->fee }}
                            </td>
                            <td>{{ $fee->feeType }}</td>
                            <td>{{ $fee->month }}</td>
                            <td>
                                <div class="dropdown">
                                    <button type="button" class="btn p-0 dropdown-toggle hide-arrow"
                                        data-bs-toggle="dropdown">
                                        <i class="mdi mdi-dots-vertical"></i>
                                    </button>
                                    <div class="dropdown-menu">
                                        <button class="dropdown-item editBtn" data-bs-toggle="modal"
                                            data-bs-target="#editDataModal" data-bs-fee="{{ $fee->fee }}"
                                            data-bs-feeType="{{ $fee->feeType }}"
                                            data-bs-month="{{ $fee->month }}"
                                            data-bs-class="{{ $fee->class }}"
                                            data-bs-url="{{ route('admin.fee.update', $fee->id) }}"><i
                                                class="mdi mdi-pencil-outline me-1"></i> Edit</button>
                                        {!! html()->form('POST', route('admin.duplicateFee', $fee->id))->attribute('onsubmit', 'return ConfirmDuplicate(event)')->open() !!}
                                        <button class="dropdown-item" type="submit">
                                            <i class="mdi mdi-content-copy me-1"></i> Duplicate
                                        </button>
                                        {{ html()->form()->close() }}
                                        {!! html()->form('DELETE', route('admin.fee.destroy', $fee->id))->attribute('onsubmit', 'return ConfirmDestroy(event)')->open() !!}
                                        <button class="dropdown-item" type="submit">
                                            <i class="mdi mdi-trash-can-outline me-1"></i> Delete
                                        </button>
                                        {{ html()->form()->close() }}

                                    </div>
                                </div>
                            </td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
        <div class="d-flex justify-content-end px-4 py-4">
            {{--  {!! $fees->links() !!}  --}}
        </div>
    </div>

    <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModal"
        aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModal">Add Fee Class Wise</h5>
                    <button data-bs-dismiss="modal" type="button"
                        class="btn-sm btn btn-icon btn-label-github waves-effect close" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                {!! html()->form('POST', route('admin.fee.store'))->id('ajaxForm')->open() !!}
                <div class="modal-body">
                    <div class="form-group mt-1">
                        <x-input name="fee" />
                    </div>
                    <div class="form-group mt-1">
                        <x-select name="feeType" class="select2"
                            :value=" old('feeType')"
                            :list="\App\Utils\SelectionList::feeTypeList()" label='Fee Type'   placeholderSelect2="Fee Type" />
                    </div>
                    <div class="form-group mt-1">
                            <x-select name="class" class="select2"
                            :value=" old('class')"
                            :list="\App\Utils\SelectionList::classList()" label='Class'   placeholderSelect2="Class" />
                    </div>
                    <div class="form-group mt-1">
                        <x-select name="month" class="select2"
                            :value=" old('month')"
                            :list="\App\Utils\SelectionList::monthList()" label='Month'   placeholderSelect2="Month" />
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary btn-sm" data-bs-dismiss="modal">Close</button>
                    <button type="button" id="submitBtn" class="btn btn-primary btn-sm">Add</button>
                </div>
                {{ html()->form()->close() }}
            </div>
        </div>
    </div>

    <div class="modal fade" id="editDataModal" tabindex="-1" role="dialog" aria-labelledby="editModal" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="editModal">Update Fee Amount</h5>
                    <button data-bs-dismiss="modal" type="button"
                        class="btn-sm btn btn-icon btn-label-github waves-effect close" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                {!! html()->form('PUT', route('admin.fee.store'))->id('ajaxEditForm')->open() !!}
                <div class="modal-body">
                    <div class="form-group mt-1">
                        <x-input name="fee" id="edit"/>
                    </div>
                    <div class="form-group mt-1">
                        <x-select name="feeType" class="select2"
                            :value=" old('feeType')"
                            :list="\App\Utils\SelectionList::feeTypeList()" label='Fee Type' id="edit"   placeholderSelect2="Fee Type" />
                    </div>
                    <div class="form-group mt-1">
                            <x-select name="class" class="select2"
                            :value=" old('class')"
                            :list="\App\Utils\SelectionList::classList()" label='Class' id="edit"   placeholderSelect2="Class" />
                    </div>
                    <div class="form-group mt-1">
                        <x-select name="month" class="select2"
                            :value=" old('month')"
                            :list="\App\Utils\SelectionList::monthList()" label='Month' id="edit"   placeholderSelect2="Month" />
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
@endsection

@push('script')
    <script src="{{ publicPath('assets/vendor/libs/select2/select2.js') }}"></script>
    <script src="{{ publicPath('assets/js/forms-selects.js') }}"></script>
    <script>
        const updateSliderStatus = (event) => {
            const dataUrl = event.target.getAttribute('data-url');
            const status = event.target.checked ? 'Active' : 'Blocked';
            const data = {
                status: status
            };
            const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

            toastr.options.timeOut = 1000;
            console.log(dataUrl);
            fetch(dataUrl, {
                    method: 'PUT',
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
                    toastr.success(`Slider Status Updated to ${status}`);
                })
                .catch(error => {
                    toastr.error(error);
                });
        };

    </script>
    <script>
        $(document).ready(function() {
            $('#myTable').DataTable({
                "paging": true,
                "ordering": true,
                "info": true,
                "searching": true,
             "lengthMenu": [[5, 10, 25, 50, -1], [5, 10, 25, 50, "All"]],

                "language": {
                    "search": "Search Records:",
                    "lengthMenu": "Show _MENU_ entries",
                    "info": "Showing _START_ to _END_ of _TOTAL_ entries",
                }
            });
        });
    </script>

@endpush
