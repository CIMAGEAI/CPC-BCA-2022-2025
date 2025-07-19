@extends('admin.layouts.main')
@push('header')
    <title>Section List </title>
    <link rel="stylesheet" href="{{ publicPath('assets/vendor/libs/select2/select2.css') }}" />
    <style>
        table tr th {
            text-transform: capitalize;
            border: 1px solid;
            text-wrap: nowrap;
            font-size: 12px;

        }

        table tr td {
            font-size: 12px;
            border: 1px solid;
        }
    </style>
@endpush
@section('content')
    @isset($classes)
        <div class="card">
            <div class="card-body d-flex justify-content-between align-items-center">
                <h5 class="card-header">Sections LIST</h5>
                <a class="btn btn-sm btn-primary waves-effect waves-light" href="{{ route('admin.classes.create') }}">Add
                    New</a>
            </div>
            {!! html()->form('GET', url()->current())->open() !!}
            <div class="row align-items-center mt-1 mx-2 mb-3">
                <div class="col-md-3">
                    <x-input name="class" :value="request()->get('class')" label="Class" />
                </div>
                <div class="col-md-3">
                    <x-input name="title" :value="request()->get('title')" label="title" />
                </div>
                <div class="col-md-3">
                    <x-select name="type" placeholderSelect2="type" :placeholder="true" :list="\App\Utils\SelectionList::sectionList()" :value="request()->get('type')"
                        label=" type" />
                </div>

                <div class="col-md-3 mt-3">
                    <button type="reset" class="btn btn-sm btn-secondary">reset</button>
                    <button type="submit" class="btn btn-sm btn-primary">search</button>
                </div>
                {!! html()->form()->close() !!}
            </div>
            <div class="table-responsive text-nowrap">
                <table class="table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Title</th>
                            <th>Class</th>
                            <th>Image</th>
                            <th>Type</th>
                            <th>Age</th>
                            <th class="text-center" width="10%">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach ($classes as $class)
                            <tr>
                                <td>{{ $class->id }}</td>
                                <td>{{ $class->title }}</td>
                                <td>{{ $class->class }}</td>
                                <td> @if ($class->image)
                                    <img src="{{route('uploads',['file'=>$class->image,'folder'=>'sections'])}}" width="50" alt=""></td>
                                @else
                                @endif
                                <td>{{ $class->type }}</td>
                                <td>{{ $class->age }}</td>

                                <td>
                                    <div class="dropdown">
                                        <button type="button" class="btn p-0 dropdown-toggle hide-arrow"
                                            data-bs-toggle="dropdown">
                                            <i class="mdi mdi-dots-vertical"></i>
                                        </button>
                                        <div class="dropdown-menu">
                                            <button class="dropdown-item editBtn" data-bs-toggle="modal"
                                                data-bs-target="#editDataModal" data-bs-type="{{ $class->type }}"
                                                data-bs-title="{{ $class->title }}" data-bs-class="{{ $class->class }}"
                                                data-bs-description="{{ $class->description }}"
                                                data-bs-age="{{ $class->age }}"
                                                data-bs-url="{{ route('admin.classes.update', $class->id) }}"><i
                                                    class="mdi mdi-pencil-outline me-1"></i> Edit</button>

                                            {!! html()->form('DELETE', route('admin.classes.destroy', $class->id))->attribute('onsubmit', 'return ConfirmDestroy(event)')->open() !!}
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
                {!! $classes->links() !!}
            </div>
        </div>
    @else
        <div class="card">
            @if (isset($class))
                {!! html()->form('PUT', route('admin.classes.update', $class->id))->attribute('enctype', 'multipart/form-data')->open() !!}
            @else
                {!! html()->form('POST', route('admin.classes.store'))->attribute('enctype', 'multipart/form-data')->open() !!}
            @endif
            <h5 class="card-header">{{ isset($class) ? 'UPDATE' : 'ADD' }} Section</h5>
            <div class="card-body">

                <div class="row">
                    <!-- Name -->
                    <div class="col-md-6 my-2">
                        <x-input label="title" name="title" value="{{ old('title', $class->title ?? '') }}" required />
                    </div>
                    <div class="col-md-6 my-2">
                        <x-input label="Class" name="class" value="{{ old('class', $class->class ?? '') }}" required />
                    </div>

                    <!-- Email -->
                    <div class="col-md-6 my-2">
                        <x-input label="Bio" name="age" type="text" value="{{ old('age', $class->age ?? '') }}" />
                    </div>

                    <!-- Class -->
                    <div class="col-md-6 my-2">
                        <x-select name="type" class="select2" :value="old('type')" :list="\App\Utils\SelectionList::sectionList()" label='Type'
                            value="{{ old('type', $class->type ?? '') }}" placeholderSelect2="Class" />
                    </div>

                    <!-- Image -->
                    <div class="col-md-6 my-2">
                        <x-input label="photo" name="photo" type="file" />
                    </div>
                    <!-- Address -->
                    <div class="col-md-12 my-2">
                        <x-text-area label="description"
                            name="description">{{ old('description', $class->description ?? '') }}</x-text-area>
                    </div>
                </div>


                <div class="d-flex justify-content-end pt-3">
                    <button type="submit" class="btn btn-primary">{{ isset($class) ? 'Update' : 'Add' }}</button>
                </div>
            </div>
            {!! html()->closeModelForm() !!}
        </div>
    @endisset
@endsection


<div class="modal fade" id="editDataModal" tabindex="-1" role="dialog" aria-labelledby="editModal" aria-hidden="true">
    <div class="modal-dialog modal-xl" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="editModal">Section Edit</h5>
                <button data-bs-dismiss="modal" type="button"
                    class="btn-sm btn btn-icon btn-label-github waves-effect close" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            {!! html()->form('PUT', route('admin.classes.create'))->id('ajaxEditForm')->acceptsFiles()->open() !!}
            <div class="modal-body">
                <div class="row">
                    <!-- Name -->
                    <div class="col-md-6 my-2">
                        <x-input label="class" name="class" id="edit" required />
                    </div>

                    <!-- Email -->
                    <div class="col-md-6 my-2">
                        <x-input label="Title" name="title" id="edit" type="text" />
                    </div>

                    <div class="col-md-6 my-2">
                        <x-input label="Bio" name="age" type="text" id="edit"
                            value="{{ old('age', $class->age ?? '') }}" />
                    </div>

                      <div class="col-md-6 my-2">
                        <x-select id="edit" name="type" class="select2" :value="old('type')" :list="\App\Utils\SelectionList::sectionList()" label='Type'
                            value="{{ old('type', $class->type ?? '') }}" placeholderSelect2="Class" />
                    </div>


                    <!-- Image -->
                    <div class="col-md-6 my-2">
                        <x-input label="photo" name="photo" type="file" />
                    </div>
                    <!-- Address -->
                    <div class="col-md-12 my-2">
                        <x-text-area label="Description" id="edit"
                            name="description">{{ old('description') }}</x-text-area>
                    </div>
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

@push('script')
    <script src="{{ publicPath('assets/vendor/libs/select2/select2.js') }}"></script>
    <script src="{{ publicPath('assets/js/forms-selects.js') }}"></script>
@endpush
