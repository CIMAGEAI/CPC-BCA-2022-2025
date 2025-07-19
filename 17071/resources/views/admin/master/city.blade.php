@extends('admin.layouts.main')
@push('header')
<title>Manage City</title>
<link rel="stylesheet" href="{{ publicPath('assets/vendor/libs/select2/select2.css') }}" />
@endpush
@section('content')
@if (isset($cities))
<div class="card">
    <h5 class="card-header">Manage City</h5>
    <div class="card-body">
        <a class="btn btn-primary btn-sm" href="{{ route('admin.city.create') }}">Add New</a>
        {!! html()->form('GET', url()->current())->open() !!}
        <div class="row gap-2 gap-md-0 mt-4">
            <div class="col-md-2">
                <x-select name="country_id" :label="false" placeholder="false" placeholderSelect2="false"
                    :list="\App\Utils\SelectionList::countryList()"
                    :value="request()->get('country_id')" class="select2" />
            </div>
            <div class="col-md-2">
                <x-select name="state_id" :label="false" :placeholder="false" placeholderSelect2="State" :list="\App\Utils\SelectionList::stateList()" :value="request()->get('state_id')" class="select2" />
            </div>

            <div class="col-md-2 ">
                <x-input name="name"  :value="request()->get('name')" :label="false" />
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
                    <th>Country</th>
                    <th>State</th>
                    <th>City</th>
                    <th>Status</th>
                    <th class="text-center" width="10%">Action</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($cities as $city)
                <tr>
                    <td>{{ isset($city->state->country->name)?$city->state->country->name:null  }}</td>
                    <td>{{ isset($city->state->name) ?$city->state->name :null }}</td>
                    <td>{{ $city->name }}</td>
                    <td>
                        <div class="form-check form-switch mb-2">
                            <input class="form-check-input" value="Active" onchange="updateCityStatus(event)"
                                data-url="{{ route('admin.city.update', $city->id) }}" data-id="{{ $city->id }}"  type="checkbox"
                                id="flexSwitchCheckChecked" {{ $city->status == 'Active' ? 'checked' : null }}>
                        </div>
                    </td>
                    <td>
                        <div class="dropdown">
                            <button type="button" class="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                                <i class="mdi mdi-dots-vertical"></i>
                            </button>
                            <div class="dropdown-menu">
                                <a class="dropdown-item" href="{{ route('admin.city.edit',$city->id) }}"><i
                                        class="mdi mdi-pencil-outline me-1"></i> Edit</a>
                                {!! html()->form('DELETE', route('admin.city.destroy',
                                $city->id))->attribute('onsubmit', 'return ConfirmDestroy(event)')->open() !!}
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
        {!! $cities->links() !!}
    </div>
</div>
@else
<div class="card">
    @if (isset($city))
    {!! html()->form('PUT', route('admin.city.update', $city->id))->open() !!}
    @else
    {!! html()->form('POST', route('admin.city.store'))->open() !!}
    @endif
    <h5 class="card-header">{{ isset($city) ? 'UPDATE' : 'ADD' }} City</h5>
    <div class="card-body">
        <div class="row">
            <div class="col-lg-4  my-2">
                <x-select name="country_id" label="Country" :placeholder="false" placeholderSelect2="Country"
                    :list="\App\Utils\SelectionList::countryList()"
                    value="{{ isset($city) ? $city->state->country_id : old('country_id') }}" class="select2" />
            </div>
            <div class="col-lg-4  my-2">
                <x-select name="state_id" label="State" :placeholder="false" placeholderSelect2="State" :list="\App\Utils\SelectionList::stateList(
                        isset($city) ? $city->state->country_id : old('country_id'),
                    )" value="{{ isset($city) ? $city->state_id : old('state_id') }}" class="select2" />
            </div>
            <div class="col-md-4 my-2">
                <x-input name="name" value="{{ isset($city) ? $city->name : old('name') }}" />
            </div>
        </div>
        <div class="d-flex justify-content-end pt-3">
            <button type="submit" class="btn btn-primary">{{ isset($city) ? 'Update' : 'Add' }}</button>
        </div>
    </div>
    {!! html()->closeModelForm() !!}
</div>
@endif
@endsection
@push('script')
<script src="{{ publicPath('assets/vendor/libs/select2/select2.js') }}"></script>
<script src="{{ publicPath('assets/js/forms-selects.js') }}"></script>
<script>
    const updateCityStatus = (event) => {
            const dataUrl = "{{ route('admin.cityStatus') }}"
            const id = event.target.getAttribute('data-id');
            const status = event.target.checked ? 'Active' : 'Blocked';
            const data = {
                status: status,
                id:id
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
                    toastr.success(`City Status Updated to ${status}`);
                })
                .catch(error => {
                    toastr.error(error);
                });
        };
</script>
<script>
    const xhr = new XMLHttpRequest();
        const countryList = $('select[name="country_id"]');
        const stateList = $('select[name="state_id"]');
        countryList.select2();
        stateList.select2();
        function fetchState(event) {
            xhr.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    const result = JSON.parse(xhr.response);
                    stateList.empty();
                    stateList.append('<option value="">Select State</option>');
                    result.data.forEach(element => {
                        var option = new Option(element.name, element.id, false, false);
                        stateList.append(option);
                    });
                    stateList.trigger('change');
                }
            };
            xhr.open('GET', '{{ route('ajax.fetch-state-list') }}' + '?country_id=' + event.target.value);
            xhr.setRequestHeader("Content-type", "application/json; charset=utf-8");
            xhr.send();
        }
        countryList.on('change', fetchState);
</script>
@endpush
