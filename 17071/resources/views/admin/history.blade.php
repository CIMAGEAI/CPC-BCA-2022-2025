@extends('admin.layouts.main')
@push('header')
<title>History </title>
@endpush
@section('content')
<div class="card">
    <div class="d-flex justify-content-between align-items-center py-2">
        <h5 class="card-header">Filter Lead History</h5>

    </div>
    <div class="card-body">
        {!! html()->form('GET',url()->current())->open() !!}
        <div class="row">
            <div class="row">
                <div class="col-md-12">
                    <x-input name="mobile" :value="request()->get('mobile')" label="Mobile No" />
                </div>
            </div>
        </div>
        <br>
        <button id="uploadBtn" class="btn btn-sm btn-primary">Upload</button>
        {!! html()->form()->close() !!}
        <br><br>
        @isset($leads)


        <div class="row">

            <div class="table-responsive text-nowrap">
                <table class="table">
                    <thead>
                        <tr>
                            <th> Lead ID</th>
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
                                <div class="form-check form-switch mb-2">
                                    <input class="form-check-input" value="Active" onchange="leadLockedStatus(event)"
                                        data-url="{{ route('admin.lead.locked-status', $lead->id) }}" type="checkbox"
                                        id="flexSwitchCheckChecked" {{ $lead->locked == '1' ? 'checked' : null }}>
                                </div>
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
                                    <button type="button" class="btn p-0 dropdown-toggle hide-arrow"
                                        data-bs-toggle="dropdown">
                                        <i class="mdi mdi-dots-vertical"></i>
                                    </button>
                                    <div class="dropdown-menu">

                                        <b id="lead-report-data" class="dropdown-item" href="#"
                                            data-bs-id="{{ $lead->id }}" class="dropdown-item" href="#"><i
                                                class="mdi mdi-chart-bar me-1"></i>
                                            Lead Report Data</b>

                                        @if ($lead->status == 'Completed')
                                        <a target="_blank" class="dropdown-item" href="#" class="dropdown-item"
                                            href="#"><i class="mdi mdi-page-last me-1"></i>
                                            Lead Detail Page</a>
                                        @endif
                                        <a target="_blank" class="dropdown-item" href="#" class="dropdown-item"
                                            href="#"><i class="mdi mdi-file-pdf-box me-1"></i>
                                            Lead Detail</a>
                                        @if ($lead->status == 'Not Reachable' || $lead->status == 'Paid Client')

                                        @else
                                        <button id="leadAssignButton" data-bs-id="{{ $lead->id }}"
                                            data-bs-user="{{ $lead->user_id }}" class="dropdown-item">
                                            <i class="mdi mdi-pencil-outline me-1"></i>
                                            Lead Assign
                                        </button>
                                        {!! html()->form('DELETE', route('admin.lead.destroy',
                                        $lead->id))->attribute('onsubmit', 'return ConfirmDestroy(event)')->open() !!}
                                        <button class="dropdown-item" type="submit">
                                            <i class="mdi mdi-trash-can-outline me-1"></i> Delete
                                        </button>
                                        {{ html()->form()->close() }}
                                        @endif

                                    </div>
                                </div>
                            </td>
                        </tr>
                        @endforeach
                    </tbody>
                </table>
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



<div class="modal fade" id="leadAssign" tabindex="-1" aria-labelledby="leadAssignLabel" aria-hidden="true">
    <div class="modal-dialog">
        {!! html()->form('PUT', route('admin.lead.assign'))->id('leadAssignForm')->open() !!}
        <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5" id="leadAssignLabel"> Assign Lead to Manager</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <input type="hidden" name="lead_id">

                <div class="row">
                    <div class="col-lg-12 mt-2">

                        <x-select name="manager_id" required="true" class="select2"
                            :value="isset($lead) ? $lead->manager_id : old('manager_id')"
                            :list="\App\Utils\SelectionList::managerList()" Placeholder="Manager " label='Manager' />

                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="submit" class="btn btn-primary">Update</button>
            </div>
        </div>
        {{ html()->form()->close() }}
    </div>
</div>

        @endisset

    </div>
</div>



@endsection


@isset($leads)
@push('script')
<script src="{{ publicPath('assets/vendor/libs/select2/select2.js') }}"></script>
<script src="{{ publicPath('assets/js/forms-selects.js') }}"></script>
<script>
    $(document).on('click', '#lead-report-data', function() {
            $(".loader-container").addClass("show");
            var leadId = $(this).data('bs-id');
            $.ajax({
                type: 'GET',
                url: '{{ route('admin.leadReportData') }}',
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



        $(document).on('click', '#leadAssignButton', function(event) {
            var button = $(event.currentTarget);
            var leadId = button.data('bs-id');
            var manager = button.data('bs-manager');

            if (manager) {
                handleAssignPartner().then((confirmation) => {
                    if (confirmation) {
                        openLeadAssignModal(leadId, manager);
                    }
                });
            } else {
                openLeadAssignModal(leadId, manager);
            }
        });

        function handleAssignPartner() {
            return Swal.fire({
                title: "Are you sure you want to assign this lead to another Manager?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes!"
            }).then((result) => result.isConfirmed);
        }

        function openLeadAssignModal(leadId, manager) {
            var modal = $('#leadAssign');
            modal.find('.modal-body input[name="lead_id"]').val(leadId);
            modal.find('.modal-body input[name="manager_id"]').val(manager || '');
            modal.modal('show');
        }

        $('#leadAssignForm').on('submit', function(e) {
            e.preventDefault();
            $(".loader-container").addClass("show");

            var formData = $(this).serialize();
            $.ajax({
                type: 'PUT',
                url: '{{ route('admin.lead.assign') }}',
                data: formData,
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                success: function(response) {
                    $(".loader-container").removeClass("show");
                    $('#leadAssign').modal('hide');

                    if (response.status === true) {
                        Swal.fire({
                            title: "Lead assigned successfully!",
                            text: "You won't be able to revert this!",
                            icon: "success",
                            confirmButtonColor: "#3085d6",
                            confirmButtonText: "OK"
                        }).then(() => location.reload());
                    } else {
                        Swal.fire({
                            title: "Something went wrong",
                            text: response.msg,
                            icon: "warning",
                            confirmButtonColor: "#3085d6",
                            confirmButtonText: "OK"
                        });
                    }
                },
                error: function(xhr, status, error) {
                    $(".loader-container").removeClass("show");
                    Swal.fire({
                        title: "Error",
                        text: "There was an error assigning the lead. Please try again.",
                        icon: "error",
                        confirmButtonColor: "#3085d6",
                        confirmButtonText: "OK"
                    });
                }
            });
        });





        $('#leadcheck').change(function(e) {
            short_filter()
        });

        function short_filter() {
            let selectedOption = $('#leadcheck').val();
            if (selectedOption === "") {
                return;
            }
            let currentUrl = new URL(window.location.href);

            currentUrl.searchParams.set('leadshow', selectedOption);

            window.location.href = currentUrl.toString();
        }
</script>
<script>
    const leadLockedStatus = (event) => {
            const dataUrl = event.target.getAttribute('data-url');
            const status = event.target.checked ? '1' : '0';
            const data = {
                status: status
            };
            toastr.options.timeOut = 1000;
            fetch(dataUrl, {
                    method: 'PUT',
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


        document.addEventListener('DOMContentLoaded', () => {
            const selectAllCheckbox = document.getElementById('select-all');
            const individualCheckboxes = document.querySelectorAll('.lead-checkbox');
            const bulkAssignModalBtn = document.getElementById('open-bulk-assign-modal');
            const bulkLeadIdsField = document.getElementById('bulkLeadIds');
            function toggleBulkAssignButton() {
                const anyChecked = [...individualCheckboxes].some(cb => cb.checked);
                bulkAssignModalBtn.disabled = !anyChecked;
            }
            selectAllCheckbox.addEventListener('change', () => {
                const isChecked = selectAllCheckbox.checked;
                individualCheckboxes.forEach(checkbox => {
                    checkbox.checked = isChecked;
                });
                toggleBulkAssignButton();
            });

            individualCheckboxes.forEach(checkbox => {
                checkbox.addEventListener('change', () => {
                    if (!checkbox.checked) {
                        selectAllCheckbox.checked = false;
                    }
                    if ([...individualCheckboxes].every(cb => cb.checked)) {
                        selectAllCheckbox.checked = true;
                    }
                    toggleBulkAssignButton();
                });
            });

            bulkAssignModalBtn.addEventListener('click', () => {
                const selectedIds = [...individualCheckboxes]
                    .filter(cb => cb.checked)
                    .map(cb => cb.value);
                bulkLeadIdsField.value = selectedIds.join(',');
                const modal = new bootstrap.Modal(document.getElementById('bulkLeadAssign'));
                modal.show();
            });
        });


</script>
@endpush
@endisset
