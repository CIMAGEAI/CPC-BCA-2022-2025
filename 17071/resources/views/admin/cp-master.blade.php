@extends('admin.layouts.main')
@push('header')
<title>{{ isset($cpMaster) ? 'Update' : 'Add' }} CP Master</title>

@endpush
@section('content')
<div class="main-content mt-1">
    <div class="">
        <div class="container-fluid ">
            @if (isset($cpMasters))
                <div class="row">
                    <div >
                        <div class="card">
                            <div class="card-header d-flex justify-content-between items-center">
                                <h3 class="card-title mb-0">CP Master </h3>
                                <div class="d-flex gap-3">
                                    <a href="{{ route('admin.cp-master.create') }}"
                                        class="btn btn-sm btn-primary ">Add CP Master</a>
                                </div>
                            </div>
                            <div class="card mt-4 shadow-sm">
                                <div class="card-body table-responsive p-0">
                                    <table class="table table-hover table-bordered">
                                        <thead class="table-secondary">
                                            <tr>
                                                <th>ID</th>
                                                <th>Name</th>
                                                <th>Mobile</th>
                                                <th>Email</th>
                                                <th>Actions</th>
                                                <th>Date Created</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            @foreach ($cpMasters as $cpMaster)
                                            <tr>
                                                <td>{{ $cpMaster->id }}</td>
                                                <td>{{ $cpMaster->name }}</td>
                                                <td>{{ $cpMaster->mobile }}</td>
                                                <td>{{ $cpMaster->email }}</td>
                                                <td class="text-center">
                                                    <div class="dropdown">
                                                        <button type="button" class="btn btn-sm btn-light dropdown-toggle" data-bs-toggle="dropdown">
                                                            <i class="mdi mdi-dots-vertical"></i>
                                                        </button>
                                                        <div class="dropdown-menu">
                                                            <a class="dropdown-item" href="{{ route('admin.cp-master.edit', $cpMaster->id) }}">
                                                                <i class="mdi mdi-pencil-outline me-1"></i> Edit
                                                            </a>
                                                            {!! html()->form('DELETE', route('admin.cp-master.destroy', $cpMaster->id))
                                                                ->attribute('onsubmit', 'return ConfirmDestroy(event)')->open() !!}
                                                            <button class="dropdown-item" type="submit">
                                                                <i class="mdi mdi-trash-can-outline me-1"></i> Delete
                                                            </button>
                                                            {!! html()->closeModelForm() !!}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>{{ $cpMaster->created_at->format('d-m-Y') }}</td>
                                            </tr>
                                            @endforeach
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        </div>
                    </div>
                </div>
                @else
                @if (isset($cpMaster))
                {!! html()->form('PUT', route('admin.cp-master.update', $cpMaster->id))->attribute('enctype',
                'multipart/form-data')->open() !!}
                @else
                {!! html()->form('POST', route('admin.cp-master.store'))->attribute('enctype',
                'multipart/form-data')->open() !!}
                @endif
                <h5 class="card-header">{{ isset($cpMaster) ? 'UPDATE' : 'ADD' }} Cp Master</h5>
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-4 my-2">
                            <x-input name="name" value="{{ isset($cpMaster) ? $cpMaster->name : old('name') }}" />
                        </div>
                        <div class="col-md-4 my-2">
                            <x-input name="email" value="{{ isset($cpMaster) ? $cpMaster->email : old('email') }}" />
                        </div>
                        <div class="col-md-4 my-2">
                            <x-input name="mobile" value="{{ isset($cpMaster) ? $cpMaster->mobile : old('mobile') }}" />
                        </div>
                        <div class="col-md-4 my-2">
                            <x-input name="remark" value="{{ isset($cpMaster) ? $cpMaster->remark : old('remark') }}" />
                        </div>

                    </div>
                    <div class="d-flex justify-content-end pt-3">
                        <button type="submit" class="btn btn-primary">{{ isset($cpMaster) ? 'Update' : 'Add' }}</button>
                    </div>
                </div>
                {!! html()->closeModelForm() !!}
                @endif


            </div>
        </div>
    </div>
</div>
@endsection
