@extends('admin.layouts.main')
@push('header')
<title>Dashboard</title>
@endpush
@section('content')
@php
$tod = 'Town School';
@endphp
<div class="row g-4 mb-4">

    <x-card bgColor="#f0d6fff6" date="{{ $tod }}" name="Total Fee Collection" img="rupee.png"
        value="{{ $today->total_fee + $today->total_other  }}" width="105" />
    <x-card bgColor="rgba(213, 255, 227, 0.966)" date="{{ $tod}}" name="Monthl Fee Collection" img="rupee.png"
         width="125" value="{{ $month->total_fee + $month->total_other }}" />
    <x-card bgColor="rgb(209, 210, 255)" date="{{ $tod}}" name="Yearly Fee Collection"
        img="rupee.png" value="{{ $year->total_fee + $year->total_other }}" width="135" />


      

</div>
{{--  <div class="row g-4 mb-4">
    @foreach ($statusCount as $key => $item)
    <div class="col-sm-6 col-xl-3">
        <a href="{{ route('admin.statusWise',$key) }}">
        <div class="card">
            <div class="card-body">
                <div class="d-flex align-items-center">
                    <div class="avatar">
                        <div class="avatar-initial bg-label-primary rounded">
                            <div class="mdi mdi-folder-information mdi-24px"></div>
                        </div>
                    </div>
                    <div class="ms-3">
                        <div class="d-flex align-items-center">
                            <h5 class="mb-0">{{ number_format($item, 0) }}</h5>

                        </div>
                        <small class="text-muted">{{ $key }}</small>
                    </div>
                </div>
            </div>
        </div>
    </a>
    </div>
    @endforeach
</div>  --}}




{{-- <div class="col-sm-6 col-xl-3">
    <div class="card">
        <div class="card-body">
            <div class="d-flex align-items-center">
                <div class="avatar">
                    <div class="avatar-initial bg-label-success rounded">
                        <div class="mdi mdi-currency-inr mdi-24px"></div>
                    </div>
                </div>
                <div class="ms-3">
                    <div class="d-flex align-items-center">
                        <h5 class="mb-0">{{ number_format($walletRecharge, 2) }}</h5>

                    </div>
                    <small class="text-muted">Wallet Recharge</small>
                </div>
            </div>
        </div>
    </div>
</div>
</div>




<div class="row gy-4 mb-4">
    <div class="col-lg-6">
        <div class="card h-100">
            <div class="card-header">
                <div class="d-flex justify-content-between">
                    <h4 class="mb-2">Lead Status</h4>
                </div>
            </div>
            <div class="card-body d-flex justify-content-between flex-wrap gap-3">

                <div class="d-flex gap-3">
                    <div class="avatar">
                        <div class="avatar-initial bg-label-success rounded">
                            <i class="mdi mdi-check-circle mdi-24px"></i>
                        </div>
                    </div>
                    <div class="card-info">
                        <h4 class="mb-0">{{ number_format($completedLeads, 0) }}</h4>
                        <small class="text-muted">Completed</small>
                    </div>
                </div>
                <div class="d-flex gap-3">
                    <div class="avatar">
                        <div class="avatar-initial bg-label-info rounded">
                            <i class="mdi mdi-file-tree mdi-24px"></i>
                        </div>
                    </div>
                    <div class="card-info">
                        <h4 class="mb-0">{{ number_format($inProgressLeads, 0) }}</h4>
                        <small class="text-muted">In Progress</small>
                    </div>
                </div>
                <div class="d-flex gap-3">
                    <div class="avatar">
                        <div class="avatar-initial bg-label-danger rounded">
                            <i class="mdi mdi-close-circle-multiple-outline mdi-24px"></i>
                        </div>
                    </div>
                    <div class="card-info">
                        <h4 class="mb-0">{{ number_format($failedLeads, 0) }}</h4>
                        <small class="text-muted">Failed</small>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="col-lg-6">
        <div class="card h-100">
            <div class="card-header">
                <div class="d-flex justify-content-between">
                    <h4 class="mb-2">Overview Statics</h4>
                </div>
            </div>
            <div class="card-body d-flex justify-content-between flex-wrap gap-3">

                <div class="d-flex gap-3">
                    <div class="avatar">
                        <div class="avatar-initial bg-label-success rounded">
                            <i class="mdi mdi-family-tree mdi-24px"></i>
                        </div>
                    </div>
                    <div class="card-info">
                        <h4 class="mb-0">{{ number_format($categories, 0) }}</h4>
                        <small class="text-muted">Category</small>
                    </div>
                </div>
                <div class="d-flex gap-3">
                    <div class="avatar">
                        <div class="avatar-initial bg-label-info rounded">
                            <i class="mdi mdi-watermark mdi-24px"></i>
                        </div>
                    </div>
                    <div class="card-info">
                        <h4 class="mb-0">{{ number_format($brands, 0) }}</h4>
                        <small class="text-muted">Brand</small>
                    </div>
                </div>
                <div class="d-flex gap-3">
                    <div class="avatar">
                        <div class="avatar-initial bg-label-warning rounded">
                            <i class="mdi mdi-cellphone-link mdi-24px"></i>
                        </div>
                    </div>
                    <div class="card-info">
                        <h4 class="mb-0">{{ number_format($products, 0) }}</h4>
                        <small class="text-muted">Product</small>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<div class="row gy-4 mb-4">
    <div class="col-md-12 mt-4 mb-mt-0">
        <div class="card h-100">
            <div class="card-header d-flex align-items-center justify-content-between">
                <h5 class="card-title m-0 me-2">Recent Reacharge Transaction</h5>
            </div>
            <div class="table-responsive text-nowrap">
                <table class="table table-borderless">
                    <thead>
                        <tr>
                            <th class="text-capitalize text-body fw-medium fs-6">Type</th>
                            <th class="text-end text-capitalize text-body fw-medium fs-6">Amount</th>
                            <th class="text-end text-capitalize text-body fw-medium fs-6">Status</th>
                            <th class="text-end text-capitalize text-body fw-medium fs-6">Date</th>
                        </tr>
                    </thead>
                    <tbody class="border-top">
                        @foreach ($transRecharges as $transRecharge)
                        <tr>
                            <td class="d-flex">
                                <div class="ms-2">
                                    <h6 class="mb-0 fw-semibold">{{ $transRecharge->type }}</h6>
                                </div>
                            </td>
                            <td class="text-end">
                                <div class="ms-2">
                                    <h6 class="mb-0 fw-semibold">₹{{ number_format($transRecharge->amount, 2, '.', ',')
                                        }}</h6>
                                </div>
                            </td>
                            <td class="text-end">
                                <div class="ms-2">
                                    <h6 class="mb-0 fw-semibold">{{ $transRecharge->status }}</h6>
                                </div>
                            </td>
                            <td class="text-end">
                                <div class="ms-2">
                                    <h6 class="mb-0 fw-semibold">{{ $transRecharge->created_at->format('d-m-y H:i:s a')
                                        }}</h6>
                                </div>
                            </td>
                        </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>
<div class="row gy-4 mb-4">
    <div class="col-md-12 mt-4 mb-mt-0">
        <div class="card h-100">
            <div class="card-header d-flex align-items-center justify-content-between">
                <h5 class="card-title m-0 me-2">Recent Reacharge Transaction</h5>
            </div>
            <div class="table-responsive text-nowrap">
                <table class="table table-borderless">
                    <thead>
                        <tr>
                            <th class="text-capitalize text-body fw-medium fs-6">Type</th>
                            <th class="text-end text-capitalize text-body fw-medium fs-6">Amount</th>
                            <th class="text-end text-capitalize text-body fw-medium fs-6">Status</th>
                            <th class="text-end text-capitalize text-body fw-medium fs-6">Date</th>
                        </tr>
                    </thead>
                    <tbody class="border-top">
                        @foreach ($transLeads as $transRecharge)
                        <tr>
                            <td class="d-flex">
                                <div class="ms-2">
                                    <h6 class="mb-0 fw-semibold">{{ $transRecharge->type }}</h6>
                                </div>
                            </td>
                            <td class="text-end">
                                <div class="ms-2">
                                    <h6 class="mb-0 fw-semibold">₹{{ number_format($transRecharge->amount, 2, '.', ',')
                                        }}</h6>
                                </div>
                            </td>
                            <td class="text-end">
                                <div class="ms-2">
                                    <h6 class="mb-0 fw-semibold">{{ $transRecharge->status }}</h6>
                                </div>
                            </td>
                            <td class="text-end">
                                <div class="ms-2">
                                    <h6 class="mb-0 fw-semibold">{{ $transRecharge->created_at->format('d-m-y H:i:s a')
                                        }}</h6>
                                </div>
                            </td>
                        </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div> --}}
@endsection
