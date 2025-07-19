@extends('admin.layouts.main')
@push('header')
<title>Student Details </title>
<link rel="stylesheet" href="{{ publicPath('assets/vendor/libs/select2/select2.css') }}" />
@endpush
@section('content')
<div class="card">

    {{-- classes wise filter student  --}}
    <div class="d-flex justify-content-between align-items-center py-2">
        <h5 class="card-header">Filter Student Classes wise</h5>
        @isset($fee)
        @else
        <button class="btn btn-sm btn-primary mx-3" type="button" data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasRight" aria-controls="offcanvasRight">Bulk import</button>
        @endisset
    </div>

    <div class="card-body">
        <div class="row">
            <div class="col-md-12 mt-3">
                <x-select name="class_name" class="select2"
                    :value=" old('class_name')"
                    :list="\App\Utils\SelectionList::classList()" label='Class' placeholderSelect2="Class" />
            </div>
        </div>
        <div class="py-2">
            <div class="" id="classes"></div>
        </div>
    </div>
</div>




{{-- classes wise data upload with in excel sheet --}}
<div class="offcanvas offcanvas-end" data-bs-backdrop="static" tabindex="-1" id="offcanvasRight"
    aria-labelledby="offcanvasRightLabel">
    <div class="offcanvas-header bg-primary">
        <h5 class="offcanvas-title text-white" id="offcanvasRightLabel">Upload .CSV file</h5>
        <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
    </div>
    {!! html()->form('POST',route('admin.updateBulkStudent'))->id('uploadCsv')->attribute('enctype', 'multipart/form-data')->open() !!}

    <div class="offcanvas-body" style="height: 350px;">
        <div class="row">
            <div class="col-md-12">
                <x-select name="class" class="select2"
                    :value=" old('class')"
                    :list="\App\Utils\SelectionList::classList()" label='Class' placeholderSelect2="Class" />
            </div>
            <div class="col-md-12">
                <x-file name="file" />
            </div>
        </div>
    </div>

    <div class="offcanvas-footer text-end p-3">
        <button id="uploadBtn" class="btn btn-primary d-block" style="width: 100%" >Upload</button>
        <span id="uploadStatus" class="text-muted ms-2" style="display: none;">Please wait...</span>
    </div>
    {!! html()->form()->close() !!}

</div>
@endsection

@push('script')
<script src="{{ publicPath('assets/vendor/libs/select2/select2.js') }}"></script>
<script src="{{ publicPath('assets/js/forms-selects.js') }}"></script>

<script>

    const studentStatus = (event) => {
        const dataUrl = event.target.getAttribute('data-url');
        const status = event.target.checked ? 'Active' : 'Blocked';
        const data = {
            status: status
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
                toastr.success(`Lead Locked status Updated successfully `);
            })
            .catch(error => {
                toastr.error(error);
            });
    };
    </script>


<script>
    let className = null;

        $('select[name="class_name"]').on('change', function(e) {
            className = $(this).val();

            if (!className) return;

            $.ajax({
                url: '{{ route('admin.studentClassWise') }}',
                type: 'GET',
                data: {
                    class: className
                },
                success: function(response) {
                    $('#classes').html(response.html);
                },
                error: function(xhr, status, error) {
                    console.error('Error fetching leads:', error);
                }
            });
        });

        function exportToCSV() {
            if (!className) {
                alert('Please select a Class first.');
                return;
            }

            window.location.href =
                `{{ route('admin.exportStudentClassWise') }}?class=${className}&export=csv`;
        }
</script>
@endpush
