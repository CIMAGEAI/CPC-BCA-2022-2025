@extends('admin.layouts.main')
@push('header')
    <title>Manage Category</title>
    <link rel="stylesheet" href="{{ publicPath('assets/vendor/libs/select2/select2.css') }}" />
@endpush
@section('content')
    <div class="card">
        <h5 class="card-header">Manage Meta Data</h5>
        <div class="card-body">
            <button class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#exampleModal">Add New</button>
            {!! html()->form('GET', url()->current())->open() !!}
            <div class="row align-items-center mt-3">
                <div class="col-md-3">
                    <x-input name="name" :value="request()->get('name')" :label="false" />
                </div>

                <div class="col-md-3">
                    <x-select name="status" placeholderSelect2="status" :placeholder="false" class="select2" :list="\App\Utils\SelectionList::statusList()"
                        :value="request()->get('status')" :label="false" />
                </div>
                <div class="col-md-4">
                    <div class="d-flex">
                        <input type="submit" class="btn btn-primary btn-sm me-3" value="Search">
                        <a href="{{ url()->current() }}" class="btn btn-secondary btn-sm text-white">Reset</a>
                    </div>
                </div>
            </div>


            {{ html()->form()->close() }}
        </div>

        <div class="table-responsive text-nowrap">
            <table class="table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Value</th>
                        <th>Status</th>
                        <th class="text-center" width="10%">Action</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach ($metadatas as $metaData)
                        <tr>
                            <td>{{ $metaData->key }}</td>
                            <td>{{ $metaData->value }}</td>
                            <td>
                                <div class="form-check form-switch mb-2">
                                    <input class="form-check-input" value="Active" onchange="updateMetaDataStatus(event)"
                                        data-url="{{ route('admin.metadata.update', $metaData->id) }}" type="checkbox"
                                        id="flexSwitchCheckChecked" {{ $metaData->status == 'Active' ? 'checked' : null }}>
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
                                            data-bs-target="#editDataModal" data-bs-key="{{ $metaData->key }}"
                                            data-bs-value="{{ $metaData->value }}"
                                            data-bs-url="{{ route('admin.metadata.update', $metaData->id) }}"><i
                                                class="mdi mdi-pencil-outline me-1"></i> Edit</button>
                                        {!! html()->form('DELETE', route('admin.metadata.destroy', $metaData->id))->attribute('onsubmit', 'return ConfirmDestroy(event)')->open() !!}
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
        </div>
    </div>

    <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModal"
        aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModal">Add Meta Data</h5>
                    <button data-bs-dismiss="modal" type="button"
                        class="btn-sm btn btn-icon btn-label-github waves-effect close" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                {!! html()->form('POST', route('admin.metadata.store'))->id('ajaxForm')->open() !!}
                <div class="modal-body">
                    <div class="form-group mt-1">
                        <x-input name="key" />
                    </div>
                    <div class="form-group mt-1">
                        <x-input name="value" />
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
                    <h5 class="modal-title" id="editModal">Update Meta Data</h5>
                    <button data-bs-dismiss="modal" type="button"
                        class="btn-sm btn btn-icon btn-label-github waves-effect close" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                {!! html()->form('PUT', route('admin.metadata.store'))->id('ajaxEditForm')->open() !!}
                <div class="modal-body">
                    <div class="form-group mt-1">
                        <x-input name="key" id="edit" />
                    </div>
                    <div class="form-group mt-1">
                        <x-input name="value" id="edit" />
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
        const updateMetaDataStatus = (event) => {
            const dataUrl = event.target.getAttribute('data-url');
            const status = event.target.checked ? 'Active' : 'Blocked';
            const data = {
                status: status
            };
            const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
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
                    toastr.success(`Meta Data Status Updated to ${status}`);
                })
                .catch(error => {
                    toastr.error(error);
                });
        };
    </script>
@endpush
