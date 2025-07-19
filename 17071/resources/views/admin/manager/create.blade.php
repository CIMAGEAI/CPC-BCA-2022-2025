@extends('admin.layouts.main')
@push('header')
<title>{{ isset($manager) ? 'Update' : 'Add' }} Manager</title>
<link rel="stylesheet" href="{{ publicPath('assets/vendor/libs/select2/select2.css') }}" />
@endpush
@section('content')
<div class="card">
    @if (isset($manager))
    {!! html()->form('PUT', route('admin.manager.update', $manager->id))->attribute('enctype',
    'multipart/form-data')->open() !!}
    @else
    {!! html()->form('POST', route('admin.manager.store'))->attribute('enctype', 'multipart/form-data')->open() !!}
    @endif
    <h5 class="card-header">{{ isset($manager) ? 'UPDATE' : 'ADD' }} Team Leader</h5>
    <div class="card-body">
        <div class="row">
            <div class="col-md-4 my-2">
                <x-input name="name" value="{{ isset($manager) ? $manager->name : old('name') }}" />
            </div>
            <div class="col-md-4 my-2">
                <x-input name="email" value="{{ isset($manager) ? $manager->email : old('email') }}" />
            </div>
            <div class="col-md-4 my-2">
                <x-input name="mobile" value="{{ isset($manager) ? $manager->mobile : old('mobile') }}" />
            </div>
        </div>
        <div class="row">
            <div class="col-md-4 my-2">
                <x-input name="password" value="{{ old('password') }}" />
            </div>
            <div class="col-md-4 my-2">
                <x-file name="image" />
            </div>
            <div class="col-md-4 my-2">
                <x-select name="gender" :list="\App\Utils\SelectionList::genderList()"
                    value="{{ isset($manager) ? $manager->gender : old('gender') }}" />
            </div>
        </div>
        <div class="row d-none">
            <div class="col-lg-4  my-2">
                <x-select name="country_id" label="Country" :placeholder="false" placeholderSelect2="Country"
                    :list="\App\Utils\SelectionList::countryList()"
                    value="{{ isset($manager->city->state) ? $manager->city->state->country_id : old('country_id') }}"
                    class="select2" />
            </div>
            <div class="col-lg-4  my-2">
                <x-select name="state_id" label="State" :placeholder="false" placeholderSelect2="State" :list="\App\Utils\SelectionList::stateList(
                        isset($manager->city->state) ? $manager->city->state->country_id : old('country_id'),
                    )" value="{{ isset($manager->city->state) ? $manager->city->state_id : old('state_id') }}"
                    class="select2" />
            </div>
            <div class="col-lg-4  my-2">
                <x-select name="city_id" label="City" :placeholder="false" placeholderSelect2="City" :list="\App\Utils\SelectionList::cityList(
                        isset($manager->city) ? $manager->city->state_id : old('state_id'),
                    )" value="{{ isset($manager) ? $manager->city_id : old('city_id') }}" class="select2" />
            </div>
        </div>
        <div class="row">
            <div class="col-md-12 my-2">
                <x-text-area name="remark" value="{{ isset($manager) ? $manager->remark : old('remark') }}" />
            </div>
        </div>


        <div class="d-flex justify-content-end pt-3">
            <button type="submit" class="btn btn-primary">{{ isset($manager) ? 'Update' : 'Add' }}</button>
        </div>
    </div>
    {!! html()->closeModelForm() !!}
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
