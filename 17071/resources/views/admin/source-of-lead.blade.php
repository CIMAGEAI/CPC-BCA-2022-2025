@extends('admin.layouts.main')
@push('header')
<title>Source of lead </title>
<link rel="stylesheet" href="{{ publicPath('assets/vendor/libs/select2/select2.css') }}" />
@endpush
@section('content')
<div class="card">
    <h5 class="card-header">Manage Source Of Lead</h5>
    <div class="card-body">
        <button class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#exampleModal">Add New</button>
    </div>

    <div class="table-responsive text-nowrap">
        <table class="table">
            <thead>
                <tr>
                    <th>Name </th>
                    <th>Status</th>
                    <th class="text-center" width="10%">Action</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($sources as $source)
                <tr>
                    <td>{{ $source->name }}</td>
                    <td>
                        <div class="form-check form-switch mb-2">
                            <input class="form-check-input" value="Active" onchange="updateSliderStatus(event)"
                                data-url="{{ route('admin.source-of-lead.update', $source->id) }}" type="checkbox"
                                id="flexSwitchCheckChecked" {{ $source->status == 'Active' ? 'checked' : null }}>
                        </div>
                    </td>
                    <td>
                        <div class="dropdown">
                            <button type="button" class="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                                <i class="mdi mdi-dots-vertical"></i>
                            </button>
                            <div class="dropdown-menu">
                                <button class="dropdown-item editBtn" data-bs-toggle="modal"
                                    data-bs-target="#editDataModal"
                                    data-bs-name="{{ $source->name }}"
                                    data-bs-url="{{ route('admin.source-of-lead.update', $source->id) }}"><i
                                        class="mdi mdi-pencil-outline me-1"></i> Edit</button>
                                {!! html()->form('DELETE', route('admin.source-of-lead.destroy',
                                $source->id))->attribute('onsubmit', 'return ConfirmDestroy(event)')->open() !!}
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
        {!! $sources->links() !!}
    </div>
</div>

<div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModal" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModal">Add Source Of Lead</h5>
                <button data-bs-dismiss="modal" type="button"
                    class="btn-sm btn btn-icon btn-label-github waves-effect close" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            {!! html()->form('POST', route('admin.source-of-lead.store'))->id('ajaxForm')->open() !!}
            <div class="modal-body">
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
                <h5 class="modal-title" id="editModal">Update Source Of Lead</h5>
                <button data-bs-dismiss="modal" type="button"
                    class="btn-sm btn btn-icon btn-label-github waves-effect close" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            {!! html()->form('PUT', route('admin.source-of-lead.store'))->id('ajaxEditForm')->open() !!}
            <div class="modal-body">
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
@endpush
