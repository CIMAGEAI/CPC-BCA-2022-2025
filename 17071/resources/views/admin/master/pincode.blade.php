@extends('admin.layouts.main')
@push('header')
<title>Manage Pincode</title>
<link rel="stylesheet" href="{{ publicPath('assets/vendor/libs/select2/select2.css') }}" />
@endpush
@section('content')
@if (isset($pincodes))
<div class="card">
    <h5 class="card-header">Manage Pincode</h5>
    <div class="card-body">
        <a class="btn btn-primary btn-sm" href="{{ route('admin.pincode.create') }}">Add New</a>
        {!! html()->form('GET', url()->current())->open() !!}
        <div class="row gap-2 gap-md-0 mt-4">
            <div class="col-md-3">
                <x-input name="pincode" :value="request()->get('pincode')" :label="false" />
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
                    <th>Pincode</th>
                    <th>Status</th>
                    <th class="text-center" width="10%">Action</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($pincodes as $pincode)
                <tr>
                    <td>{{  isset($pincode->city->state->country->name)?$pincode->city->state->country->name:null  }}</td>
                    <td>{{ isset($pincode->city->state->name)?$pincode->city->state->name:null }}</td>
                    <td>{{ isset($pincode->city->name)?$pincode->city->name:null }}</td>
                    <td>{{ $pincode->pincode }}</td>
                    <td>
                        <div class="form-check form-switch mb-2">
                            <input class="form-check-input" value="Active" onchange="updatePincodeStatus(event)"
                                data-id="{{ $pincode->id }}" type="checkbox"
                                id="flexSwitchCheckChecked" {{ $pincode->status == 'Active' ? 'checked' : null }}>
                        </div>
                    </td>
                    <td>
                        <div class="dropdown">
                            <button type="button" class="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                                <i class="mdi mdi-dots-vertical"></i>
                            </button>
                            <div class="dropdown-menu">
                                <a class="dropdown-item" href="{{ route('admin.pincode.edit',$pincode->id) }}"><i
                                        class="mdi mdi-pencil-outline me-1"></i> Edit</a>
                                {!! html()->form('DELETE', route('admin.pincode.destroy',
                                $pincode->id))->attribute('onsubmit', 'return ConfirmDestroy(event)')->open() !!}
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
        {!! $pincodes->links() !!}
    </div>
</div>
@else
<div class="card">
    @if (isset($pincode))
    {!! html()->form('PUT', route('admin.pincode.update', $pincode->id))->open() !!}
    @else
    {!! html()->form('POST', route('admin.pincode.store'))->open() !!}
    @endif
    <h5 class="card-header">{{ isset($pincode) ? 'UPDATE' : 'ADD' }} Pincode</h5>
    <div class="card-body">
        <div class="row">
            <div class="col-lg-4  my-2">
                <x-select name="country_id" label="Country" :placeholder="false" placeholderSelect2="Country"
                    :list="\App\Utils\SelectionList::countryList(isset($pincode->city->state) ? $pincode->city->state->country_id : old('country_id'))"
                    value="{{ isset($pincode->city->state) ? $pincode->city->state->country_id : old('country_id') }}"
                    class="select2" />
            </div>
            <div class="col-lg-4  my-2">
                <x-select name="state_id" label="State" :placeholder="false" placeholderSelect2="State" :list="\App\Utils\SelectionList::stateList(
                        isset($pincode) ? $pincode->city->state->country_id : old('country_id'),
                    )" value="{{ isset($pincode) ? $pincode->city->state_id : old('state_id') }}" class="select2" />
            </div>
            <div class="col-lg-4  my-2">
                <x-select name="city_id" label="City" :placeholder="false" placeholderSelect2="City" :list="\App\Utils\SelectionList::cityList(
                        isset($pincode) ? $pincode->city->state_id : old('state_id'),
                    )" value="{{ isset($pincode) ? $pincode->city_id : old('city_id') }}" class="select2" />
            </div>
            <div class="col-md-12 my-2">
                <x-input name="pincode" value="{{ isset($pincode) ? $pincode->pincode : old('pincode') }}" />
            </div>
        </div>
        <div class="d-flex justify-content-end pt-3">
            <button type="submit" class="btn btn-primary">{{ isset($pincode) ? 'Update' : 'Add' }}</button>
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
    const updatePincodeStatus = (event) => {
            const dataUrl = "{{ route('admin.pincodeStatus') }}";
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
                    toastr.success(`Pincode Status Updated to ${status}`);
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
        const cityList = $('select[name="city_id"]');
        countryList.select2();
        stateList.select2();
        cityList.select2();

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

        function fetchCity(event) {
            xhr.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    const result = JSON.parse(xhr.response);
                    cityList.empty();
                    cityList.append('<option value="">Select City</option>');
                    result.data.forEach(element => {
                        var option = new Option(element.name, element.id, false, false);
                        cityList.append(option);
                    });
                    cityList.trigger('change');
                }
            };
            xhr.open('GET', '{{ route('ajax.fetch-city-list') }}' + '?state_id=' + event.target.value);
            xhr.setRequestHeader("Content-type", "application/json; charset=utf-8");
            xhr.send();
        }

        countryList.on('change', fetchState);
        stateList.on('change', fetchCity);
</script>
@endpush
