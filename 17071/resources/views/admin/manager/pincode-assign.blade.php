@extends('admin.layouts.main')

@push('header')
    <title>Manage Pincode</title>
    <link rel="stylesheet" href="{{ publicPath('assets/vendor/libs/select2/select2.css') }}" />
@endpush

@section('content')
    {!! html()->form('POST', route('admin.partnerPincode', ['id' => $partner->id]))->acceptsFiles()->open() !!}
    @php
        $class = 'form-control form-control-sm select2 ';
    @endphp
    <div class="card">
        <h5 class="card-header">{{ isset($partner) ? 'Update' : 'Add' }} Pincode</h5>
        <div class="card-body">
            <div class="table-responsiveSelect p-0 mt-3">
                <table class="table table-bordered mb-0">
                    <thead>
                        <tr>
                            <th>Pincode</th>
                        </tr>
                    </thead>
                    <tbody id="productKeyValue">
                        @php
                            $index = 0;
                        @endphp
                        @if (isset($partner->pincode) || old('pincode') !== null)
                            @php
                                $pincodes = isset($partner) ? $partner->pincode : old('pincode');
                            @endphp
                            @foreach ($pincodes as $pincode)
                                <tr>
                                    <td class="select2-primary">
                                        <x-multi-select name="pincode[]" :placeholder="false"
                                            :list="\App\Utils\SelectionList::pincodeList()" :label="false" placeholderSelect2="Value" class="select2"
                                            :value="[$pincode]" />
                                         @error("pincode.$index")
                                            <div class="errorText">{{ $message }}</div>
                                        @enderror
                                    </td>
                                </tr>
                                @php
                                    $index++;
                                @endphp
                            @endforeach
                        @else
                            <tr>
                                <td class="select2-primary">
                                    <x-multi-select name="pincode[]" class="select2" :list="\App\Utils\SelectionList::pincodeList()" :placeholder="false"
                                        :label="false" placeholderSelect2="Value" />
                                    @error("pincode.0")
                                        <div class="errorText">{{ $message }}</div>
                                    @enderror
                                </td>
                            </tr>
                        @endif
                    </tbody>
                </table>
            </div>
            <div class="d-flex justify-content-end mt-3">
                <button type="submit" class="btn btn-primary">{{ isset($partner) ? 'Update' : 'Create' }}</button>
            </div>
        </div>
    </div>
    {{ html()->form()->close() }}
@endsection

@push('script')
    <script src="{{ publicPath('assets/vendor/libs/select2/select2.js') }}"></script>
    <script src="{{ publicPath('assets/js/forms-selects.js') }}"></script>
@endpush
