<script src="{{ publicPath('assets/') }}vendor/libs/jquery/jquery.js"></script>
<script src="{{ publicPath('assets/') }}vendor/libs/popper/popper.js"></script>
<script src="{{ publicPath('assets/') }}vendor/js/bootstrap.js"></script>
<script src="{{ publicPath('assets/') }}vendor/libs/perfect-scrollbar/perfect-scrollbar.js"></script>
<script src="{{ publicPath('assets/') }}vendor/libs/node-waves/node-waves.js"></script>

<script src="{{ publicPath('assets/') }}vendor/libs/hammer/hammer.js"></script>
<script src="{{ publicPath('assets/') }}vendor/libs/i18n/i18n.js"></script>
<script src="{{ publicPath('assets/') }}vendor/libs/typeahead-js/typeahead.js"></script>

<script src="{{ publicPath('assets/') }}vendor/js/menu.js"></script>
<script src="{{ publicPath('assets/') }}vendor/libs/datatables-bs5/datatables-bootstrap5.js"></script>
<script src="{{ publicPath('assets/') }}vendor/libs/apex-charts/apexcharts.js"></script>
<script src="{{ publicPath('assets/') }}vendor/libs/swiper/swiper.js"></script>
<script src="{{ publicPath('assets/') }}js/main.js"></script>
<script src="{{ publicPath('assets/') }}js/dashboards-ecommerce.js"></script>
<script src="{{ publicPath('assets/') }}vendor/libs/toastr/toastr.js"></script>
<script src="{{ publicPath('assets/') }}vendor/libs/moment/moment.js"></script>
<script src="{{ publicPath('assets/') }}vendor/libs/flatpickr/flatpickr.js"></script>
<script src="{{ publicPath('assets/') }}vendor/libs/bootstrap-datepicker/bootstrap-datepicker.js"></script>
<script src="{{ publicPath('assets/') }}vendor/libs/bootstrap-daterangepicker/bootstrap-daterangepicker.js"></script>
<script src="{{ publicPath('assets/') }}vendor/libs/jquery-timepicker/jquery-timepicker.js"></script>
<script src="{{ publicPath('assets/') }}vendor/libs/pickr/pickr.js"></script>
<script src="{{ publicPath('assets/main.js') }}"></script>
<!-- Form Footer js End-->
@if (session()->has(['class']))
    @if (session()->get('class') == 'success')
        <script>
            toastr.options.timeOut = 1000;
            toastr.success('{{ session('msg') }}');
        </script>
    @endif

    @if (session()->get('class') == 'error')
        <script>
            toastr.options.timeOut = 1000;
            toastr.error('{{ session('msg') }}');
        </script>
    @endif
@endif
<script>
    function confirmDelete() {
        return confirm('Are you sure to delete ?');
    }
</script>
@stack('script')
