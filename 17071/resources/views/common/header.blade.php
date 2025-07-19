<head>
    <meta charset="utf-8" />
    <meta name="viewport"
        content="width=device-width, initial-scale=1.0, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0" />
    <meta name="description" content="" />
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <!-- Favicon -->
    <link rel="icon" type="image/x-icon"
        href="{{ route('uploads', ['folder' => 'assets', 'file' => 'favicon.png']) }}" />
    <style>
        .parent-icon {
            margin-right: 10px;
        }
    </style>
    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
        rel="stylesheet" />

    <!-- Icons -->
    <link rel="stylesheet" href="{{ publicPath('assets/') }}vendor/fonts/materialdesignicons.css" />
    <link rel="stylesheet" href="{{ publicPath('assets/') }}vendor/fonts/fontawesome.css" />
    <!-- Menu waves for no-customizer fix -->
    <link rel="stylesheet" href="{{ publicPath('assets/') }}vendor/libs/node-waves/node-waves.css" />

    <!-- Core CSS -->
    <link rel="stylesheet" href="{{ publicPath('assets/') }}vendor/css/rtl/core.css"
        class="template-customizer-core-css" />
    <link rel="stylesheet" href="{{ publicPath('assets/') }}vendor/css/rtl/theme-default.css"
        class="template-customizer-theme-css" />
    <link rel="stylesheet" href="{{ publicPath('assets/') }}css/demo.css" />
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <!-- Vendors CSS -->
    <link rel="stylesheet" href="{{ publicPath('assets/') }}vendor/libs/perfect-scrollbar/perfect-scrollbar.css" />
    <link rel="stylesheet" href="{{ publicPath('assets/') }}vendor/libs/typeahead-js/typeahead.css" />
    <link rel="stylesheet" href="{{ publicPath('assets/') }}vendor/libs/datatables-bs5/datatables.bootstrap5.css" />
    <link rel="stylesheet"
        href="{{ publicPath('assets/') }}vendor/libs/datatables-responsive-bs5/responsive.bootstrap5.css" />
    <link rel="stylesheet" href="{{ publicPath('assets/') }}vendor/libs/apex-charts/apex-charts.css" />
    <link rel="stylesheet" href="{{ publicPath('assets/') }}vendor/libs/swiper/swiper.css" />
    <link rel="stylesheet" href="{{ publicPath('assets/') }}vendor/libs/toastr/toastr.css" />
    @stack('header')
    <!-- Page CSS -->
    <link rel="stylesheet" href="{{ publicPath('assets/') }}vendor/css/pages/cards-statistics.css" />
    <!-- form css start-->
    <link rel="stylesheet" href="{{ publicPath('assets/') }}vendor/libs/flatpickr/flatpickr.css" />
    <link rel="stylesheet"
        href="{{ publicPath('assets/') }}vendor/libs/bootstrap-datepicker/bootstrap-datepicker.css" />
    <link rel="stylesheet"
        href="{{ publicPath('assets/') }}vendor/libs/bootstrap-daterangepicker/bootstrap-daterangepicker.css" />
    <link rel="stylesheet" href="{{ publicPath('assets/') }}vendor/libs/jquery-timepicker/jquery-timepicker.css" />
    <link rel="stylesheet" href="{{ publicPath('assets/') }}vendor/libs/pickr/pickr-themes.css" />
    <script src="{{ publicPath('assets/') }}vendor/js/helpers.js"></script>
    <script src="{{ publicPath('assets/') }}js/config.js"></script>
    <link rel="stylesheet" href="{{ publicPath('assets/') }}vendor/libs/spinkit/spinkit.css" />
    <style>
        .errorText {
            color: red;
            font-size: 12px;
        }

        .app-brand-link img {
            object-fit: contain;
        }

        .image {
            height: 50px !important;
            width: 50px !important;
            object-fit: contain;
        }
        .image img{

            object-fit: contain;
        }

        .background-overlay {
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
        }

        .menu-icon {
            height: 20px;
            width: 20px;
            object-fit: contain;
            filter: invert(20%) sepia(100%) saturate(3000%) hue-rotate(180deg) brightness(50%) contrast(100%);
        }

        .table-responsive {
            padding: 1rem;
        }

        .table th {
            padding: 0.5rem;
        }

        .table td {
            padding: 10px;
        }

        .loader-container {
            position: fixed;
            top: 0;
            flex-direction: column;
            left: 0;
            width: 100%;
            display: none;
            align-items: center;
            gap: 5px;
            justify-content: center;
            height: 100%;
            z-index: 2000 !important;
            background: rgba(0, 0, 0, 0.5);
        }

        .show {
            display: flex;
        }

        .loader {
            border: 6px solid rgba(0, 0, 0, 0.3);
            border-top: 6px solid #333;
            border-radius: 50%;
            width: 50px;
            height: 50px;
            animation: spin 1s linear infinite;
        }

        @keyframes spin {
            0% {
                transform: rotate(0deg);
            }

            100% {
                transform: rotate(360deg);
            }
        }

        .font-sm {
            font-size: 14px !important;
        }

        .font-x2s {
            font-size: 14px !important;
        }

        .text-xl {
            font-size: 45px !important;
        }
    </style>
</head>
