@extends('admin.layouts.main')
@push('header')
    <title>Update Profile</title>
@endpush
@section('content')
    <div class="card">
        {!! html()->form('PUT', route('admin.profile'))->attribute('enctype', 'multipart/form-data')->id('ajaxForm')->open() !!}
        <h5 class="card-header">UPDATE PROFILE</h5>
        <div class="card-body">
            <div class="row">
                <div class="col-md-6 mt-3">
                    <x-input name="name" :value="auth('admin')->user()->name" />
                </div>
                <div class="col-md-6 mt-3">
                    <x-input name="email" :value="auth('admin')->user()->email" />
                </div>
            </div>
            <div class="row">
                <div class="col-md-6 mt-3">
                    <x-input name="mobile" :value="auth('admin')->user()->mobile" />
                </div>
                <div class="col-md-6 mt-3">
                    <x-password name="password" />
                </div>
            </div>
            <div class="row">
                <div class="col-12 mt-3">
                    <x-file name="image" />
                </div>
            </div>
            <div class="d-flex justify-content-end pt-3">
                <button type="submit" id="submitBtn" class="btn btn-primary">Update</button>
            </div>
        </div>
        {{ html()->form()->close() }}
    </div>
@endsection
