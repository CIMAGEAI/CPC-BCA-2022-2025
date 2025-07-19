@extends('admin.layouts.main')
@push('header')
<title>Leader List</title>
@endpush

@section('content')

<div class="card">
    <h5 class="card-header">Leader LIST</h5>
    <div class="card-body">
        <a class="btn btn-sm btn-primary waves-effect waves-light" href="{{ route('admin.manager.create') }}">Add
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
                @foreach ($managers as $manager)
                <tr>
                    <td>{{ $manager->id }}</td>
                    <td>
                        <div class="image">
                            <img src="{{ route('assets-resize', ['folder' => 'managers', 'file' => $manager->profile_pic, 'h' => 50, 'w' => 50]) }}"
                                alt="{{ $manager->name }}">
                        </div>
                    </td>
                    <td>{{ $manager->name }}</td>
                    <td>{{ $manager->mobile }}</td>
                    <td>{{ $manager->email }}</td>
                    <td>
                        <div class="form-check form-switch mb-2">
                            <input class="form-check-input" value="Active" onchange="updateCityStatus(event)"
                                data-url="{{ route('admin.manager.update', $manager->id) }}"
                                data-id="{{ $manager->id }}" type="checkbox" id="flexSwitchCheckChecked" {{
                                $manager->status == 'Active' ? 'checked' : null }}>
                        </div>
                    </td>
                    <td>
                        <div class="dropdown">
                            <button type="button" class="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                                <i class="mdi mdi-dots-vertical"></i>
                            </button>
                            <div class="dropdown-menu">

                                <a class="dropdown-item" href="{{ route('admin.manager.edit', $manager->id) }}"><i
                                        class="mdi mdi-pencil-outline me-1"></i> Edit</a>

                                <a class="dropdown-item" href="{{ route('admin.managerLogin', $manager->id) }}"><i
                                        class="mdi mdi-login-variant me-1"></i> Login</a>
                                <a class="dropdown-item" href="{{ route('admin.managerAttendance', $manager->id) }}"><i
                                        class="mdi mdi-format-align-center me-1"></i> Attendance</a>

                                {!! html()->form('DELETE', route('admin.manager.destroy',
                                $manager->id))->attribute('onsubmit', 'return ConfirmDestroy(event)')->open() !!}
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
    <div class="d-flex justify-content-end px-4 py-4">
        {!! $managers->links() !!}
    </div>
</div>
@endsection
