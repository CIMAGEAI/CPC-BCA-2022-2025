@extends('admin.layouts.main')
@push('header')
<title>Manage State</title>
<link rel="stylesheet" href="{{ publicPath('assets/vendor/libs/select2/select2.css') }}" />
@endpush
@section('content')
<div class="card">
    <h5 class="card-header">Manage State</h5>
    <div class="card-body">
        <button class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#exampleModal">Add New</button>
        {!! html()->form('GET', url()->current())->open() !!}
        <div class="row gap-2 gap-md-0 mt-4">
            <div class="col-md-3">
                <x-select name="country_id" :label="false" :placeholder="false" placeholderSelect2="Country"
                        :list="\App\Utils\SelectionList::countryList()" :value="request()->get('country_id')"
                        class="select2" />
            </div>
            <div class="col-md-3">
                <x-input name="name" :value="request()->get('name')" :label="false" />
            </div>
            <div class="col-md-2 ">
                <x-select name="status" placeholderSelect2="Status" :placeholder="false" class="select2"
                    :list="\App\Utils\SelectionList::statusList()" :value="request()->get('status')" :label="false" />
            </div>
            <div class="col-md-4">
                <div class="d-flex pb-1 h-100">
                    <input type="submit" class="btn btn-primary btn-sm me-3 align-self-end" value="Search">
                    <a href="{{ url()->current() }}"
                        class="btn btn-secondary btn-sm text-white align-self-end">Reset</a>
                </div>
            </div>
        </div>
        {{ html()->form()->close() }}
    </div>

    <div class="table-responsive text-nowrap">
        <table class="table">
            <thead>
                <tr>
                    <th>Country Name</th>
                    <th>State Name</th>
                    <th>Status</th>
                    <th class="text-center" width="10%">Action</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($states as $state)
                <tr>
                    <td>{{ isset($state->country->name)?$state->country->name:null }}</td>
                    <td>{{ $state->name }}</td>
                    <td>
                        <div class="form-check form-switch mb-2">
                            <input class="form-check-input" value="Active" onchange="updateStateStatus(event)"
                                data-url="{{ route('admin.states.update', $state->id) }}" type="checkbox"
                                id="flexSwitchCheckChecked" {{ $state->status == 'Active' ? 'checked' : null }}>
                        </div>
                    </td>
                    <td>
                        <div class="dropdown">
                            <button type="button" class="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                                <i class="mdi mdi-dots-vertical"></i>
                            </button>
                            <div class="dropdown-menu">
                                <button class="dropdown-item editBtn" data-bs-toggle="modal"
                                    data-bs-target="#editDataModal" data-bs-country_id="{{ $state->name }}"
                                    data-bs-id="{{ $state->id }}" data-bs-name="{{ $state->name }}"
                                    data-bs-url="{{ route('admin.states.update', $state->id) }}"><i
                                        class="mdi mdi-pencil-outline me-1"></i> Edit</button>
                                {!! html()->form('DELETE', route('admin.states.destroy',
                                $state->id))->attribute('onsubmit', 'return ConfirmDestroy(event)')->open() !!}
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
        {!! $states->links() !!}
    </div>
</div>
<div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModal" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModal">Add State</h5>
                <button data-bs-dismiss="modal" type="button"
                    class="btn-sm btn btn-icon btn-label-github waves-effect close" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            {!! html()->form('POST', route('admin.states.store'))->id('ajaxForm')->open() !!}
            <div class="modal-body">
                <div class="form-group mt-1">
                    <x-select name="country_id" label="Country" :placeholder="false" placeholderSelect2="Country"
                        :list="\App\Utils\SelectionList::countryList()" value="{{  old('country_id') }}"
                        class="select2" />
                </div>
                <div class="form-group mt-1">
                    <x-input name="name" />
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
                <h5 class="modal-title" id="editModal">Update State</h5>
                <button data-bs-dismiss="modal" type="button"
                    class="btn-sm btn btn-icon btn-label-github waves-effect close" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            {!! html()->form('PUT', route('admin.states.store'))->id('ajaxEditForm')->open() !!}
            <div class="modal-body">
                <div class="form-group mt-1">
                    <x-select name="country_id" label="Country" :placeholder="false" placeholderSelect2="Country"
                        :list="\App\Utils\SelectionList::countryList()" id="edit" value="{{  old('country_id') }}"
                        class="select2" />
                </div>
                <div class="form-group mt-1">
                    <x-input name="name" id="edit" />
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
    const updateStateStatus = (event) => {
            const dataUrl = event.target.getAttribute('data-url');
            const status = event.target.checked ? 'Active' : 'Blocked';
            const data = {
                status: status
            };
            toastr.options.timeOut = 1000;
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
                    toastr.success(`State Status Updated to ${status}`);
                })
                .catch(error => {
                    toastr.error(error);
                });
        };
</script>
@endpush
