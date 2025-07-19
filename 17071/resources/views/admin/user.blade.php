@extends('admin.layouts.main')
@push('header')
<title>Staff List</title>
@endpush
@section('content')
@isset($users)
<div class="card">
    <h5 class="card-header">Agent LIST</h5>
    <div class="card-body">
           <a class="btn btn-sm btn-primary waves-effect waves-light" href="{{ route('admin.user.create') }}">Add
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
                    <th>Email</th>
                    <th>Status</th>
                    <th class="text-center" width="10%">Action</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($users as $user)
                <tr>
                    <td>{{ $user->id }}</td>
                    <td>
                        <div class="image">
                            <img src="{{ route('assets-resize', ['folder' => 'managers', 'file' => $user->profile_pic, 'h' => 50, 'w' => 50]) }}"
                                alt="{{ $user->name }}">
                        </div>
                    </td>
                    <td>{{ $user->name }}</td>
                    <td>{{ $user->mobile }}</td>
                    <td>{{ $user->email }}</td>

                    <td>
                        {!! getStatusColor($user->status) !!}
                    </td>

                    <td>
                        <div class="dropdown">
                            <button type="button" class="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                                <i class="mdi mdi-dots-vertical"></i>
                            </button>
                            <div class="dropdown-menu">

                                <a class="dropdown-item" href="{{ route('admin.userLogin', $user->id) }}"><i
                                        class="mdi mdi-login-variant me-1"></i> Login</a>
                                <a class="dropdown-item" href="{{ route('admin.userAttendance', $user->id) }}"><i
                                        class="mdi mdi-format-align-center me-1"></i> Attendance</a>


                            </div>
                        </div>
                    </td>
                </tr>
                @endforeach
            </tbody>
        </table>
    </div>
    <div class="d-flex justify-content-end px-4 py-4">
        {!! $users->links() !!}
    </div>
</div>
@else
<div class="card">
    @if (isset($user))
    {!! html()->form('PUT', route('admin.user.update', $user->id))->attribute('enctype',
    'multipart/form-data')->open() !!}
    @else
    {!! html()->form('POST', route('admin.user.store'))->attribute('enctype', 'multipart/form-data')->open() !!}
    @endif
    <h5 class="card-header">{{ isset($user) ? 'UPDATE' : 'ADD' }} Agent</h5>
    <div class="card-body">
        <div class="row">
            <div class="col-md-4 my-2">
                <x-input name="name" value="{{ isset($user) ? $user->name : old('name') }}" />
            </div>
            <div class="col-md-4 my-2">
                <x-input name="email" value="{{ isset($user) ? $user->email : old('email') }}" />
            </div>
            <div class="col-md-4 my-2">
                <x-input name="mobile" value="{{ isset($user) ? $user->mobile : old('mobile') }}" />
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
                    value="{{ isset($user) ? $user->gender : old('gender') }}" />
            </div>
        </div>
        <div class="row d-none">
            <div class="col-lg-4  my-2">
                <x-select name="country_id" label="Country" :placeholder="false" placeholderSelect2="Country"
                    :list="\App\Utils\SelectionList::countryList()"
                    value="{{ isset($user->city->state) ? $user->city->state->country_id : old('country_id') }}"
                    class="select2" />
            </div>
            <div class="col-lg-4  my-2">
                <x-select name="state_id" label="State" :placeholder="false" placeholderSelect2="State" :list="\App\Utils\SelectionList::stateList(
                        isset($user->city->state) ? $user->city->state->country_id : old('country_id'),
                    )" value="{{ isset($user->city->state) ? $user->city->state_id : old('state_id') }}"
                    class="select2" />
            </div>
            <div class="col-lg-4  my-2">
                <x-select name="city_id" label="City" :placeholder="false" placeholderSelect2="City" :list="\App\Utils\SelectionList::cityList(
                        isset($user->city) ? $user->city->state_id : old('state_id'),
                    )" value="{{ isset($user) ? $user->city_id : old('city_id') }}" class="select2" />
            </div>
        </div>
         <div class="col-lg-12 mt-2">

                        <x-select name="manager_id" required="true" class="select2"
                            :value="isset($lead) ? $lead->manager_id : old('manager_id')"
                            :list="\App\Utils\SelectionList::managerList()" Placeholder="Manager " label='Manager' />

                    </div>
        <div class="row">
            <div class="col-md-12 my-2">
                <x-text-area name="remark" value="{{ isset($user) ? $user->remark : old('remark') }}" />
            </div>
        </div>


        <div class="d-flex justify-content-end pt-3">
            <button type="submit" class="btn btn-primary">{{ isset($user) ? 'Update' : 'Add' }}</button>
        </div>
    </div>
    {!! html()->closeModelForm() !!}
</div>
@endisset

@endsection

