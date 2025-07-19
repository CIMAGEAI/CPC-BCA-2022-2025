@extends('admin.layouts.main')
@push('header')
<title>{{ isset($admin) ? 'Update' : 'Add' }} Manager</title>
<link rel="stylesheet" href="{{ publicPath('assets/vendor/libs/select2/select2.css') }}" />
<style>
    .custom-multi-select {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    .auth-select {
        width: 100%;
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 5px;
        font-size: 14px;
    }

    .selected-list {
        list-style: none;
        padding: 0;
        margin: 0;
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
    }

    .selected-list li {
        background: #007bff;
        color: white;
        padding: 5px 10px;
        border-radius: 5px;
        font-size: 14px;
        display: flex;
        align-items: center;
        gap: 5px;
    }

    .selected-list li .remove-option {
        background: transparent;
        border: none;
        color: white;
        font-weight: bold;
        font-size: 16px;
        cursor: pointer;
    }

    .selected-list li .remove-option:hover {
        color: #ff4d4d;
    }

    .errorText {
        color: red;
        font-size: 12px;
    }

    table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 20px;
    }

    th {
        background: #f4f4f4;
        text-align: left;
        padding: 10px;
        border: 1px solid #ddd;
    }

    td {
        padding: 10px;
        border: 1px solid #ddd;
    }
</style>

@endpush
@section('content')
<div class="card">
    @if (isset($admins))
    <h5 class="card-header">Admin LIST</h5>

    <div class="card-body">
        <a class="btn btn-sm btn-primary waves-effect waves-light" href="{{ route('admin.staff-admin.create') }}">Add
            New</a>
    </div>
    <div class="table-responsive text-nowrap">
        <table class="table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Phone</th>
                    <th>Authorization</th>
                    <th>Email</th>
                    <th class="text-center" width="10%">Action</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($admins as $admin)
                <tr>
                    <td>{{ $admin->id }}</td>
                    <td>
                        <div class="image">
                            <img src="{{ route('assets-resize', ['folder' => 'admins', 'file' => $admin->profile_pic, 'h' => 50, 'w' => 50]) }}"
                                alt="{{ $admin->name }}">
                        </div>
                    </td>
                    <td>{{ $admin->name }}</td>
                    <td>{{ $admin->mobile }}</td>

                    <td>

                        @php
                        $authorizations = $admin->authorization ?? [];
                        @endphp

                        <div class="d-flex gap-1" style="width: 400px; flex-wrap: wrap">
                            @foreach($authorizations as $authorization)
                            <small class="bg-success text-white p-2" style="border-radius: 5px"> {{
                                $authorization['value'] }}</small>
                            @endforeach
                        </div>
                    </td>
                    <td>{{ $admin->email }}</td>

                    <td>
                        <div class="dropdown">
                            <button type="button" class="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                                <i class="mdi mdi-dots-vertical"></i>
                            </button>
                            <div class="dropdown-menu">

                                <a class="dropdown-item" href="{{ route('admin.staff-admin.edit', $admin->id) }}"><i
                                        class="mdi mdi-pencil-outline me-1"></i> Edit</a>



                                {!! html()->form('DELETE', route('admin.staff-admin.destroy',
                                $admin->id))->attribute('onsubmit', 'return ConfirmDestroy(event)')->open() !!}
                                <button class="dropdown-item" type="submit">
                                    <i class="mdi mdi-trash-can-outline me-1"></i> Delete
                                </button>
                                {!! html()->closeModelForm() !!}

                            </div>
                        </div>
                    </td>
                </tr>
                @endforeach
            </tbody>
        </table>
    </div>
    @else
    @if (isset($admin))
    {!! html()->form('PUT', route('admin.staff-admin.update', $admin->id))->attribute('enctype',
    'multipart/form-data')->open() !!}
    @else
    {!! html()->form('POST', route('admin.staff-admin.store'))->attribute('enctype', 'multipart/form-data')->open() !!}
    @endif
    <h5 class="card-header">{{ isset($admin) ? 'UPDATE' : 'ADD' }} Staff Admin</h5>
    <div class="card-body">
        <div class="row">
            <div class="col-md-4 my-2">
                <x-input name="name" value="{{ isset($admin) ? $admin->name : old('name') }}" />
            </div>
            <div class="col-md-4 my-2">
                <x-input name="email" value="{{ isset($admin) ? $admin->email : old('email') }}" />
            </div>
            <div class="col-md-4 my-2">
                <x-input name="mobile" value="{{ isset($admin) ? $admin->mobile : old('mobile') }}" />
            </div>
        </div>

        <div class="row">
            <div class="col-md-4 my-2">
                <x-input name="password" value="{{ old('password') }}" />
            </div>
            <div class="col-md-4 my-2">
                <x-file name="image" />
            </div>
        </div>

        <div class="row d-none">
            <div class="col-lg-4  my-2">
                <x-select name="country_id" label="Country" :placeholder="false" placeholderSelect2="Country"
                    :list="\App\Utils\SelectionList::countryList()"
                    value="{{ isset($admin->city->state) ? $admin->city->state->country_id : old('country_id') }}"
                    class="select2" />
            </div>
            <div class="col-lg-4  my-2">
                <x-select name="state_id" label="State" :placeholder="false" placeholderSelect2="State" :list="\App\Utils\SelectionList::stateList(
                                isset($admin->city->state) ? $admin->city->state->country_id : old('country_id'),
                            )" value="{{ isset($admin->city->state) ? $admin->city->state_id : old('state_id') }}"
                    class="select2" />
            </div>
            <div class="col-lg-4  my-2">
                <x-select name="city_id" label="City" :placeholder="false" placeholderSelect2="City" :list="\App\Utils\SelectionList::cityList(
                                isset($admin->city) ? $admin->city->state_id : old('state_id'),
                            )" value="{{ isset($admin) ? $admin->city_id : old('city_id') }}" class="select2" />
            </div>

        </div>
        <div class="row pt-3">

            @php
            $options = [
            'Lead History' => 'Lead History',
            'Lead Import Export' => 'Lead Import Export',

            'Lead Source' => 'Lead Source',
            'Manage Lead' => 'Manage Lead',

            'Add Lead' => 'Add Lead',
            'Edit Lead' => 'Edit Lead',
            'Delete Lead' => 'Delete Lead',
            'Assign Lead' =>'Assign Lead',
            'Bulk Assign Lead' => 'Bulk Assign Lead',
            'Paid Client History' => 'Paid Client History',
            ];
            @endphp

            <div>
                @isset($admin)
                @php
                $authorizations = collect($admin->authorization ?? [])->pluck('value')->toArray();

                @endphp

                <div class="d-flex gap-2" style=" flex-wrap: wrap">
                    @foreach($options as $key => $label)
                    @php
                    $sl=1;
                    @endphp
                    <x-checkbox id="checkbox_{{ $key }}" name="options[]" label="{{ $label }}" value="{{ $label }}"
                        checked="{{ in_array($label, $authorizations) ? $label : old('options'. $sl) }}" />
                    @php
                    $sl++;
                    @endphp
                    @endforeach
                </div>
                @else
                <div class="d-flex gap-2" style=" flex-wrap: wrap">
                    @foreach($options as $key => $label)
                    <x-checkbox id="checkbox_{{ $key }}" name="options[]" label="{{ $label }}" value="{{ $label }}"
                        checked="{{ in_array($label, old('options', [])) ? 'checked' : '' }}" />

                    @endforeach
                </div>
                @endisset
            </div>

        </div>






        <div class="d-flex justify-content-end pt-3">
            <button type="submit" class="btn btn-primary">{{ isset($admin) ? 'Update' : 'Add' }}</button>
        </div>
    </div>
    {!! html()->closeModelForm() !!}
    @endif

</div>
@endsection
@push('script')
<script src="{{ publicPath('assets/vendor/libs/select2/select2.js') }}"></script>
<script src="{{ publicPath('assets/js/forms-selects.js') }}"></script>
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
