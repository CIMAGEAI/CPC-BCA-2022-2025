@extends('admin.layouts.main')
@push('header')
<title>Leads</title>
<link rel="stylesheet" href="{{ publicPath('assets/vendor/libs/select2/select2.css') }}" />
<style>
    table tr th,tr td {
        text-transform: capitalize;
        border: 1px solid;
    }
</style>
@endpush
@section('content')
<div class="card">
    <div class="d-flex justify-content-between align-items-center">
        <h5 class="card-header">PAID CLIENT LEAD</h5>
        <div class="mx-2">
        </div>
    </div>
    {!! html()->form('GET', url()->current())->open() !!}
    <div class="row align-items-center mt-3 mx-2">
        <div class="col-md-3">
            <x-input name="mobile" :value="request()->get('mobile')" label="Mobile No" />
        </div>

        <div class="col-md-3">
            <x-input name="name" :value="request()->get('name')" label="Name" />
        </div>
    </div>

    <div class="row my-3 mx-2 align-items-center">
        <div class="col-md-4 mt-3">
            <div class="d-flex">
                <input type="submit" class="btn btn-primary btn-sm me-3" value="Search">
                <a href="{{ url()->current() }}" class="btn btn-secondary btn-sm text-white">Reset</a>
            </div>
        </div>
    </div>
    {{ html()->form()->close() }}

    <div class="table-responsive text-nowrap">
        <table class="table">
            <thead>
                <tr>
                    <th>Lead ID</th>
                    <th>Mobile</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Fund</th>
                    <th>Source Of Lead</th>
                    <th>Manager</th>
                    <th>Staff</th>
                    <th>Lead Locked</th>
                    <th>Status</th>
                    <th class="text-center" width="10%">Action</th>
                </tr>
            </thead>
            <tbody>
                @php

                @endphp
                @foreach ($leads as $lead)
                <tr>
                    <td>
                        {{ $lead->id }}
                    </td>
                    <td>{{ $lead->mobile }}</td>
                    <td>{{ $lead->name }}</td>
                    <td>{{ $lead->email }}</td>
                    <td>{{ $lead->fund }}</td>
                    <td>{{ $lead->source_of_lead }}</td>
                    <td>{{ isset($lead->manager)?$lead->manager->name:null }}</td>
                    <td>{{ isset($lead->user)?$lead->user->name:null }}</td>
                    <td>
                        {{ $lead->locked == '1' ? 'LOCKED' : "NON" }}
                    </td>

                    <td>
                        @if ($lead->status == 'Failed')
                        <span class="badge bg-danger ">
                            {{ $lead->status }}
                        </span>
                        @elseif ($lead->status == 'Completed')
                        <span class="bg-success badge">
                            {{ $lead->status }}
                        </span>
                        @elseif ($lead->status == 'In Progress')
                        <span class="bg-warning badge">
                            {{ $lead->status }}
                        </span>
                        @else
                        <span class="badge bg-info">
                            {{ $lead->status }}
                        </span>
                        @endif
                    </td>

                    <td class="text-center" width="10%">
                        <div class="dropdown">
                            <button type="button" class="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                                <i class="mdi mdi-dots-vertical"></i>
                            </button>
                            <div class="dropdown-menu">

                                <b id="lead-report-data" class="dropdown-item" href="#" data-bs-id="{{ $lead->id }}"
                                    class="dropdown-item" href="#"><i class="mdi mdi-chart-bar me-1"></i>
                                    Lead Report Data</b>

                                {!! html()->form('DELETE', route('admin.lead.destroy',
                                $lead->id))->attribute('onsubmit', 'return ConfirmDestroy(event)')->open() !!}
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
    </div>
</div>





<div class="modal fade" id="leadReport" tabindex="-1" aria-labelledby="leadReportLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg modal-dialog-scrollable">
        <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5" id="leadReportLabel">Lead Report</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body" id="leadReportData">

            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            </div>
        </div>
    </div>
</div>








@endsection


@push('script')
<script src="{{ publicPath('assets/vendor/libs/select2/select2.js') }}"></script>
<script src="{{ publicPath('assets/js/forms-selects.js') }}"></script>

<script>
    $(document).on('click', '#lead-report-data', function() {
            $(".loader-container").addClass("show");
            var leadId = $(this).data('bs-id');
            $.ajax({
                type: 'GET',
                url: '{{ route('ajax.leadReportData') }}',
                data: {
                    id: leadId
                },
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                success: function(res) {
                    console.log(res);
                    $('#leadReport').modal('show');
                    if (res && res.html) {
                        $(".loader-container").removeClass("show");
                        $('#leadReportData').html(res.html);
                    } else {
                        $(".loader-container").removeClass("show");
                        alert('Unexpected response format. Please try again.');
                        console.error('Response:', res);
                    }
                },
                error: function(xhr, status, error) {
                    $(".loader-container").removeClass("show");
                    let errors = xhr.responseJSON;
                    if (!errors.status) {
                        toastr.options.timeOut = 1000;
                        toastr.error(`${errors.msg}`);
                    }
                }
            });
        });
</script>
@endpush
