@extends('admin.layouts.main')
@push('header')
<title>Attendance</title>
<link rel="stylesheet" href="{{ publicPath('assets/vendor/libs/select2/select2.css') }}" />

<style>
    table tr th {
        text-transform: capitalize;
        border: 1px solid;

    }

    table tr td {
        border: 1px solid;
    }

    .image {
        width: 100% !important;
        height: 100% !important;
    }
</style>
@endpush
@section('content')
<div class="card">
    <h5 class="card-header">Attendance Details {{ isset($attendance->user) ? 'Agents' : 'manager' }} </h5>
    <div class="card-body">
        <div class="row">
            <div class="table-responsive text-nowrap">
                <table class="table text-nowrap">
                    <thead>
                        <tr style="border: 1px solid">
                            <th>Name</th>
                            <th>Login Time</th>
                            <th>Logout Time</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach ($attendances as $attendance)

                        <tr>
                            <td>
                                <p>{{ isset($attendance->user) ? $attendance->user->name : $attendance->manager->name}}
                                </p>
                            </td>
                            <td>
                                <p>{{ isset($attendance->login_time)?$attendance->login_time->format('d-m-Y H:i:s
                                    A'):null }}</p>
                            </td>
                            <td>
                                <p>{{ isset($attendance->logout_time)? $attendance->logout_time->format('d-m-Y H:i:s
                                    A'):null }}</p>
                            </td>
                            <td>
                                <p>{{ $attendance->status }}</p>
                            </td>
                        </tr>

                        @endforeach
                    </tbody>
                </table>
            </div>

            <br>
        </div>
    </div>
    @endsection
