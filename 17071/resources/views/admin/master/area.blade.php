@extends('admin.layouts.main')
@push('header')
<title>Manage Area</title>
<link rel="stylesheet" href="{{ publicPath('assets/vendor/libs/select2/select2.css') }}" />
<style>
    table tr td,
    table tr th {
        padding: 5px 1rem;
        border: 1px solid;
    }
</style>
@endpush
@section('content')
@if (isset($areas))
<div class="card">
    <h5 class="card-header">Manage Area</h5>
    <div class="card-body">
        <a class="btn btn-primary btn-sm" href="{{ route('admin.area.create') }}">Add New</a>
        {!! html()->form('GET', url()->current())->open() !!}
        <div class="row gap-2 gap-md-0 mt-4">
            <div class="col-md-3">
                <x-input name="pincode" :value="request()->get('pincode')" :label="false" />
            </div>
            <div class="col-md-3">
                <x-input name="area" :value="request()->get('area')" :label="false" />
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
                    <th>Counrty</th>
                    <th>State</th>
                    <th>City</th>
                    <th>Pincode</th>
                    <th>Area</th>
                    <th>Status</th>
                    <th class="text-center" width="10%">Action</th>
                </tr>
            </thead>
            <tbody>

                @foreach ($areas as $area)
                <tr>
                    <td>{{ isset($area->pincode->city->state->country->name)?$area->pincode->city->state->country->name:null }}</td>
                    <td>{{ isset($area->pincode->city->state->name)?$area->pincode->city->state->name:null }}</td>
                    <td>{{ isset($area->pincode->city->name)?$area->pincode->city->name:null }}</td>
                    <td>{{ isset($area->pincode->pincode) ? $area->pincode->pincode :null}}</td>
                    <td>{{ $area->area }}</td>
                    <td>
                        <div class="form-check form-switch mb-2">
                            <input class="form-check-input" value="Active" onchange="updateAreaStatus(event)"
                                data-id="{{ $area->id }}" type="checkbox" id="flexSwitchCheckChecked" {{ $area->status
                            == 'Active' ? 'checked' : null }}>
                        </div>
                    </td>
                    <td>
                        <div class="dropdown">
                            <button type="button" class="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                                <i class="mdi mdi-dots-vertical"></i>
                            </button>
                            <div class="dropdown-menu">
                                <a class="dropdown-item" href="{{ route('admin.area.edit',$area->pincode->id) }}"><i
                                        class="mdi mdi-pencil-outline me-1"></i> Edit</a>
                                {!! html()->form('DELETE', route('admin.area.destroy',
                                $area->id))->attribute('onsubmit', 'return ConfirmDestroy(event)')->open() !!}
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
        {!! $areas->links() !!}
    </div>
</div>
@else
<div class="card">
  @if (isset($pincode))
    {!! html()->form('PUT', route('admin.area.update', $pincode->id))->open() !!}
@else
    {!! html()->form('POST', route('admin.area.store'))->open() !!}
@endif

<h5 class="card-header">{{ isset($pincode) ? 'UPDATE' : 'ADD' }} Pincode</h5>
<div class="card-body">
    <div class="row">
        <div class="col-lg-3 my-2">
            <x-select name="country_id" label="Country" :placeholder="false" placeholderSelect2="Country"
                :list="\App\Utils\SelectionList::countryList(isset($pincode->city->state) ? $pincode->city->state->country_id : old('country_id'))"
                value="{{ isset($pincode->city->state) ? $pincode->city->state->country_id : old('country_id') }}"
                class="select2" />
        </div>

        <div class="col-lg-3 my-2">
            <x-select name="state_id" label="State" :placeholder="false" placeholderSelect2="State"
                :list="\App\Utils\SelectionList::stateList(isset($pincode) ? $pincode->city->state->country_id : old('country_id'))"
                value="{{ isset($pincode) ? $pincode->city->state_id : old('state_id') }}" class="select2" />
        </div>

        <div class="col-lg-3 my-2">
            <x-select name="city_id" label="City" :placeholder="false" placeholderSelect2="City"
                :list="\App\Utils\SelectionList::cityList(isset($pincode) ? $pincode->city->state_id : old('state_id'))"
                value="{{ isset($pincode) ? $pincode->city_id : old('city_id') }}" class="select2" />
        </div>

        <div class="col-lg-3 my-2">
            <x-select name="pincode_id" label="Pincode" :placeholder="false" placeholderSelect2="Pincode"
                :list="\App\Utils\SelectionList::pincode(isset($pincode) ? $pincode->id : old('pincode_id'))"
                value="{{ isset($pincode) ? $pincode->id : old('pincode_id') }}" class="select2" />
        </div>
    </div>

    <div class="row p-2">
        <table id="areaTable" style="width: 100%" border="1">
            <thead>
                <tr>
                    <th>Area</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                @if (old('area'))
                    @foreach (old('area') as $index => $area)
                        <tr>
                            <td>
                                <x-input name="area[]" :label="false" placeholder="Enter Area Name" value="{{ $area }}" />
                            </td>
                            <td>
                                @if($index > 0)
                                    <button type="button" class="removeRowBtn btn btn-sm btn-danger">Delete</button>
                                @endif
                            </td>
                        </tr>
                    @endforeach
                @else
                    @if (isset($pincode->areas) && $pincode->areas->count() > 0)
                        @foreach ($pincode->areas as $index => $area)
                            <tr>
                                <td>
                                    <x-input name="area[]" :label="false" placeholder="Enter Area Name" value="{{ $area->area }}" />
                                        <input type="hidden" name="area_ids[]" value="{{ $area->id }}" />
                                    </td>
                                <td>
                                    @if($index > 0)
                                        <button type="button" class="removeRowBtn btn btn-sm btn-danger">Delete</button>
                                    @endif
                                </td>
                            </tr>
                        @endforeach
                    @else
                        <tr>
                            <td>
                                <x-input name="area[]" :label="false" placeholder="Enter Area Name"
                                    value="{{ old('pincode') }}" />
                            </td>
                            <td></td>
                        </tr>
                    @endif
                @endif
            </tbody>
        </table>
        <div class="mt-2">
            <button type="button" class="btn btn-sm btn-primary" id="addRowBtn">Add Row</button>
        </div>
    </div>

    <div class="mt-2 text-end">
        <button type="submit" class="btn btn-sm btn-primary">{{ isset($pincode)?'Update':'Submit' }}</button>
    </div>
</div>

{!! html()->form()->close() !!}

</div>
@endif
@endsection
@push('script')
<script src="{{ publicPath('assets/vendor/libs/select2/select2.js') }}"></script>
<script src="{{ publicPath('assets/js/forms-selects.js') }}"></script>
<script>
    const updateAreaStatus = (event) => {
            const dataUrl = "{{ route('admin.areaStatus') }}";
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
                    toastr.success(`Area Status Updated to ${status}`);
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
        const pincodeList = $('select[name="pincode_id"]');
        countryList.select2();
        stateList.select2();
        cityList.select2();
        pincodeList.select2();

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

        function fetchPincode(event) {
            xhr.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    const result = JSON.parse(xhr.response);
                    pincodeList.empty();
                    pincodeList.append('<option value="">Select Pincode</option>');
                    console.log(result.data);
                    result.data.forEach(element => {
                        var option = new Option(element.pincode, element.id, false, false);
                        pincodeList.append(option);
                    });
                    pincodeList.trigger('change');
                }
            };
            xhr.open('GET', '{{ route('ajax.fetch-pincode-list') }}' + '?city_id=' + event.target.value);
            xhr.setRequestHeader("Content-type", "application/json; charset=utf-8");
            xhr.send();
        }

        countryList.on('change', fetchState);
        stateList.on('change', fetchCity);
        cityList.on('change', fetchPincode);
</script>

<script>
    $(document).ready(function() {
        $('#addRowBtn').click(function() {
            var newRow = `
                <tr>
                    <td>
                        <x-input name="area[]" :label="false" placeholder="Enter Area Name" value="" />
                    </td>
                    <td>
                        <button type="button" class="removeRowBtn btn btn-sm btn-danger">Delete</button>
                    </td>
                </tr>`;
            $('#areaTable tbody').append(newRow);
        });

        $(document).on('click', '.removeRowBtn', function() {
            $(this).closest('tr').remove();
        });
    });
</script>
@endpush
